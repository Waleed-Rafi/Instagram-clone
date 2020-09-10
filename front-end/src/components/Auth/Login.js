import React, { Component } from "react";
import "./Login.css";
import instagram from "../../assets/logos/instagram.png";
import IOS from "../../assets/images/appstore.png";
import APP from "../../assets/images/playstore.png";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser, clearErrors } from "../../actions/authActions";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      window.location.href = "/";
    }
  }

  changeHandler = (e) => {
    this.props.clearErrors();
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitHandler = () => {
    this.props.loginUser(this.state, this.props.history);
  };
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
          {this.props.auth.errorMsg ? (
            <div className="login-error">{this.props.auth.errorMsg}</div>
          ) : null}
          <div className="login-email">
            <input
              onChange={this.changeHandler}
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="login-password">
            <input
              onChange={this.changeHandler}
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <input
              onClick={this.submitHandler}
              className="login-btn"
              type="button"
              value="Log In"
            />
          </div>
        </div>
        <br />
        <div className="login-footer">
          <span className="login-new">
            Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
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

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps, { loginUser, clearErrors })(Login);
