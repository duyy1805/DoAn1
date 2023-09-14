import sys
import joblib
import pandas as pd
import numpy as np
# from statsmodels.tsa.arima_model import ARIMAResultsWrapper


def main():
    if len(sys.argv) != 4:
        print(
            "Sử dụng: python arima_model <arima.joblib> <timeseries.csv> n_periods")
        sys.exit(1)

    n_input = 12
    n_features = 1

    rnn_model_name = sys.argv[1]
    time_series_file = sys.argv[2]
    n_periods = int(sys.argv[3])
    # Load ARIMA model from arima.joblib
    rnn_model, scaler = joblib.load(rnn_model_name)

    # Load time series data from timeseries.csv
    # Assuming the column name is 'value'
    values = pd.read_csv(time_series_file)
    values = values.rename(columns={values.columns[0]: 'Time'})
    values = values.rename(columns={values.columns[1]: 'Data'})

    if isinstance(values['Data'][0], str):
        values['Data'] = values['Data'].apply(lambda x: float(
            x) if x.replace('.', '', 1).isdigit() else None)
    missing_values_count = values.isna().sum().sum()

    if missing_values_count != 0:
        if 'rnn_0_model.pkl' in rnn_model_name:
            values['Data'].interpolate(method='linear', inplace=True)
        if 'rnn_mean_model.pkl' in rnn_model_name:
            values['Data'].fillna(values['Data'].mean(), inplace=True)
        if 'rnn_forward_model.pkl' in rnn_model_name:
            values['Data'].fillna(method='ffill', inplace=True)
        if 'rnn_backward_model.pkl' in rnn_model_name:
            values['Data'].fillna(method='bfill', inplace=True)

    values.set_index('Time', inplace=True)

    scaled_train = scaler.transform(values)

    test_predictions = []
    first_eval_batch = scaled_train[-n_input:]
    current_batch = first_eval_batch.reshape((1, n_input, n_features))
    for i in range(n_periods):
        # get the prediction value for the first batch
        current_pred = rnn_model.predict(current_batch)[0]

        # append the prediction into the array
        test_predictions.append(current_pred)

        # use the prediction to update the batch and remove the first value
        current_batch = np.append(current_batch[:, 1:, :], [
            [current_pred]], axis=1)

    predictions = scaler.inverse_transform(test_predictions)

    # Print the predictions
    print("Predictions:", [[round(value[0], 2)] for value in predictions])


if __name__ == "__main__":
    main()
