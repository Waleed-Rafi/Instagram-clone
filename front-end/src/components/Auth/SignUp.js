import React, { Component } from "react";
import "./Signup.css";
import instagram from "../../assets/logos/instagram.png";
import IOS from "../../assets/images/appstore.png";
import APP from "../../assets/images/playstore.png";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signupUser, clearErrors } from "../../actions/authActions";
import firebase from "../firebase/firebase";

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRv72OqLEG5oKC_Mchq6fWAMuDb_KagHfB15g&usqp=CAU",
  };

  componentDidMount() {
    this.props.clearErrors();
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

  changeFileHanlder = (e) => {
    if (e.target.files.length > 0) {
      firebase
        .storage()
        .ref()
        .child(e.target.files[0].name)
        .put(e.target.files[0])
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((res) => {
          this.setState({
            profilePic: res,
          });
        });
    }
  };

  submitHandler = () => {
    console.log(this.state);
    this.props.signupUser(this.state, this.props.history);
  };
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
          {this.props.auth.errorMsg ? (
            <div className="signup-error">{this.props.auth.errorMsg}</div>
          ) : null}
          <div className="Signup-email">
            <input
              onChange={this.changeHandler}
              name="name"
              type="text"
              placeholder="User Name"
            />
          </div>
          <div className="Signup-email">
            <input
              onChange={this.changeHandler}
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="Signup-password">
            <input
              onChange={this.changeHandler}
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="Signup-password">
            <input
              onChange={this.changeFileHanlder}
              type="file"
              name="file"
              accept="image/*"
            />
          </div>
          <div>
            <input
              onClick={this.submitHandler}
              className="Signup-btn"
              type="button"
              value="Sign Up"
            />
          </div>
        </div>
        <br />
        <div className="Signup-footer">
          <span className="Signup-new">
            Already have an account? <NavLink to="/login">Log In</NavLink>
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

export default connect(mapStateToProps, { signupUser, clearErrors })(Signup);
