import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./SuggestedUsers.css";
class SuggestedUsers extends Component {
  render() {
    return (
      <div className="s-user-container">
        {/* <h2>Suggested Users</h2> */}
        <div>
          <img
            alt="profile"
            className="profile"
            src={this.props.auth.user.profilePic}
          />
        </div>
        <div className="s-user-name-container">
          <Link to="/profile?user=1" className="s-user-name">
            {this.props.auth.user.name}
          </Link>
        </div>
        <div>
          <a href="" className="follow-btn">
            Follow
          </a>
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

export default connect(mapStateToProps)(SuggestedUsers);
