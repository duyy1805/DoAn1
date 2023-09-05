import sys
import joblib
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
# from statsmodels.tsa.arima_model import ARIMAResultsWrapper


def main():
    if len(sys.argv) != 4:
        print(
            "Sử dụng: python arima_model <arima.joblib> <timeseries.csv> n_periods")
        sys.exit(1)

    n_input = 12
    n_features = 1

    ses_model_name = sys.argv[1]
    time_series_file = sys.argv[2]
    n_periods = int(sys.argv[3])
    # Load ARIMA model from arima.joblib
    ses_model, best_alpha = joblib.load(ses_model_name)

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
        if 'ses_0_model.pkl' in ses_model_name:
            values['Data'].interpolate(method='linear', inplace=True)
        if 'ses_mean_model.pkl' in ses_model_name:
            values['Data'].fillna(values['Data'].mean(), inplace=True)
        if 'ses_forward_model.pkl' in ses_model_name:
            values['Data'].fillna(method='ffill', inplace=True)
        if 'ses_backward_model.pkl' in ses_model_name:
            values['Data'].fillna(method='bfill', inplace=True)

    values.set_index('Time', inplace=True)

    final_model = SimpleExpSmoothing(
        values).fit(smoothing_level=best_alpha)

    predictions = final_model.forecast(n_periods)

    # Print the predictions
    print("Predictions:", predictions.values)


if __name__ == "__main__":
    main()
