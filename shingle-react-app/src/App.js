import React, { Component } from 'react';
import './App.css';

const PrevNextEnum = Object.freeze({ "prev": -1, "next": 1 })
const dataUrl = 'https://mdms.owenscorning.com/api/v1/product/shingles?zip=43659';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null,
    };
  }

  componentDidMount() {
    fetch(dataUrl)
      .then(response => response.json())
      .then(
      responseData => {
        this.setState({
          isLoading: false,
          data: responseData,
        });
      }
      )
  }

  render() {
    return (<div className="App">{this.state.isLoading ?
      (<h1>Loading</h1>) :
      (<ShinglePage data={this.state.data} />)}
    </div>);
  }
}

class ShinglePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.data[0],
      color: props.data[0].shingle_colors[0],
    };
  }

  handleProdSelect(event) {
    let newProduct = this.props.data.find(e => e.uid === event.target.value);

    this.setState({
      product: newProduct,
      color: newProduct.shingle_colors[0],
    });
  }

  handleArrowClick(x) {
    let colors = this.state.product.shingle_colors;
    let color_index = colors.indexOf(this.state.color);

    this.setState({
      color: colors[(color_index + x + colors.length) % colors.length]
    });
  }

  handleSelectColor(col) {
    let colorObject = this.state.product.shingle_colors.find(e => e.uid === col);

    this.setState({
      color: colorObject,
    });
  }

  renderProductSelectOptions() {
    return (
      this.props.data.map(prod => (
        <option value={prod.uid} key={prod.uid}>
          {prod.name}
        </option>)
      )
    );
  }

  renderColorList() {
    return (
      this.state.product.shingle_colors.map(color => (
        <SelectableColor
          key={color.uid}
          onClick={x => this.handleSelectColor(x)}
          name={color.name}
          uid={color.uid}
          image_source={color.deq_tile_image_url}
          selected={color.uid === this.state.color.uid}
        />)
      )
    );
  }

  render() {
    return (
      <div className="ShinglePage">
        <div className="top-section">
          <div className="display-image">
            <button id="prev-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.prev)}>
              &#9664;
              </button>
            <div id="display-image-area"><img src={this.state.color.tile_image_url} alt={this.state.color} /></div>
            <button id="next-color-button" onClick={() => this.handleArrowClick(PrevNextEnum.next)}>
              &#9654;
              </button>
          </div>
          <div className="product-select">
            <label>Shingle Line:</label>
            <select value={this.state.product.uid} onChange={e => this.handleProdSelect(e)}>
              {this.renderProductSelectOptions()}
            </select>
            <p id="select-label">{this.state.product.name} - {this.state.color.name}</p>
          </div>
        </div>
        <div className="bottom-section">
          <p id="colors-label">Shingle Colors</p>
          <ul className="select-colors">{this.renderColorList()}</ul>
        </div>
      </div>
    );
  }
}

function SelectableColor(props) {
  return (
    (<div className={props.selected ? "select-color color-is-selected" : "select-color"}>
      <button onClick={() => props.onClick(props.uid)}
        style={{ "backgroundImage": "url('" + props.image_source + "')" }}>
      </button>
      <br />
      <label>{props.name}</label>
    </div>
    )
  );
}

export default App;
