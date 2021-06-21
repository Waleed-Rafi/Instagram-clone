import React, { Component } from "react";
import "./notifications.css";

class Notifications extends Component {
  render() {
    return (
      <div>
        <div className="main">
          <div className="allNotifications">
            <div className="image">
              <img
                className="notifications-image"
                src={this.props.postUserImage}
                alt="User"
              />
            </div>
            <div className="notification-body">
              <div className="detail">
                <div className="notification-userName">
                  {this.props.postUserName}
                </div>
                <p className="notification-detail">Started following you</p>
              </div>
              <div>
                <div className="notification-button">Follow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;
