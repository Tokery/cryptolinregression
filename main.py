import csv
import numpy as np
from sklearn import linear_model
import matplotlib.pyplot as plt

dates = [26, 25, 24, 23, 22, 19, 18, 17, 16, 12, 11, 10, 9, 8, 5, 4, 3, 2, 1]
prices = [708.58, 700.01, 688.92, 701.45, 707.45, 695.03, 710.0, 699.0, 692.98, 690.26, 675.0, 686.86, 672.32, 667.85, 703.87, 722.81, 770.22, 784.5, 750.46]

def get_data(filename):
    with open(filename, 'r') as csvfile:
        csvFileReader = csv.reader(csvfile)
        next(csvFileReader) # Skip column headers
        for row in csvFileReader:
            dates.append(int(row[0]))
            prices.append(float(row[1]))
    return

# dates: the list of dates in integer type
# prices: the opening price of stock for the corresponding date
# x: the date for which we want to predict the price
def predict_price(dates,prices,x):
    linear_mod = linear_model.LinearRegression() #defining the linear regression
    dates = np.reshape(dates, (len(dates), 1)) # convert to nx1 matrix (n rows, 1 column)
    prices = np.reshape(prices, (len(prices), 1)) 
    # Fit the estimator linear_mod (Gotta get that maximum likelihood estimate)
    linear_mod.fit(dates, prices) # fit the data points to the model (Learn from the model)
    predicted_price = linear_mod.predict(x)
    return predicted_price[0][0], linear_mod.coef_[0][0], linear_mod.intercept_[0]

def show_plot(dates, prices):
    linear_mod = linear_model.LinearRegression()
    dates = np.reshape(dates, (len(dates), 1))
    prices = np.reshape(prices, (len(prices), 1)) 
    linear_mod.fit(dates, prices)
    plt.scatter(dates, prices, color='yellow')

    plt.plot(dates, linear_mod.predict(dates), color='blue', linewidth=3)
    plt.show()
    return