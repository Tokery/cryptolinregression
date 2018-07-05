import React from 'react';

function PurchaseHistory (props) {
  return (<div>
    <div>
      Profit: {props.profit}
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <ul className="list-group list-group-flush">
        { props.bought.map(value =>
          <li className="list-group-item">Bought: {value}</li>
        )}
      </ul>
      <ul className="list-group list-group-flush">
        { props.sold.map(value =>
          <li className="list-group-item">Sold: {value}</li>
        )}
      </ul>
    </div>
  </div>)
}

export default PurchaseHistory;