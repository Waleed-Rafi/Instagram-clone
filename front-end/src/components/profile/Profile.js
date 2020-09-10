import React, { Component } from "react";
import "./profile.css";
import { logoutUser, setMyPosts } from "../../actions/authActions";
import { connect } from "react-redux";
import axios from "../../axios/axios";

class Profile extends Component {
  state = {
    myPosts: [],
  };

  logout = () => {
    this.props.logoutUser();
  };

  componentDidMount = async () => {
    if (!this.props.auth.myPosts.length) {
      axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
        "instagram"
      );
      axios.get("/api/posts/my").then((res) => {
        this.props.setMyPosts(res.data);
        this.setState({
          myPosts: res.data,
        });
      });
    } else {
      console.log("from redux");
      this.setState({
        myPosts: this.props.auth.myPosts,
      });
    }
  };

  render() {
    let myPosts = null;
    if (this.state.myPosts.length) {
      myPosts = this.state.myPosts.map((post) => {
        return (
          <div>
            <img src={post.imageUrl} alt="" />
          </div>
        );
      });
    } else {
      myPosts = (
        <div align="center">
          <p>Empty</p>
        </div>
      );
    }
    return (
      <div>
        <div className="complete-profile">
          <div>
            <img
              alt="profile"
              class="profile-pic"
              src={this.props.auth.user.profilePic}
            />
          </div>
          <div className="user-detail">
            <div className="user-name">{this.props.auth.user.name}</div>
            <div style={{ marginTop: "3%", marginBottom: "3%" }}>
              <span
                style={{
                  marginRight: "5%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  161
                </span>{" "}
                posts
              </span>
              <span
                style={{
                  marginRight: "5%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  200M
                </span>{" "}
                followers
              </span>
              <span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  45
                </span>{" "}
                following
              </span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>
              {this.props.auth.user.name}
              <span
                onClick={this.logout}
                style={{ marginLeft: "2rem", color: "blue", cursor: "pointer" }}
              >
                Logout
              </span>
            </div>
            <div style={{ width: "80%" }}>
              <hr />
            </div>
          </div>
          <br />
        </div>
        <div className="all-Posts">{myPosts}</div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps, { logoutUser, setMyPosts })(Profile);
