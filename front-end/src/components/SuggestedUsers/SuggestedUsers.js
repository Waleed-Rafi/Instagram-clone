import React, { Component } from "react";

class SuggestedUsers extends Component {
  render() {
    return (
      <div className="head-post">
        <img
          alt="profile"
          className="profile"
          src={this.props.auth.user.profilePic}
        />
        <span
          style={{
            display: "block",
            marginLeft: "2.7rem",
            marginTop: "-1.7rem",
            fontFamily: "Segoe UI",
            color: "rgb(38, 38, 38)",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {this.props.auth.user.name}
        </span>
      </div>
    );
  }
}

export default SuggestedUsers;
