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
        print(filename)
        print(request.data['test'])
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
        print(dataColumn)
        values = read_csv(file_obj)

        values[timeColumn] = pd.to_datetime(
            values[timeColumn], errors='coerce')

        missing_values_count = values.isna().sum().sum()
        print(missing_values_count)
        values = values.rename(columns={'Sales': 'Data'})
        values['ID'] = 'Duy'
        # adf_test = ADFTest(alpha=0.05)
        # adf_test.should_diff(values)

        features = extract_features(
            values, column_id='ID', column_sort='Month', n_jobs=8)

        data1 = features.Data__sum_values
        data2 = features.Data__maximum
        return Response({
            "data1": data1,
            "data2": data2})
