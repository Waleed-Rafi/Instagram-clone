import React, { Component } from "react";
import axios from "../../axios/axios";
import { setAllPosts, setMyPosts } from "../../actions/authActions";
import { connect } from "react-redux";
import CModal from "../Modals/Comments";
import "./home.css";
import { Link, NavLink } from "react-router-dom";

class home extends Component {
  token = null;
  state = {
    allPosts: [],
    commentMessage: "",
    showCommentModal: false,
    commentModalData: {},
    commentModalPostIndex: null,
  };

  componentDidMount = async () => {
    this.token = localStorage.getItem("instagram");
    if (!this.props.auth.allPosts.length) {
      axios.defaults.headers.common["x-auth-token"] = this.token;
      axios.get("/api/posts/all").then((res) => {
        this.props.setAllPosts(res.data);
        this.setState({
          allPosts: res.data,
        });
      });
    } else {
      console.log("from reducer");
      this.setState({
        allPosts: this.props.auth.allPosts,
      });
    }
  };

  componentWillReceiveProps = (props) => {
    console.log(props);
    if (props.auth.allPosts.length !== this.state.allPosts) {
      // console.log(this.props.auth.allPosts);
      console.log(props.auth.allPosts);
      console.log(this.state.allPosts);
      this.setState({
        allPosts: props.auth.allPosts,
      });
    }
  };

  likePost = async (post_id, index) => {
    axios.defaults.headers.common["x-auth-token"] = this.token;
    await axios
      .post(`api/posts/like/${post_id}`)
      .then((res) => {
        if (res.data.message) {
          let temp = [...this.state.allPosts];
          let d = {
            likes_id: res.data.id,
            l_user_id: this.props.auth.user.id,
            l_post_id: post_id,
          };
          temp[index].likes.push(d);
          this.props.setAllPosts(temp);
          this.setState({
            allPosts: temp,
          });
        } else if (res.data.likeFailed) {
          console.log(res.data.likeFailed);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  dislikePost = (post_id, index) => {
    axios.defaults.headers.common["x-auth-token"] = this.token;
    axios
      .post(`api/posts/dislike/${post_id}`)
      .then((res) => {
        if (res.data.message) {
          let temp = [...this.state.allPosts];
          let i = temp[index].likes.findIndex((d) => {
            return d.l_user_id === this.props.auth.user.id;
          });

          temp[index].likes.splice(i, 1);
          this.props.setAllPosts(temp);
          this.setState({
            allPosts: temp,
          });
        } else if (res.data.disLikeFailed) {
          console.log(res.data.disLikeFailed);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  commentChangeHandler = (e) => {
    this.setState({
      commentMessage: e.target.value,
    });
  };

  commentSubmitHandler = (index, e) => {
    e.preventDefault();

    axios.defaults.headers.common["x-auth-token"] = this.token;
    axios
      .post(`/api/posts/comment/${this.state.allPosts[index].post_id}`, {
        message: this.state.commentMessage,
      })
      .then((res) => {
        let temp = [...this.state.allPosts];
        if (
          this.props.auth.myPosts.length &&
          this.props.auth.myPosts[0].id === temp[index].id
        ) {
          let temp2 = [...this.props.auth.myPosts];
          let i = temp2.findIndex((d) => d.post_id === temp[index].post_id);
          temp2[i].comments.unshift({
            id: this.props.auth.user.id,
            name: this.props.auth.user.name,
            profilePic: this.props.auth.user.profilePic,
            c_post_id: this.state.allPosts[index].post_id,
            message: this.state.commentMessage,
          });
          this.props.setMyPosts(temp2);
        }
        temp[index].comments.unshift({
          id: this.props.auth.user.id,
          name: this.props.auth.user.name,
          profilePic: this.props.auth.user.profilePic,
          c_post_id: this.state.allPosts[index].post_id,
          message: this.state.commentMessage,
        });
        this.props.setAllPosts(temp);
        this.setState({
          allPosts: temp,
          commentMessage: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (
      this.props.auth.myPosts.length &&
      this.props.auth.myPosts[0].id === temp[index].id
    ) {
      let temp2 = [...this.props.auth.myPosts];
      let i = temp2.findIndex((d) => d.post_id === temp[index].post_id);
      console.log(i);
      allComments.map((data) => {
        temp[index].comments.unshift(data);
        temp2[i].comments.unshift(data);
      });
      this.props.setAllPosts(temp);
      this.props.setMyPosts(temp2);
    } else {
      allComments.map((data) => {
        temp[index].comments.unshift(data);
      });
      this.props.setAllPosts(temp);
    }

    this.setState({
      allPosts: temp,
      showCommentModal: false,
      commentModalData: {},
      commentModalPostIndex: null,
    });
  };

  render() {
    let all = null;
    if (this.state.allPosts.length > 0) {
      all = this.state.allPosts.map((post, index) => {
        let isLiked = post.likes.findIndex(
          (d) => d.l_user_id === this.props.auth.user.id
        );
        return (
          <div key={"allPosts" + index}>
            <div className="all-posts">
              <NavLink
                to={`/profile?userId=${post.user_id}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="head-post">
                  <img
                    alt="profile"
                    className="profile"
                    src={post.profilePic}
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
                    {post.name}
                  </span>
                </div>
              </NavLink>
              <div className="photo-post">
                <img
                  onDoubleClick={() => this.likePost(post.post_id, index)}
                  src={post.imageUrl}
                  alt=""
                />
              </div>
              <div className="footer-post">
                <div style={{ margin: "10px 0 10px 20px" }}>
                  <span style={{ cursor: "pointer" }}>
                    {isLiked === -1 ? (
                      <svg
                        aria-label="Like"
                        className="_8-yf5 "
                        fill="#262626"
                        height="24"
                        viewBox="0 0 48 48"
                        width="24"
                        onClick={() => this.likePost(post.post_id, index)}
                      >
                        <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                    ) : (
                      <svg
                        aria-label="Unlike"
                        className="_8-yf5 "
                        fill="#ed4956"
                        height="24"
                        viewBox="0 0 48 48"
                        width="24"
                        onClick={() => this.dislikePost(post.post_id, index)}
                      >
                        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                    )}
                  </span>
                  <span className="like-comment" style={{ cursor: "pointer" }}>
                    <svg
                      aria-label="Comment"
                      className="_8-yf5 "
                      fill="#262626"
                      height="24"
                      viewBox="0 0 48 48"
                      width="24"
                      onClick={() => this.openCommentModal(post, index)}
                    >
                      <path
                        clipRule="evenodd"
                        d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <div className="total-likes">
                    <span
                      style={{
                        display: "block",
                        marginTop: "0.5rem",
                        marginBottom: "0.4rem",
                        fontFamily: "Segoe UI",
                        color: "rgb(38, 38, 38)",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {post.likes.length} likes
                    </span>
                  </div>
                  <div
                    className="total-comments"
                    style={{ marginBottom: "0.4rem" }}
                  >
                    <span
                      style={{
                        margin: "0.5rem 0.3rem 0.4rem 0",
                        fontFamily: "Segoe UI",
                        color: "rgb(38, 38, 38)",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {post.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "Segoe UI",
                        color: "rgb(38, 38, 38)",
                        fontSize: "14px",
                        fontWeight: "400",
                      }}
                    >
                      {post.description}
                    </span>
                  </div>
                  {post.comments.length > 0 ? (
                    <div>
                      <div className="comments-head">
                        <small
                          style={{
                            cursor: "pointer",
                            fontFamily: "Segoe UI",
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "rgb(142, 142, 142)",
                          }}
                          onClick={() => this.openCommentModal(post, index)}
                        >
                          View all {post.comments.length} comments
                        </small>
                      </div>
                      <div
                        className="total-comments"
                        style={{ marginBottom: "0.4rem", marginTop: "0.3rem" }}
                      >
                        <span
                          style={{
                            margin: "0.5rem 0.3rem 0.4rem 0",
                            fontFamily: "Segoe UI",
                            color: "rgb(38, 38, 38)",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {post.comments[0].name}
                        </span>
                        <span
                          style={{
                            fontFamily: "Segoe UI",
                            color: "rgb(38, 38, 38)",
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                        >
                          {post.comments[0].message}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="comments-head">
                      <small
                        style={{
                          fontFamily: "Segoe UI",
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "rgb(142, 142, 142)",
                        }}
                      >
                        No comments
                      </small>
                    </div>
                  )}
                </div>
                <div style={{ position: "relative", zIndex: "0" }}>
                  <form>
                    <input
                      onChange={this.commentChangeHandler}
                      value={this.state.commentMessage}
                      style={{
                        width: "97%",
                        border: "none",
                        outline: "none",
                        borderTop: "1px solid #dbdbdb",
                        padding: "1rem 0 1rem 1rem",
                        paddingLeft: "10px",
                      }}
                      placeholder="Add Comment"
                    />
                    <button
                      type="submit"
                      onClick={(e) => this.commentSubmitHandler(index, e)}
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
          </div>
        );
      });
    }
    return (
      <div className="posts">
        {all}
        {this.state.showCommentModal ? (
          <CModal
            postIndex={this.state.commentModalPostIndex}
            showCommentModal={this.state.showCommentModal}
            commentModalData={this.state.commentModalData}
            closeCommentModal={this.closeCommentModal}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps, { setAllPosts, setMyPosts })(home);
