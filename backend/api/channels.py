from channels.generic.websocket import WebsocketConsumer
import json
import time
import csv
import os

class DataConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        with open('./FB.csv', newline='') as csvfile:
            print ("Got here")
            stock_reader = csv.reader(csvfile)
            # Skip header row
            next(stock_reader)
            self.stock_data = list(stock_reader)


    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # data = 0
        # while data < 10:
        #     data += 1
        #     self.send(text_data=json.dumps({
        #         'x': self.stock_data[data][0],
        #         'y': self.stock_data[data][5],
        #     }))
        #     time.sleep(1)
        for time_value in self.stock_data:
            self.send(text_data=json.dumps({
                'x': time_value[0],
                'y': time_value[5],
            }))
            time.sleep(1)