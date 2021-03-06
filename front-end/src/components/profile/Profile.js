import React, { Component } from "react";
import "./profile.css";
import {
  logoutUser,
  setMyPosts,
  setAllPosts,
  setMyFollowing,
} from "../../actions/authActions";
import { connect } from "react-redux";
import CModal from "../Modals/Comments";
import axios from "../../axios/axios";
import { auth } from "firebase";

class Profile extends Component {
  state = {
    allPosts: [],
    showCommentModal: false,
    commentModalData: {},
    commentModalPostIndex: null,
    userId: this.props.auth.user.id,
  };

  logout = () => {
    this.props.logoutUser();
  };
  findUserId() {
    let url = window.location.search;
    return url.split("=")[1];
  }
  componentDidMount = async () => {
    let userId = parseInt(this.findUserId());

    // if (this.props.auth.user.id !== userId) {
    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
      "instagram"
    );
    axios.get(`/api/posts/profile/${userId}`).then((res) => {
      this.setState({
        user: res.data.user,
        allPosts: res.data.result,
        userId: userId,
      });
    });
    // } else {
    //   this.setState({
    //     user: this.props.auth.myPosts.user,
    //     allPosts: this.props.auth.myPosts.result,
    //     userId: userId,
    //   });
    // }
  };

  openCommentModal = (post, index) => {
    this.setState({
      showCommentModal: true,
      commentModalData: post,
      commentModalPostIndex: index,
    });
  };

  closeCommentModal = (allComments, index) => {
    let temp = [...this.state.allPosts];
    let temp2 = [...this.props.auth.allPosts];
    let i = temp2.findIndex((d) => d.post_id === temp[index].post_id);
    allComments.map((data) => {
      temp[index].comments.unshift(data);
      temp2[i].comments.unshift(data);
    });
    this.props.setMyPosts(temp);
    this.props.setAllPosts(temp2);
    this.setState({
      allPosts: temp,
      showCommentModal: false,
      commentModalData: {},
      commentModalPostIndex: null,
    });
  };

  followUser = async () => {
    const response = await axios.post("/api/user/follow", {
      following_id: this.state.userId,
    });
    console.log(response.data);
    if (response.data.message) {
      this.props.setMyFollowing([
        ...this.props.auth.myFollowing,
        {
          follower_id: this.props.auth.user.id,
          following_id: this.state.userId,
        },
      ]);
    }
  };

  unFollowUser = async () => {
    axios.defaults.headers["x-auth-token"] = await localStorage.getItem(
      "instagram"
    );
    const response = await axios.post("/api/user/unFollow", {
      following_id: this.state.userId,
    });
    if (response.data.message) {
      let filteredFollowings = [...this.props.auth.myFollowing].filter(
        (followings) => {
          return followings.following_id !== this.state.userId;
        }
      );
      this.props.setMyFollowing(filteredFollowings);
    }
  };

  render() {
    let myPosts = null;
    let headSection = null;
    if (this.state.user) {
      headSection = (
        <div className="complete-profile">
          <div>
            <img
              alt="profile"
              className="profile-pic"
              src={this.state.user.profilePic}
            />
          </div>
          <div className="user-detail">
            <div>
              <span className="user-name">{this.state.user.name}</span>
            </div>
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
                  {this.state.allPosts.length}
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
              {this.state.user.name}
              {this.state.userId !== this.props.auth.user.id &&
                (this.props.auth.myFollowing.some(
                  (data) => data["following_id"] == this.findUserId()
                ) ? (
                  <span
                    className="btn-follow-logout"
                    onClick={this.unFollowUser}
                    style={{
                      backgroundColor: "white",
                      color: "dodgerblue",
                    }}
                  >
                    Following
                  </span>
                ) : (
                  <span className="btn-follow-logout" onClick={this.followUser}>
                    Follow
                  </span>
                ))}
              {this.state.userId === this.props.auth.user.id && (
                <span
                  onClick={this.logout}
                  className="btn-follow-logout"
                  style={{ marginLeft: "1%", backgroundColor: "#E74C3C" }}
                >
                  Logout
                </span>
              )}
            </div>

            <div style={{ width: "80%" }}>
              <hr />
            </div>
          </div>
          <br />
        </div>
      );
      if (this.state.allPosts.length) {
        myPosts = this.state.allPosts.map((post, index) => {
          return (
            <div key={"myPosts" + post.post_id}>
              <img
                style={{ cursor: "pointer" }}
                src={post.imageUrl}
                alt=""
                onClick={() => this.openCommentModal(post, index)}
              />
            </div>
          );
        });
      } else {
        myPosts = (
          <div>
            <p>Empty</p>
          </div>
        );
      }
    }
    return (
      <div>
        {this.state.showCommentModal ? (
          <CModal
            postIndex={this.state.commentModalPostIndex}
            showCommentModal={this.state.showCommentModal}
            commentModalData={this.state.commentModalData}
            closeCommentModal={this.closeCommentModal}
          />
        ) : null}
        {headSection}
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

export default connect(mapStateToProps, {
  logoutUser,
  setMyPosts,
  setAllPosts,
  setMyFollowing,
})(Profile);
