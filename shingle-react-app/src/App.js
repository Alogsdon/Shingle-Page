import React, { Component } from 'react';
import './App.css';

const PrevNextEnum = Object.freeze({ "prev": -1, "next": 1 })
const dataUrl = 'https://mdms.owenscorning.com/api/v1/product/shingles?zip=43659';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      product: null,
      color: null,
      data: null,
    };
  }

  componentDidMount() {
    fetch(dataUrl)
      .then(response => response.json())
      .then(
      responseData =>
        this.setState({
          isLoading: false,
          product: responseData[0].uid,
          color: responseData[0].shingle_colors[0].uid,
          data: responseData,
        })
      )
  }

  handleProdSelect(event) {
    let newProduct = this.state.data.find(function (e) { return e.uid === event.target.value });

    this.setState({
      product: event.target.value,
      color: newProduct.shingle_colors[0].uid,
    });
  }

  handleArrowClick(x) {
    let prod = this.state.data.find(function (e) { return e.uid === this.state.product }, this);
    let colors = prod.shingle_colors;
    let currentColor = colors.find(function (e) { return e.uid === this.state.color }, this);
    let color_index = colors.indexOf(currentColor);

    this.setState({
      color: colors[(color_index + x + colors.length) % colors.length].uid
    });
  }

  handleSelectColor(col) {
    this.setState({
      color: col,
    });
  }

  render() {
    if (!this.state.isLoading) {
      const currentProduct = this.state.data.find(function (e) { return e.uid === this.state.product }, this);
      const currentColor = currentProduct.shingle_colors.find(function (e) { return e.uid === this.state.color }, this);
      const displayImageSrc = currentColor.tile_image_url;

      const productOptions = this.state.data.map(function (prod) {
        return (
          <option value={prod.uid} key={prod.uid}>
            {prod.name}
          </option>
        );
      });

      const colorList = currentProduct.shingle_colors.map(function (color) {
        return (<SelectableColor
          key={color.uid}
          onClick={x => this.handleSelectColor(x)}
          name={color.name}
          uid={color.uid}
          image_source={color.deq_tile_image_url}
          selected={color.uid === this.state.color}
        />)
      }, this);

      return (
        <div className="App">
          <div className="top-section">
            <div className="display-image">
              <button id="prev-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.prev)}>
                &#9664;
              </button>
              <div id="display-image-area"><img src={displayImageSrc} alt={this.state.color} /></div>
              <button id="next-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.next)}>
                &#9654;
              </button>
            </div>
            <div className="product-select">
              <label>Shingle Line:</label>
              <select value={this.state.product} onChange={e => this.handleProdSelect(e)}>
                {productOptions}
              </select>
              <p id="select-label">{currentProduct.name} - {currentColor.name}</p>
            </div>
          </div>
          <div className="bottom-section">
            <p id="colors-label">Shingle Colors</p>
            <ul className="select-colors">{colorList}</ul>
          </div>
        </div>
      );
    }
    else {
      return (<div className="App">Loading</div>);
    }
  }
}

class SelectableColor extends React.Component {
  render() {
    return (<div className="select-color" style={this.props.selected ? { "backgroundColor": "lightgray" } : {}}>
      <button onClick={() => this.props.onClick(this.props.uid)}
        style={{"backgroundImage": "url('" + this.props.image_source + "')" }}>
      </button>
      <br/>
      <label>{this.props.name}</label>
    </div>
    );
  }
}

export default App;
