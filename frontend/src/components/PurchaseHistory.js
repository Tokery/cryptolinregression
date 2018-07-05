import React from 'react';

function PurchaseHistory (props) {
  return (<div>
    <div>
      Profit: {props.profit}
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <ul className="list-group list-group-flush">
        <li className="list-group-item list-group-item-success">Bought</li>
        { props.bought.map(value =>
          <li className="list-group-item">{value}</li>
        )}
      </ul>
      <ul className="list-group list-group-flush">
        <li className="list-group-item list-group-item-danger">Sold</li>
        { props.sold.map(value =>
          <li className="list-group-item">{value}</li>
        )}
      </ul>
    </div>
  </div>);
}

export default PurchaseHistory;