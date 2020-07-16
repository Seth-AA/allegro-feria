import React, { Component } from "react";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.initial;
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    this.props.dummy(this.state);
    console.log(this.state);
  }

  render() {
    const valores = [
      "historial",
      "oscilograma",
      "tempo-real",
      "medidor",
      "avisos",
    ];
    return (
      <div
        style={{
          position: "absolute",
          width: "100px",
          height: "200px",
          backgroundColor: "red",
        }}
      >
        <form>
          {valores.map((x) => (
            <div>
              <label>
                {x}
                <input
                  name={x}
                  checked={this.state[x]}
                  type="checkbox"
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
          ))}
        </form>
      </div>
    );
  }
}

export default Menu;
