import React, { Component } from "react";
import "./App.css";
import Header from "./components/header/header";
import Home from "./components/posts/home";
import CreatePost from "./components/posts/createPost";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import photo0 from "./assets/images/photo.jpg";
import photo1 from "./assets/images/photo2.jpg";
import photo2 from "./assets/images/photo3.jpg";
import photo3 from "./assets/images/photo4.jpg";
import photo4 from "./assets/images/photo5.jpg";
import photo5 from "./assets/images/photo6.jpg";
import photo6 from "./assets/images/photo7.jpg";
import photo7 from "./assets/images/photo8.jpg";
import Profile from "./components/profile/Profile";
import Notifications from "./components/Notifications/Notifications";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Error from "./components/404/Error";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { loginAfter } from "./actions/authActions";

class App extends Component {
  state = {
    redirect: null,
  };
  componentDidMount() {
    const token = localStorage.getItem("instagram");
    if (token) {
      let decoded = jwt_decode(token);
      var date = new Date();
      var timestamp = Math.floor(date.getTime() / 1000);
      if (
        decoded.id &&
        decoded.email &&
        decoded.password &&
        decoded.iat &&
        decoded.exp > timestamp
      ) {
        this.props.loginAfter();
        this.setState({
          redirect: <Redirect to="/" />,
        });
      } else if (timestamp >= decoded.exp) {
        localStorage.removeItem("instagram");
        this.setState({
          redirect: <Redirect to="/login" />,
        });
      }
    } else {
      this.setState({
        redirect: <Redirect to="/login" />,
      });
    }
  }
  render() {
    return (
      <BrowserRouter>
        {this.state.redirect}
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route
            path="/"
            exact
            render={() => {
              return (
                <div>
                  <div className="app">
                    <Header />
                  </div>
                  <div className="Posts">
                    <div style={{ marginTop: "5%" }}>
                      <Home />
                    </div>
                    {/* <div className="create-Post" style={{ marginTop: "9%" }}>
                      <CreatePost />
                    </div> */}
                  </div>
                </div>
              );
            }}
          />
          <Route
            path="/profile"
            exact
            render={() => {
              return (
                <div>
                  <div className="app">
                    <Header />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                  <Profile
                  // postUserName="Waleed_Rafi"
                  // postUserImage={photo0}
                  // postUserImage1={photo0}
                  // postUserImage2={photo1}
                  // postUserImage3={photo2}
                  // postUserImage4={photo4}
                  // postUserImage5={photo5}
                  // postUserImage6={photo6}
                  // postUserImage7={photo7}
                  />
                </div>
              );
            }}
          />
          <Route
            path="/notifications"
            exact
            render={() => {
              return (
                <div>
                  <div className="app">
                    <Header />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                  <div className="notification-head" align="center">
                    Notifications
                  </div>
                  <Notifications
                    postUserName="Waleed_Rafi"
                    postUserImage={photo0}
                  />
                  <Notifications
                    postUserName="Ahmad Anis"
                    postUserImage={photo1}
                  />
                  <Notifications
                    postUserName="Abdul Rehman"
                    postUserImage={photo3}
                  />
                  <Notifications
                    postUserName="Talha Khalid"
                    postUserImage={photo4}
                  />
                  <Notifications
                    postUserName="Waleed_Rafi"
                    postUserImage={photo5}
                  />
                  <Notifications
                    postUserName="Waleed_Rafi"
                    postUserImage={photo6}
                  />
                  <Notifications
                    postUserName="Waleed_Rafi"
                    postUserImage={photo7}
                  />
                  <Notifications
                    postUserName="Waleed_Rafi"
                    postUserImage={photo3}
                  />
                </div>
              );
            }}
          />
          <Route
            render={() => {
              return (
                <div>
                  <div className="app">
                    <Header />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                  <Error />
                </div>
              );
            }}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps, { loginAfter })(App);
