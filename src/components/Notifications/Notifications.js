import React, { Component } from "react";
import "./notifications.css";

class Notifications extends Component {
  render() {
    return (
      <div>
        <div className="main">
          <h1>Notifications</h1>
          <div className="allNotifications">
            <div className="image"></div>
            <div className="detail"></div>
            <div className="ff-button"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;
