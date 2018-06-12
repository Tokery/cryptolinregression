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
        self.x_bar = sum(self.dates) / len(self.dates)
        self.s_xx = reduce((lambda x, y: x + (y - self.x_bar)**2), self.dates)
        self.slope, self.intercept, _, _, std_err = stats.linregress(self.dates, self.prices)
        self.s_e = std_err * math.sqrt(self.s_xx)
        
        

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
                'error': self.s_e * math.sqrt(1 + (1 / len(self.dates)) + ((index - self.x_bar)**2)/self.s_xx) * t.ppf(0.025, len(self.dates)- 2)
            }))
            time.sleep(0.25)