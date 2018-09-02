import React from 'react';
import numeral from 'numeral';

function PurchaseHistory (props) {
  return (<div className="card">
    <div className="card-body">
      <h5 className="card-title">{props.player}</h5> 
      <div>Profit: {numeral(props.profit).format('$0,0.00')}</div>
      <div className="flex-row-center">
        <ul className="list-group list-group-flush">
          <li className="list-group-item list-group-item-success">Bought</li>
          { props.bought.map(value =>
            <li className="list-group-item">{numeral(value).format('$0,0.00')}</li>
          )}
        </ul>
        <ul className="list-group list-group-flush">
          <li className="list-group-item list-group-item-danger">Sold</li>
          { props.sold.map(value =>
            <li className="list-group-item">{numeral(value).format('$0,0.00')}</li>
          )}
        </ul>
      </div>
    </div>
  </div>);
}

export default PurchaseHistory;