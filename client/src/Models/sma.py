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

    ma_model_name = sys.argv[1]
    time_series_file = sys.argv[2]
    n_periods = int(sys.argv[3])
    # Load ARIMA model from arima.joblib
    best_alpha = joblib.load(ma_model_name)

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
        if 'sma_linear_model.pkl' in ma_model_name:
            values['Data'].interpolate(method='linear', inplace=True)
        if 'sma_mean_model.pkl' in ma_model_name:
            values['Data'].fillna(values['Data'].mean(), inplace=True)
        if 'sma_forward_model.pkl' in ma_model_name:
            values['Data'].fillna(method='ffill', inplace=True)
        if 'sma_backward_model.pkl' in ma_model_name:
            values['Data'].fillna(method='bfill', inplace=True)

    # values.set_index('Time', inplace=True)

    window_size = best_alpha

    # Tính giá trị trung bình trượt
    values['Moving_Average'] = values['Data'].rolling(
        window=window_size).mean()
    print(type(values))
    # Dự đoán nhiều giá trị tiếp theo
    for i in range(n_periods):
        # Tính giá trị trung bình trượt cho tập dữ liệu mở rộng
        new_average = values['Data'].iloc[-window_size:].mean()

        # Thêm giá trị dự đoán vào DataFrame
        values = values.append({'Time': None, 'Data': new_average,
                                'Moving_Average': new_average}, ignore_index=True)

    print("Predictions: ", values['Moving_Average'].tail(n_periods))


if __name__ == "__main__":
    main()
