import React, { Component } from "react";
import "./Error.css";

class Error extends Component {
  render() {
    return (
      <div align="center" className="error-main">
        <div className="error-head">Sorry, this page isn't available.</div>
        <div className="error-sub">
          The link you followed may be broken, or the page may have been
          removed. <a href="/">Go back to Instagram.</a>
        </div>
      </div>
    );
  }
}

export default Error;
