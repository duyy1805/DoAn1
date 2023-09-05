import sys
import joblib
import pandas as pd
# from statsmodels.tsa.arima_model import ARIMAResultsWrapper


def main():
    if len(sys.argv) != 4 and len(sys.argv) != 3:
        print(
            "Sử dụng: python arima_model <arima.joblib> <timeseries.csv> n_periods")
        sys.exit(1)
    elif len(sys.argv) == 4:
        arima_model_name = sys.argv[1]
        time_series_file = sys.argv[2]
        n_periods = int(sys.argv[3])
        # Load ARIMA model from arima.joblib
        arima_model = joblib.load(arima_model_name)

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
        if 'arima_0_model.pkl' in arima_model_name:
            values['Data'].interpolate(method='linear', inplace=True)
        if 'arima_mean_model.pkl' in arima_model_name:
            values['Data'].fillna(values['Data'].mean(), inplace=True)
        if 'arima_forward_model.pkl' in arima_model_name:
            values['Data'].fillna(method='ffill', inplace=True)
        if 'arima_backward_model.pkl' in arima_model_name:
            values['Data'].fillna(method='bfill', inplace=True)

        # values.set_index('Time', inplace=True)

        arima_model.fit(values['Data'])
        # Make predictions using the ARIMA model
        predictions = arima_model.predict(n_periods=n_periods)
        # Print the predictions
        print("Predictions:", [round(pred, 2) for pred in predictions])

    elif len(sys.argv) == 3:
        arima_model = sys.argv[1]
        n_periods = int(sys.argv[2])
        # Load ARIMA model from arima.joblib
        arima_model = joblib.load(arima_model)

        predictions = arima_model.predict(n_periods=n_periods)
        # Print the predictions
        print("Predictions:", [round(pred, 2) for pred in predictions])


if __name__ == "__main__":
    main()
