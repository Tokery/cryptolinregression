from channels.generic.websocket import WebsocketConsumer
import json
import time
import csv
import os
import math

import numpy as np
from sklearn import linear_model
from scipy import stats
from scipy.stats import t
from functools import reduce

def lin_regress_prediction_interval(s_e, x, x_bar, n, s_xx, p):
    "Calculate the prediction interval for linear regression"
    return s_e * math.sqrt(1 + (1 / n) + ((x - x_bar)**2)/s_xx) * t.ppf((1-p) / 2, n - 2)

class DataConsumer(WebsocketConsumer):
    def _getFileData(self):
        with open('./FB.csv', newline='') as csvfile:
            stock_reader = csv.reader(csvfile)
            # Skip header row
            next(stock_reader)
            day = 0
            for row in stock_reader:
                day += 1
                self.dates.append(day)
                self.realDays.append(row[0])
                self.prices.append(float(row[5]))

    def connect(self):
        self.accept()
        self.dates = []
        self.prices = []
        self.realDays = []
        self._getFileData()
        
        # self.linear_mod = linear_model.LinearRegression() #defining the linear regression
        # dates = np.reshape(self.dates, (len(self.dates), 1)) # convert to nx1 matrix (n rows, 1 column)
        # prices = np.reshape(self.prices, (len(self.prices), 1)) 
        #self.linear_mod.fit(dates, prices) # fit the data points to the model (Learn from the model)

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
                # 'prediction': self.linear_mod.predict(index + 1)[0][0]
                'prediction': self.slope * index + self.intercept,
                # Calculate the 95% confidence interval of the prediction
                'error': lin_regress_prediction_interval(self.s_e, index, self.x_bar, len(self.dates), self.s_xx, 0.95)
            }))
            time.sleep(0.25)