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
import MessageModal from "../Modals/MessageModal";

const title = document.title;

class Profile extends Component {
  state = {
    user: {},
    allPosts: [],
    totalFollowers: [],
    totalFollowing: [],
    showCommentModal: false,
    commentModalData: {},
    commentModalPostIndex: null,
    userId: this.props.auth.user.id,
    openMessageModal: false,
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
    if (!userId) userId = this.props.user.id;

    // if (this.props.auth.user.id !== userId) {
    axios.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("instagram");
    axios.get(`/api/posts/profile/${userId}`).then((res) => {
      document.title = "Profile";
      this.setState({
        user: res.data.user,
        totalFollowers: res.data.totalFollowers,
        totalFollowing: res.data.totalFollowings,
        allPosts: res.data.result,
        userId: userId,
      });
    });
  };

  componentWillUnmount = async () => {
    document.title = title;
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
    // allComments.map((data) => {
    //   temp[index].comments.unshift(data);
    //   temp2[i].comments.unshift(data);
    // });
    temp[index].comments = [...allComments];
    temp2[i].comments = [...allComments];
    this.props.setMyPosts(temp);
    this.props.setAllPosts(temp2);
    this.setState({
      allPosts: temp,
      showCommentModal: false,
      commentModalData: {},
      commentModalPostIndex: null,
    });
  };

  closeMessageModal = () => {
    this.setState({
      openMessageModal: false,
    });
  };

  followUser = async () => {
    const response = await axios.post("/api/user/follow", {
      following_id: this.state.userId,
    });
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
                  {this.state.totalFollowers.length}
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
                  {this.state.totalFollowing.length}
                </span>{" "}
                following
              </span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>
              {this.state.user.name}
              {this.state.userId !== this.props.auth.user.id && (
                <span
                  className="btn-follow-logout"
                  style={{
                    marginLeft: "4%",
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid gray",
                  }}
                  onClick={() => this.setState({ openMessageModal: true })}
                >
                  Message
                </span>
              )}
              {this.state.userId !== this.props.auth.user.id &&
              this.props.auth.myFollowing.findIndex(
                (data) =>
                  parseInt(data.following_id) === parseInt(this.findUserId())
              ) !== -1 ? (
                <span
                  className="btn-follow-logout"
                  onClick={this.unFollowUser.bind()}
                  style={{
                    backgroundColor: "white",
                    color: "dodgerblue",
                    marginLeft: "3%",
                  }}
                >
                  Following
                </span>
              ) : (
                <span
                  className="btn-follow-logout"
                  onClick={this.followUser.bind()}
                  style={{ marginLeft: "3%" }}
                >
                  Follow
                </span>
              )}
              {this.state.userId === this.props.auth.user.id && (
                <span
                  onClick={this.logout}
                  className="btn-follow-logout"
                  style={{ marginLeft: "3%", backgroundColor: "#E74C3C" }}
                >
                  Logout
                </span>
              )}
            </div>

            <div style={{ width: "80%", marginTop: "15px" }}>
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
        {this.state.openMessageModal ? (
          <MessageModal
            isOpen={this.state.openMessageModal}
            userDetail={this.state.user}
            currentUser={this.props.auth.user}
            closeMessageModal={this.closeMessageModal}
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
