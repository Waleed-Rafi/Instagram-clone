import React, { Component } from "react";
import { connect } from "react-redux";
import { setMyFollowing } from "../../actions/authActions";
import { Link } from "react-router-dom";
import axios from "../../axios/axios";
import "./RecentJoins.css";
class RecentJoins extends Component {
  state = {
    recentJoins: [],
    myFollowing: [],
  };
  async componentDidMount() {
    axios.defaults.headers["x-auth-token"] = await localStorage.getItem(
      "instagram"
    );
    const recentJoins = await axios.get("/api/user/recentJoins");
    this.setState({
      recentJoins: recentJoins.data.users,
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.auth.myFollowing);
    this.setState({
      myFollowing: nextProps.auth.myFollowing,
    });
  }

  followUser = async (userId) => {
    axios.defaults.headers["x-auth-token"] = await localStorage.getItem(
      "instagram"
    );
    const response = await axios.post("/api/user/follow", {
      following_id: userId,
    });
    if (response.data.message) {
      this.props.setMyFollowing([
        ...this.props.auth.myFollowing,
        { follower_id: this.props.auth.user.id, following_id: userId },
      ]);
    }
  };

  unFollowUser = async (userId) => {
    axios.defaults.headers["x-auth-token"] = await localStorage.getItem(
      "instagram"
    );
    const response = await axios.post("/api/user/unFollow", {
      following_id: userId,
    });
    if (response.data.message) {
      let filteredFollowings = [...this.props.auth.myFollowing].filter(
        (followings) => {
          return followings.following_id !== userId;
        }
      );
      this.props.setMyFollowing(filteredFollowings);
    }
  };

  render() {
    let all = null;
    if (this.state.recentJoins.length > 0)
      all = this.state.recentJoins.map((user) => {
        let isFollowing = this.state.myFollowing.some(
          (data) => data["following_id"] === user.id
        );
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
              {isFollowing ? (
                <span
                  className="following-btn"
                  onClick={() => this.unFollowUser(user.id)}
                >
                  Following
                </span>
              ) : (
                <span
                  className="follow-btn"
                  onClick={() => this.followUser(user.id)}
                >
                  Follow
                </span>
              )}
            </div>
          </div>
        );
      });
    return (
      <div style={{ position: "fixed", top: "32%" }}>
        <h2 className="recent-heading">Recent Joins</h2>
        {all}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps, { setMyFollowing })(RecentJoins);
