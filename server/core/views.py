import joblib
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import views
from rest_framework import permissions
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.views import APIView
from .models import Times, Client, Employee
from .serializers import SalesSerializer, ClientSerializer, EmployeeSerializer
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from statsmodels.tsa.seasonal import seasonal_decompose
import statsmodels.tsa.api as smt
import itertools
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import json
import joblib
import warnings
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM

import pandas as pd
import numpy as np
from pandas import read_csv
from pmdarima.arima import auto_arima
from datetime import datetime
import matplotlib.pyplot as plt
from pmdarima.arima import ADFTest
from tsfresh import extract_features

warnings.filterwarnings("ignore", category=FutureWarning,)


class ClientView(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class EmployeeView(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class SalesView(viewsets.ModelViewSet):
    queryset = Times.objects.all()
    serializer_class = SalesSerializer
    allowed_methods = ['post']


class FileUploadView(views.APIView):
    # parser_classes = [FileUploadParser]
    parser_classes = [MultiPartParser]

    def post(self, request, filename, format=None):
        file_obj = request.data['file']

        values = read_csv(file_obj)

        values['Month'] = pd.to_datetime(values['Month'], errors='coerce')
        values.set_index('Month', inplace=True)

        adf_test = ADFTest(alpha=0.05)
        adf_test.should_diff(values)

        from sklearn.model_selection import train_test_split
        train, test = train_test_split(values, test_size=0.2, shuffle=False)

        arima_model = auto_arima(train, start_p=0, d=1, start_q=0,
                                 max_p=5, max_d=5, max_q=5, start_P=0,
                                 D=1, start_Q=0, max_P=5, max_D=5,
                                 max_Q=5, m=12, seasonal=True,
                                 error_action='warn', trace=True,
                                 supress_warnings=True, stepwise=True,
                                 random_state=20, n_fits=50)

        prediction = pd.DataFrame(
            arima_model.predict(n_periods=21), index=test.index)
        prediction.columns = ['predicted_values']
        prediction.reset_index(inplace=True)

        index_future_dates = pd.date_range(
            start='2021-10-01', end='2023-01-1', freq='MS')
        prediction_arima = pd.DataFrame(arima_model.predict(
            n_periods=36), index=index_future_dates)
        prediction_arima.columns = ['predicted_values']

        ################################################################################

        rnn_train = values[:93]
        rnn_test = values[93:]

        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()

        scaler.fit(rnn_train)
        scaled_train = scaler.transform(rnn_train)
        scaled_test = scaler.transform(rnn_test)

        from keras.preprocessing.sequence import TimeseriesGenerator

        # define generator
        n_input = 12
        n_features = 1
        generator = TimeseriesGenerator(
            scaled_train, scaled_train, length=n_input, batch_size=1)

        from keras.models import Sequential
        from keras.layers import Dense
        from keras.layers import LSTM

        # define model
        model = Sequential()
        model.add(LSTM(100, activation='relu',
                  input_shape=(n_input, n_features)))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mse')

        model.summary()
        model.fit(generator, epochs=50)

        last_train_batch = scaled_train[-12:]
        last_train_batch = last_train_batch.reshape((1, n_input, n_features))
        model.predict(last_train_batch)

        test_predictions = []

        first_eval_batch = scaled_train[-n_input:]
        current_batch = first_eval_batch.reshape((1, n_input, n_features))

        for i in range(len(rnn_test)):
            # get the prediction value for the first batch
            current_pred = model.predict(current_batch)[0]

            # append the prediction into the array
            test_predictions.append(current_pred)

            # use the prediction to update the batch and remove the first value
            current_batch = np.append(current_batch[:, 1:, :], [
                                      [current_pred]], axis=1)

        true_predictions = scaler.inverse_transform(test_predictions)
        rnn_test['Predictions'] = true_predictions

        return Response({
            "data1": prediction.to_json(),
            "data2": rnn_test.to_json(),
            "data3": prediction_arima.to_json()})


class FileUpload(views.APIView):
    # parser_classes = [FileUploadParser]
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']

        values = read_csv(file_obj)

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})

        # print(missing_values_count)
        values = values.rename(columns={dataColumn: 'Data'})
        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)

        missing_values_count = values.isna().sum().sum()
        values_count = len(values.index)
        values['ID'] = 'Duy'
        # adf_test = ADFTest(alpha=0.05)
        # adf_test.should_diff(values)
        if missing_values_count != 0:
            values.fillna(values['Data'].mean(), inplace=True)

        features = extract_features(
            values, column_id='ID', column_sort='Time', n_jobs=8)

        response_data = {
            "values_count": round(values_count, 2),
            "missing_values_count": round(missing_values_count, 2),
            "sum_values": round(features.Data__sum_values[0], 2),
            "max_values": round(features.Data__maximum[0], 2),
            "min_values": round(features.Data__minimum[0], 2),
            "mean_values": round(features.Data__mean[0], 2),
            "median_values": round(features.Data__median[0], 2),
            "std_values": round(features.Data__standard_deviation[0], 2),
            "variance_values": round(features.Data__variance[0], 2),
            "skewness_values": round(features.Data__skewness[0], 2),
        }
        return Response(response_data)


class AutoArima(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = ['0', 'mean', 'backward', 'forward']
        all_arrays = []
        all_mae = []
        all_mse = []
        test_size = float(test_size)
        values = read_csv(file_obj)

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})

        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        missing_values_count = values.isna().sum().sum()

        if missing_values_count != 0:
            fill_method = ['0', 'mean', 'backward', 'forward']
        else:
            fill_method = ['1']

        freq = pd.infer_freq(values["Time"])
        for method in fill_method:
            if missing_values_count != 0:
                if method == '0':
                    values['Data'].fillna(0, inplace=True)
                if method == 'mean':
                    values['Data'].fillna(values['Data'].mean, inplace=True)
                if method == 'forward':
                    values['Data'].fillna(method='ffill', inplace=True)
                if method == 'backward':
                    values['Data'].fillna(method='bfill', inplace=True)

            values.set_index('Time', inplace=True)

            adf_test = ADFTest(alpha=0.05)
            adf_test.should_diff(values)

            from sklearn.model_selection import train_test_split
            train, test = train_test_split(
                values, test_size=test_size, shuffle=False)

            arima_model = auto_arima(train, start_p=0, d=1, start_q=0,
                                     max_p=2, max_d=2, max_q=2, start_P=0,
                                     D=1, start_Q=0, max_P=2, max_D=2,
                                     max_Q=2, m=12, seasonal=True,
                                     error_action='warn', trace=True,
                                     supress_warnings=True, stepwise=True,
                                     random_state=20, n_fits=50)

            n_periods = test.shape[0]
            prediction = pd.DataFrame(
                arima_model.predict(n_periods=n_periods), index=test.index)
            prediction.columns = ['predicted_values']
            prediction.reset_index(inplace=True)

            # Lưu mô hình vào thư mục "models"
            model = arima_model
            model_folder = "../client/src/Models"
            model_filename = f"auto_arima_{method}_model.pkl"
            model_path = f"{model_folder}/{model_filename}"

            # Tạo thư mục nếu chưa tồn tại
            import os
            os.makedirs(model_folder, exist_ok=True)

            # Lưu mô hình
            joblib.dump(model, model_path)

            mae = mean_absolute_error(
                test['Data'], prediction['predicted_values'])

            mse = mean_squared_error(
                test['Data'], prediction['predicted_values'])
            x = values.index[train.shape[0]]
            print(x)
            n_periods = test.shape[0] + 12

            index_future_dates = pd.date_range(
                start=x, periods=n_periods, freq=freq)

            prediction_auto_arima = pd.DataFrame(arima_model.predict(
                n_periods=n_periods), index=index_future_dates)
            prediction_auto_arima.columns = ['predicted_values']
            prediction_auto_arima.reset_index(inplace=True)
            prediction_auto_arima = prediction_auto_arima.tail(12)

            all_mae.append(round(mae, 2))
            all_mse.append(round(mse, 2))
            all_arrays.append(prediction.to_json())
            values.reset_index(inplace=True)

        ###############################################################################

        return Response({
            "data1": all_arrays,
            "data2": prediction_auto_arima.to_json(),
            "mae": all_mae,
            "mse": all_mse,
        })


class Arima(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = request.data['fill_method']

        p = int(request.data['p'])
        d = int(request.data['d'])
        q = int(request.data['q'])
        P = int(request.data['P'])
        D = int(request.data['D'])
        m = int(request.data['m'])
        Q = int(request.data['Q'])
        stationarity = request.data['stationarity']
        invertibility = request.data['invertibility']
        concentrate_scale = request.data['concentrate_scale']

        test_size = float(test_size)
        values = read_csv(file_obj)

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})
        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        freq = pd.infer_freq(values["Time"])

        missing_values_count = values.isna().sum().sum()
        if missing_values_count != 0:
            # if fill_method == 'delete':
            #     values = values[~(values.isna().any(axis=1))]
            if fill_method == '0':
                values['Data'].fillna(0, inplace=True)
            if fill_method == 'mean':
                values['Data'].fillna(values['Data'].mean, inplace=True)
            if fill_method == 'forward':
                values['Data'].fillna(method='ffill', inplace=True)
            if fill_method == 'backward':
                values['Data'].fillna(method='bfill', inplace=True)

        values.set_index('Time', inplace=True)

        adf_test = ADFTest(alpha=0.05)
        adf_test.should_diff(values)

        from sklearn.model_selection import train_test_split
        train, test = train_test_split(
            values, test_size=test_size, shuffle=False)

        arima_model = ARIMA(train, exog=None, order=(p, d, q), seasonal_order=(P, D, Q, m),
                            trend=None, enforce_stationarity=stationarity, enforce_invertibility=invertibility,
                            concentrate_scale=concentrate_scale, trend_offset=1, dates=None, freq=freq,
                            missing='none', validate_specification=False)
        model_fit = arima_model.fit()
        n_periods = test.shape[0]
        prediction = pd.DataFrame(
            model_fit.forecast(n_periods), index=test.index)
        prediction.columns = ['predicted_values']
        prediction.reset_index(inplace=True)

        x = values.index[train.shape[0]]
        print(x)
        n_periods = test.shape[0] + 12

        index_future_dates = pd.date_range(
            start=x, periods=n_periods, freq=freq)

        prediction_arima = pd.DataFrame(
            model_fit.forecast(n_periods), index=index_future_dates)
        prediction_arima.columns = ['predicted_values']
        prediction_arima.reset_index(inplace=True)

        prediction_arima = prediction_arima.tail(12)
        print(prediction_arima)
        return Response({
            "data1": prediction.to_json(),
            "data2": prediction_arima.to_json()
        })


class RNN(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = ['0', 'mean', 'backward', 'forward']
        all_arrays = []
        all_mae = []
        all_mse = []
        test_size = float(test_size)
        values = read_csv(file_obj)

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})

        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        missing_values_count = values.isna().sum().sum()

        freq = pd.infer_freq(values["Time"])

        if missing_values_count != 0:
            fill_method = ['0', 'mean', 'backward', 'forward']
        else:
            fill_method = ['1']
        for method in fill_method:
            if missing_values_count != 0:
                if method == '0':
                    values['Data'].fillna(0, inplace=True)
                if method == 'mean':
                    values['Data'].fillna(values['Data'].mean, inplace=True)
                if method == 'forward':
                    values['Data'].fillna(method='ffill', inplace=True)
                if method == 'backward':
                    values['Data'].fillna(method='bfill', inplace=True)

            values.set_index('Time', inplace=True)

            adf_test = ADFTest(alpha=0.05)
            adf_test.should_diff(values)

            from sklearn.model_selection import train_test_split
            train, test = train_test_split(
                values, test_size=test_size, shuffle=False)

            rnn_train = train
            rnn_test = test

            from sklearn.preprocessing import MinMaxScaler
            scaler = MinMaxScaler()

            scaler.fit(rnn_train)
            scaled_train = scaler.transform(rnn_train)
            scaled_test = scaler.transform(rnn_test)

            from keras.preprocessing.sequence import TimeseriesGenerator

            # define generator
            n_input = 12
            n_features = 1
            generator = TimeseriesGenerator(
                scaled_train, scaled_train, length=n_input, batch_size=1)

            # define model
            model = Sequential()
            model.add(LSTM(100, activation='relu',
                           input_shape=(n_input, n_features)))
            model.add(Dense(1))
            model.compile(optimizer='adam', loss='mse')

            model.summary()
            model.fit(generator, epochs=50)

            last_train_batch = scaled_train[-12:]
            last_train_batch = last_train_batch.reshape(
                (1, n_input, n_features))
            model.predict(last_train_batch)

            # Lưu mô hình vào thư mục "models"
            model_folder = "core/Models"
            model_filename = f"rnn_{method}_model.pkl"
            model_path = f"{model_folder}/{model_filename}"

            # Tạo thư mục nếu chưa tồn tại
            import os
            os.makedirs(model_folder, exist_ok=True)

            # Lưu mô hình
            joblib.dump(model, model_path)
            test_predictions = []

            first_eval_batch = scaled_train[-n_input:]
            current_batch = first_eval_batch.reshape((1, n_input, n_features))

            for i in range(len(rnn_test)):
                # get the prediction value for the first batch
                current_pred = model.predict(current_batch)[0]

                # append the prediction into the array
                test_predictions.append(current_pred)

                # use the prediction to update the batch and remove the first value
                current_batch = np.append(current_batch[:, 1:, :], [
                    [current_pred]], axis=1)

            true_predictions = scaler.inverse_transform(test_predictions)
            rnn_test['Predictions'] = true_predictions
            mae = mean_absolute_error(
                test['Data'], rnn_test['Predictions'])

            mse = mean_squared_error(
                test['Data'], rnn_test['Predictions'])
            rnn_test.reset_index(inplace=True)

            all_mae.append(round(mae, 2))
            all_mse.append(round(mse, 2))
            all_arrays.append(rnn_test.to_json())
            values.reset_index(inplace=True)
        return Response({
            "data1": all_arrays,
            "mae": all_mae,
            "mse": all_mse,
        })


class SES(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = ['0', 'mean', 'backward', 'forward']
        all_arrays = []
        all_mae = []
        all_mse = []
        test_size = float(test_size)
        values = read_csv(file_obj)

        def ses_optimizer(train, alphas, step):

            best_alpha, best_mae = None, float("inf")

            for alpha in alphas:
                ses_model = SimpleExpSmoothing(
                    train).fit(smoothing_level=alpha)
                y_pred = ses_model.forecast(step)
                mae = mean_absolute_error(test, y_pred)

                if mae < best_mae:
                    best_alpha, best_mae = alpha, mae

            return best_alpha, best_mae

        def ses_model_tuning(train, test, step, title="Model Tuning - Single Exponential Smoothing"):
            alphas = np.arange(0.8, 1, 0.01)
            best_alpha, best_mae = ses_optimizer(train, alphas, step=step)
            final_model = SimpleExpSmoothing(
                train).fit(smoothing_level=best_alpha)
            y_pred = final_model.forecast(step)
            mae = mean_absolute_error(test, y_pred)
            mse = mean_squared_error(test, y_pred)
            return y_pred, mae, mse

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})

        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        missing_values_count = values.isna().sum().sum()

        freq = pd.infer_freq(values["Time"])

        if missing_values_count != 0:
            fill_method = ['0', 'mean', 'backward', 'forward']
        else:
            fill_method = ['1']
        for method in fill_method:
            if missing_values_count != 0:
                if method == '0':
                    values['Data'].fillna(0, inplace=True)
                if method == 'mean':
                    values['Data'].fillna(values['Data'].mean, inplace=True)
                if method == 'forward':
                    values['Data'].fillna(method='ffill', inplace=True)
                if method == 'backward':
                    values['Data'].fillna(method='bfill', inplace=True)

            values.set_index('Time', inplace=True)

            adf_test = ADFTest(alpha=0.05)
            adf_test.should_diff(values)

            from sklearn.model_selection import train_test_split
            train, test = train_test_split(
                values, test_size=test_size, shuffle=False)

            # define model
            model = SimpleExpSmoothing(
                train, initialization_method="heuristic")
            fit1 = model.fit(smoothing_level=0.2, optimized=False)

            fcast1, mae, mse = ses_model_tuning(
                train, test, step=test.shape[0])
            prediction = pd.DataFrame(fcast1, index=test.index)

            prediction.columns = ['Predictions']

            # mae = mean_absolute_error(
            #     test['Data'], prediction['Predictions'])

            # mse = mean_squared_error(
            #     test['Data'], prediction['Predictions'])
            prediction.reset_index(inplace=True)

            all_mae.append(round(mae, 2))
            all_mse.append(round(mse, 2))
            all_arrays.append(prediction.to_json())

            values.reset_index(inplace=True)
        return Response({
            "data1": all_arrays,
            "mae": all_mae,
            "mse": all_mse,
        })


class DES(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = ['0', 'mean', 'backward', 'forward']
        all_arrays = []
        all_mae = []
        all_mse = []
        test_size = float(test_size)
        values = read_csv(file_obj)

        def des_optimizer(train, alphas, betas, trend, step):

            best_alpha, best_beta, best_mae = None, None, float("inf")

            for alpha in alphas:
                for beta in betas:
                    des_model = ExponentialSmoothing(train, trend=trend).fit(
                        smoothing_level=alpha, smoothing_slope=beta)
                    y_pred = des_model.forecast(step)
                    mae = mean_absolute_error(test, y_pred)
                    if mae < best_mae:
                        best_alpha, best_beta, best_mae = alpha, beta, mae

            return best_alpha, best_beta, best_mae

        def des_model_tuning(train, test, step, trend, title="Model Tuning - Double Exponential Smoothing"):
            alphas = np.arange(0.01, 1, 0.10)
            betas = np.arange(0.01, 1, 0.10)
            best_alpha, best_beta, best_mae = des_optimizer(
                train, alphas, betas, trend=trend, step=step)
            final_model = ExponentialSmoothing(train, trend=trend).fit(
                smoothing_level=best_alpha, smoothing_slope=best_beta)
            y_pred = final_model.forecast(step)
            mae = mean_absolute_error(test, y_pred)
            mse = mean_squared_error(test, y_pred)
            return y_pred, mae, mse

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})

        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        missing_values_count = values.isna().sum().sum()

        freq = pd.infer_freq(values["Time"])

        if missing_values_count != 0:
            fill_method = ['0', 'mean', 'backward', 'forward']
        else:
            fill_method = ['1']
        for method in fill_method:
            if missing_values_count != 0:
                if method == '0':
                    values['Data'].fillna(0, inplace=True)
                if method == 'mean':
                    values['Data'].fillna(values['Data'].mean, inplace=True)
                if method == 'forward':
                    values['Data'].fillna(method='ffill', inplace=True)
                if method == 'backward':
                    values['Data'].fillna(method='bfill', inplace=True)

            values.set_index('Time', inplace=True)

            adf_test = ADFTest(alpha=0.05)
            adf_test.should_diff(values)

            from sklearn.model_selection import train_test_split
            train, test = train_test_split(
                values, test_size=test_size, shuffle=False)

            # define model
            model = SimpleExpSmoothing(
                train, initialization_method="heuristic")
            fit1 = model.fit(smoothing_level=0.2, optimized=False)

            fcast1, mae, mse = des_model_tuning(
                train, test, step=test.shape[0], trend='add')
            prediction = pd.DataFrame(fcast1, index=test.index)

            prediction.columns = ['Predictions']

            prediction.reset_index(inplace=True)

            all_mae.append(round(mae, 2))
            all_mse.append(round(mse, 2))
            all_arrays.append(prediction.to_json())

            values.reset_index(inplace=True)
        return Response({
            "data1": all_arrays,
            "mae": all_mae,
            "mse": all_mse,
        })


class TES(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = ['0', 'mean', 'backward', 'forward']
        all_arrays = []
        all_mae = []
        all_mse = []
        test_size = float(test_size)
        values = read_csv(file_obj)

        def tes_optimizer(train, abg, trend, seasonal,  seasonal_periods, step):
            best_alpha, best_beta, best_gamma, best_mae = None, None, None, float(
                "inf")
            for comb in abg:
                tes_model = ExponentialSmoothing(train, trend=trend, seasonal=seasonal, seasonal_periods=seasonal_periods).\
                    fit(smoothing_level=comb[0], smoothing_slope=comb[1],
                        smoothing_seasonal=comb[2])
                y_pred = tes_model.forecast(step)
                mae = mean_absolute_error(test, y_pred)
                if mae < best_mae:
                    best_alpha, best_beta, best_gamma, best_mae = comb[0], comb[1], comb[2], mae

            return best_alpha, best_beta, best_gamma, best_mae

        def tes_model_tuning(train, test, step, trend, seasonal, seasonal_periods, title="Model Tuning - Triple Exponential Smoothing"):
            alphas = betas = gammas = np.arange(0.10, 1, 0.10)
            abg = list(itertools.product(alphas, betas, gammas))
            best_alpha, best_beta, best_gamma, best_mae = tes_optimizer(
                train, abg=abg, trend=trend, seasonal=seasonal, seasonal_periods=seasonal_periods, step=step)
            final_model = ExponentialSmoothing(train, trend=trend, seasonal=seasonal).fit(
                smoothing_level=best_alpha, smoothing_slope=best_beta, smoothing_seasonal=best_gamma)
            y_pred = final_model.forecast(step)
            mae = mean_absolute_error(test, y_pred)
            mse = mean_squared_error(test, y_pred)
            return y_pred, mae, mse

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})

        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        missing_values_count = values.isna().sum().sum()

        freq = pd.infer_freq(values["Time"])

        if missing_values_count != 0:
            fill_method = ['0', 'mean', 'backward', 'forward']
        else:
            fill_method = ['1']
        for method in fill_method:
            if missing_values_count != 0:
                if method == '0':
                    values['Data'].fillna(0, inplace=True)
                if method == 'mean':
                    values['Data'].fillna(values['Data'].mean, inplace=True)
                if method == 'forward':
                    values['Data'].fillna(method='ffill', inplace=True)
                if method == 'backward':
                    values['Data'].fillna(method='bfill', inplace=True)

            values.set_index('Time', inplace=True)

            adf_test = ADFTest(alpha=0.05)
            adf_test.should_diff(values)

            from sklearn.model_selection import train_test_split
            train, test = train_test_split(
                values, test_size=test_size, shuffle=False)

            # define model
            model = SimpleExpSmoothing(
                train, initialization_method="heuristic")

            fit1 = model.fit(smoothing_level=0.2, optimized=False)

            fcast1, mae, mse = tes_model_tuning(
                train, test, step=test.shape[0], trend='add', seasonal='add', seasonal_periods=12)
            prediction = pd.DataFrame(fcast1, index=test.index)

            prediction.columns = ['Predictions']

            prediction.reset_index(inplace=True)

            all_mae.append(round(mae, 2))
            all_mse.append(round(mse, 2))
            all_arrays.append(prediction.to_json())

            values.reset_index(inplace=True)
        return Response({
            "data1": all_arrays,
            "mae": all_mae,
            "mse": all_mse,
        })


class MA(views.APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.data['file']
        timeColumn = request.data['timeColumn']
        dataColumn = request.data['dataColumn']
        test_size = request.data['test_size']
        fill_method = ['0', 'mean', 'backward', 'forward']
        all_arrays = []
        all_mae = []
        all_mse = []
        test_size = float(test_size)
        values = read_csv(file_obj)

        def ma_optimizer(data, test_size):
            df1 = data.copy()
            best_alpha, best_mae = None, float("inf")

            for alpha in range(2, 13):
                df1['moving_avg_forecast'] = values['Data'].rolling(
                    alpha).mean()
                train1, test1 = train_test_split(
                    df1, test_size=test_size, shuffle=False)

                y_hat_avg = test1.copy()
                mae = mean_squared_error(
                    test.Data, y_hat_avg.moving_avg_forecast)

                if mae < best_mae:
                    best_alpha, best_mae = alpha, mae

            return best_alpha, best_mae

        def ma_model_tuning(data, test_size, title="Model Tuning - Moving average"):
            df1 = data.copy()
            best_alpha, best_mae = ma_optimizer(data, test_size)

            df1['moving_avg_forecast'] = values['Data'].rolling(
                best_alpha).mean()
            train1, test1 = train_test_split(
                df1, test_size=test_size, shuffle=False)

            y_hat_avg = test1.copy()
            mae = mean_absolute_error(test.Data, y_hat_avg.moving_avg_forecast)
            mse = mean_squared_error(test.Data, y_hat_avg.moving_avg_forecast)
            y_hat_avg = y_hat_avg.moving_avg_forecast

            return y_hat_avg, mae, mse

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')
        values = values.rename(columns={timeColumn: 'Time'})
        values = values.rename(columns={dataColumn: 'Data'})

        if isinstance(values['Data'][0], str):
            values['Data'] = values['Data'].apply(lambda x: float(
                x) if x.replace('.', '', 1).isdigit() else None)
        missing_values_count = values.isna().sum().sum()

        freq = pd.infer_freq(values["Time"])

        if missing_values_count != 0:
            fill_method = ['0', 'mean', 'backward', 'forward']
        else:
            fill_method = ['1']
        for method in fill_method:
            if missing_values_count != 0:
                if method == '0':
                    values['Data'].fillna(0, inplace=True)
                if method == 'mean':
                    values['Data'].fillna(values['Data'].mean, inplace=True)
                if method == 'forward':
                    values['Data'].fillna(method='ffill', inplace=True)
                if method == 'backward':
                    values['Data'].fillna(method='bfill', inplace=True)

            values.set_index('Time', inplace=True)

            adf_test = ADFTest(alpha=0.05)
            adf_test.should_diff(values)

            from sklearn.model_selection import train_test_split
            train, test = train_test_split(
                values, test_size=test_size, shuffle=False)

            # define model

            fcast1, mae, mse = ma_model_tuning(values, test_size=test_size)

            prediction = pd.DataFrame(fcast1, index=test.index)

            prediction.columns = ['Predictions']
            prediction.reset_index(inplace=True)

            all_mae.append(round(mae, 2))
            all_mse.append(round(mse, 2))
            all_arrays.append(prediction.to_json())

            values.reset_index(inplace=True)
        return Response({
            "data1": all_arrays,
            "mae": all_mae,
            "mse": all_mse,
        })
