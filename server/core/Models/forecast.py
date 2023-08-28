import sys
import joblib
import pandas as pd
# from statsmodels.tsa.arima_model import ARIMAResultsWrapper


def main():
    if len(sys.argv) != 4:
        print(
            "Sử dụng: python arima_model <arima.joblib> <timeseries.csv> n_periods")
        sys.exit(1)

    arima_model = sys.argv[1]
    time_series_file = sys.argv[2]
    n_periods = int(sys.argv[3])
    # Load ARIMA model from arima.joblib
    arima_model = joblib.load(arima_model)

    # Load time series data from timeseries.csv
    # Assuming the column name is 'value'
    values = pd.read_csv(time_series_file)
    values = values.rename(columns={values.columns[0]: 'Time'})
    values = values.rename(columns={values.columns[1]: 'Data'})
    # values.set_index('Time', inplace=True)

    arima_model.fit(values['Data'])
    # Make predictions using the ARIMA model
    predictions = arima_model.predict(n_periods=n_periods)
    # Print the predictions
    print("Predictions:", [round(pred, 2) for pred in predictions])


if __name__ == "__main__":
    main()
