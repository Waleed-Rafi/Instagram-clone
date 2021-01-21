import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios/axios";
import "./RecentJoins.css";
class RecentJoins extends Component {
  state = {
    recentJoins: [],
  };
  async componentDidMount() {
    axios.defaults.headers["x-auth-token"] = await localStorage.getItem(
      "instagram"
    );
    const recentJoins = await axios.get("/api/user/recentJoins");
    console.log(recentJoins.data.users);
    this.setState({
      recentJoins: recentJoins.data.users,
    });
  }
  render() {
    let all = null;
    if (this.state.recentJoins.length > 0)
      all = this.state.recentJoins.map((user) => {
        return (
          <div className="s-user-container">
            <div>
              <img alt="profile" className="profile" src={user.profilePic} />
            </div>
            <div className="s-user-name-container">
              <Link to={`/profile?user=${user.id}`} className="s-user-name">
                {user.name}
              </Link>
            </div>
            <div>
              <a href="" className="follow-btn">
                Follow
              </a>
            </div>
          </div>
        );
      });
    return (
      <div>
        <h2 className="recent-heading">New Users</h2>
        {all}
      </div>
    );
  }
}

export default RecentJoins;
