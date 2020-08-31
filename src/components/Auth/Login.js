import React, { Component } from "react";
import "./Login.css";
import instagram from "../../assets/logos/instagram.png";
import IOS from "../../assets/images/appstore.png";
import APP from "../../assets/images/playstore.png";

class Login extends Component {
  render() {
    return (
      <div className="login-main-page" align="center">
        <br />
        <br />
        <br />
        <br />
        <div className="login">
          <div className="login-logo">
            <img src="https://i.imgur.com/zqpwkLQ.png" alt={instagram} />
          </div>
          <div className="login-email">
            <input type="email" placeholder="Email" />
          </div>
          <div className="login-password">
            <input type="password" placeholder="Password" />
          </div>
          <div>
            <input className="login-btn" type="button" value="Log In" />
          </div>
        </div>
        <br />
        <div className="login-footer">
          <span className="login-new">
            Don't have an account? <a href="">Sign Up</a>
          </span>
        </div>
        <div className="stores">
          <p>Get the App</p>
          <img
            style={{ height: 40, width: 136, marginRight: "0.5rem" }}
            src={IOS}
            alt="IOS"
          />
          <img style={{ height: 40, width: 136 }} src={APP} alt="Play-Store" />
        </div>
      </div>
    );
  }
}

export default Login;
