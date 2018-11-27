import React, { Component } from 'react';
import './App.css';

const SHINGLES = require('./shingles.json');
const PrevNextEnum = Object.freeze({ "prev": -1, "next": 1 })

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: SHINGLES[0].uid,
      color: SHINGLES[0].shingle_colors[0].name,
    };
  }


  handleProdSelect(event) {
    let newProduct = SHINGLES.find(function (e) { return e.uid === event.target.value });
    this.setState({
      product: event.target.value,
      color: newProduct.shingle_colors[0].name,
    });
  }

  handleArrowClick(x) {

    console.log(x);
  }

  handleSelectColor(col) {
    this.setState({
      product: this.state.product,
      color: col,
    });
  }

  render() {
    const productOptions = SHINGLES.map(function (prod) {
      return (
        <option value={prod.uid} key={prod.uid}>
          {prod.name}
        </option>
      );
    });
    const currentProduct = SHINGLES.find(function (e) { return e.uid === this.state.product }, this);
    const colorList = currentProduct.shingle_colors.map(function (color) {
      return (<SelectableColor
        key={color.name}
        onClick={x => this.handleSelectColor(x)}
        name={color.name}
        image_source={color.deq_tile_image_url}
        selected={false}
      />)
    }, this);
    const currentColor = currentProduct.shingle_colors.find(function(e) {return e.name === this.state.color}, this);
    const displayImageSrc = currentColor.tile_image_url;


    return (
      <div className="App">
        {currentProduct.name}
        <div className="display-image">
          <button id="prev-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.prev)}>
            &#9664;
          </button>
          <div id="display-image-area"><img src={displayImageSrc} alt={this.state.color}/></div>
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
        <div className="select-colors">
          <ul>{colorList}</ul>
        </div>
      </div>
    );
  }
}

class SelectableColor extends React.Component {
  render() {
    return (<div className="select-color" style={this.props.selected ? { "backgroundColor": "lightgray" } : {}}>
      <button onClick={() => this.props.onClick(this.props.name)}
        style={{ "backgroundImage": "url('" + this.props.image_source + "')" }} >

      </button>
      <br />
      <label>{this.props.selected ? <b>{this.props.name}</b> : this.props.name}</label>
    </div>
    );
  }
}

export default App;
