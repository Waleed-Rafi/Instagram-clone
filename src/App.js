import React from "react";
import "./App.css";
import Header from "./components/header/header";
import Home from "./components/posts/home";
import CreatePost from "./components/posts/createPost";
import { Route, BrowserRouter } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <br />
        <br />
        <br />
        <br />
      </div>
      <Route
        path="/"
        exact
        render={() => {
          return (
            <div className="Posts">
              <div>
                <Home
                  postUserName="Waleed_Rafi"
                  postUserImage={photo0}
                  postImage={photo0}
                />
                <Home
                  postUserName="Ch_Hussnain"
                  postUserImage={photo1}
                  postImage={photo2}
                />
                <Home
                  postUserName="Ch_Hussnain"
                  postUserImage={photo1}
                  postImage={photo3}
                />
              </div>
              <div className="create-Post">
                <CreatePost postUserName="Waleed_Rafi" postUserImage={photo0} />
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
            <Profile
              postUserName="Waleed_Rafi"
              postUserImage={photo0}
              postUserImage1={photo0}
              postUserImage2={photo1}
              postUserImage3={photo2}
              postUserImage4={photo4}
              postUserImage5={photo5}
              postUserImage6={photo6}
              postUserImage7={photo7}
            />
          );
        }}
      />
      <Route
        path="/notifications"
        exact
        render={() => {
          return (
            <div>
              <Notifications />
            </div>
          );
        }}
      />
    </BrowserRouter>
  );
}

export default App;
