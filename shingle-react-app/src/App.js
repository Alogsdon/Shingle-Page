import React, { Component } from 'react';
import './App.css';

const SHINGLES = require('./shingles.json');
const PrevNextEnum = Object.freeze({ "prev": 1, "next": 2 })

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: SHINGLES[0].uid
    };
  }

  handleProdSelect(event) {
    this.setState({
      product: event.target.value
    });
  }

  handleArrowClick(x) {
    console.log(x);
  }

  render() {
    const productOptions = SHINGLES.map(function (prod) {
      return (
        <option value={prod.uid} key={prod.uid}>
          {prod.name}
        </option>
      );
    });


    return (
      <div className="App">
        <div className="display-image">
          <button id="prev-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.prev)}>
            &#9664;
          </button>
          <div id="display-image-area"></div>
          <button id="next-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.next)}>
            &#9654;
          </button>
        </div>
        <div className="product-select">
          <label>
            Shingle Line:
            <select value={this.state.product} onChange={e => this.handleProdSelect(e)}>
              {productOptions}
            </select>
          </label>
        </div>
      </div>
    );
  }
}

export default App;
