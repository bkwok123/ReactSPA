import React, { Component } from "react";
import './modalbox.css';

export class ModalBox extends Component {

  render() {
    return (
      <div id={this.props.boxID} className={this.props.hide ? "modalhide":"modalshow"}>
        <div className="modal-content">
          <span className="close" onClick={this.props.onClickModalClose}>x</span>
          {this.props.content}          
        </div>
      </div>
    );
  }
}

export default ModalBox;
