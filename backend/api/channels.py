from channels.generic.websocket import WebsocketConsumer
from get_stock_data import get_stock_data
from functools import reduce
import json
import time
import os
import math

import numpy as np
from scipy import stats
from scipy.stats import t

def lin_regress_prediction_interval(s_e, x, x_bar, n, s_xx, p):
    "Calculate the prediction interval for linear regression"
    return s_e * math.sqrt(1 + (1 / n) + ((x - x_bar)**2)/s_xx) * t.ppf((1-p) / 2, n - 2)

class DataConsumer(WebsocketConsumer):
    def _getFileData(self):
        stock_data = get_stock_data("FB", "2017-01-03", "2017-12-29")
        idx = 0
        for row in stock_data.itertuples():
            idx += 1
            self.dates.append(idx)
            self.realDays.append(row.Index.strftime("%Y-%m-%d"))
            self.prices.append(float(row._5))

    def connect(self):
        self.accept()
        self.dates = []
        self.prices = []
        self.realDays = []
        self._getFileData()

        # std_err is the standard error (deviation) of the estimated gradient
        # s_e is the estimator of the standard deviation of the population
        self.x_bar = sum(self.dates) / len(self.dates)
        self.s_xx = reduce((lambda x, y: x + (y - self.x_bar)**2), self.dates)
        self.slope, self.intercept, _, _, std_err_gradient = stats.linregress(self.dates, self.prices)
        # The following is calculated knowing that the estimator of the gradient has a standard deviation of pop_std_dev/sqrt(s_xx)
        # s_e is the residual standard error (An estimate for the std. dev of the errors)
        # Very similar to std. dev of residuals
        self.s_e = std_err_gradient * math.sqrt(self.s_xx)
        

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        for index, price in enumerate(self.prices):
            self.send(text_data=json.dumps({
                'x': self.realDays[index],
                'y': price,
                'prediction': self.slope * index + self.intercept,
                # Calculate the 95% confidence interval of the prediction
                'error': lin_regress_prediction_interval(self.s_e, index, self.x_bar, len(self.dates), self.s_xx, 0.95)
            }))
            time.sleep(0.25)