import pandas_datareader.data as pdr
import fix_yahoo_finance as fix 
import time
fix.pdr_override()


def get_stock_data(ticker, start_date, end_date):
    """
    Gets stock data for given ticker between the given dates
    :return: Pandas dataframe with [Date, Open, High, Low, Close, Adj Close]

    Function inspired by https://github.com/VivekPa/NeuralNetworkStocks/blob/master/get_prices.py
    """
    attempts = 1
    try:
        all_data = pdr.get_data_yahoo(ticker, start_date, end_date)
    except ValueError:
        print("ValueError, trying again")
        attempts += 1
        if attempts < 5:
            time.sleep(10)
            get_stock_data(ticker, start_date, end_date)
        else:
            print("Tried 5 times, Yahoo error. Trying after 2 minutes")
            time.sleep(120)
            get_stock_data(ticker, start_date, end_date)
    stock_data = all_data
    return stock_data
