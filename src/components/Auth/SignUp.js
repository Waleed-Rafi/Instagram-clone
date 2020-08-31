import React, { Component } from "react";
import "./Signup.css";
import instagram from "../../assets/logos/instagram.png";
import IOS from "../../assets/images/appstore.png";
import APP from "../../assets/images/playstore.png";

class Signup extends Component {
  render() {
    return (
      <div className="Signup-main-page" align="center">
        <br />
        <br />
        <br />
        <br />
        <div className="Signup">
          <div className="Signup-logo">
            <img src="https://i.imgur.com/zqpwkLQ.png" alt={instagram} />
          </div>
          <div className="Signup-email">
            <input type="text" placeholder="User Name" max="30" min="3" />
          </div>
          <div className="Signup-email">
            <input type="email" placeholder="Email" />
          </div>
          <div className="Signup-password">
            <input type="password" placeholder="Password" />
          </div>
          <div>
            <input className="Signup-btn" type="button" value="Sign Up" />
          </div>
        </div>
        <br />
        <div className="Signup-footer">
          <span className="Signup-new">
            Already have an account? <a href="">Log In</a>
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

export default Signup;
