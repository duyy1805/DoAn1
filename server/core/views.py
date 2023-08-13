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
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import json

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

        print(all_arrays)
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
