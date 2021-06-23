import React, { Component } from "react";
import axios from "../../axios/axios";
import Modal from "react-modal";
import { connect } from "react-redux";
import "./Comments.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "39rem",
    width: "58vw",
    padding: 0,
    // overflow: "hidden",
    // border: "none",
  },
};

class MoveModal extends Component {
  state = {
    commentMessage: "",
    comments: [],
    postComments: [],
    commentType: "CREATE",
    editCommentData: null,
  };

  componentDidMount = () => {
    this.setState({
      comments: this.props.commentModalData.comments,
      postComments: this.props.commentModalData.comments,
    });
  };

  commentChangeHandler = (e) => {
    this.setState({
      commentMessage: e.target.value,
    });
  };

  commentEditToggler = (data) => {
    this.setState({
      commentType: "UPDATE",
      editCommentData: data,
    });
  };

  commentSubmitHandler = (post, e) => {
    console.log(this.props.auth.user);
    e.preventDefault();

    axios.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("instagram");
    axios
      .post(`/api/posts/comment/${post.post_id}`, {
        message: this.state.commentMessage,
      })
      .then((res) => {
        if (!res.data.error) {
          let data = {
            id: this.props.auth.user.id,
            name: this.props.auth.user.name,
            profilePic: this.props.auth.user.profilePic,
            c_post_id: post.post_id,
            message: this.state.commentMessage,
          };
          // this.props.commentModalData.comments.unshift(data);
          this.setState({
            postComments: [data, ...this.state.postComments],
            comments: [data, ...this.state.comments],
            commentMessage: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  commentUpdateHandler = (e) => {
    e.preventDefault();
    console.log(this.state.commentType, this.state.editCommentData);
    let data = {
      ...this.state.editCommentData,
      message: this.state.commentMessage,
    };
    axios.patch(`/api/posts/comment/update`, data).then((res) => {
      if (!res.data.error) {
        let index = this.state.postComments.findIndex(
          (d) => d.com_id === this.state.editCommentData.com_id
        );
        let temp = [...this.state.postComments];
        temp[index] = data;
        this.setState({
          postComments: temp,
          comments: temp,
          commentMessage: "",
          commentType: "CREATE",
          editCommentData: null,
        });
      }
    });
  };

  commentDeleteHandler = (commentID) => {
    axios.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("instagram");
    axios
      .delete(`/api/posts/comment/delete?comment_id=${commentID}`)
      .then((res) => {
        if (!res.data.error) {
          let newComments = this.state.comments.filter(
            (comment) => comment.com_id !== commentID
          );
          let newPostComments = this.state.postComments.filter(
            (pComment) => pComment.com_id !== commentID
          );

          this.setState({
            postComments: newPostComments,
            comments: newComments,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  closeModal = () => {
    this.props.closeCommentModal(this.state.comments, this.props.postIndex);
  };

  render() {
    // console.log();
    let allComments = this.state.postComments.map((data, index) => {
      return (
        <div
          key={data.name + data.message + index}
          className="head-post"
          style={{
            marginBottom: "1.4rem",
            marginRight: "1rem",
          }}
        >
          <img alt="profile" className="profile" src={data.profilePic} />
          <span
            style={{
              display: "block",
              marginLeft: "2.7rem",
              marginTop: "-2.4rem",
              fontFamily: "Segoe UI",
              color: "rgb(38, 38, 38)",
              fontSize: "15px",
              fontWeight: "600",
              wordBreak: "break-all",
              overflowWrap: "break-word",
            }}
          >
            {data.name}
            <span style={{ float: "right", cursor: "pointer" }}>
              <i
                className="far fa-trash-alt"
                onClick={() => this.commentDeleteHandler(data.com_id)}
              ></i>
              <i
                className="far fa-edit"
                onClick={() => this.commentEditToggler(data)}
              ></i>
            </span>
          </span>
          <div
            style={{
              marginTop: "0.3rem",
              marginLeft: "2.7rem",
              fontFamily: "Segoe UI",
              color: "rgb(38, 38, 38)",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "18px",
              wordBreak: "break-all",
              overflowWrap: "break-word",
            }}
          >
            {data.message}
          </div>
        </div>
      );
    });
    return (
      <div>
        <Modal
          isOpen={this.props.showCommentModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "63.5% auto",
            }}
          >
            <div className="left">
              <img
                style={{
                  height: "39rem",
                  width: "36vw",
                  marginBottom: "-0.4rem",
                }}
                src={this.props.commentModalData.imageUrl}
                alt=""
              />
            </div>
            <div style={{ marginRight: "1.5%", overflow: "hidden" }}>
              <div
                className="head-post"
                style={
                  {
                    //   position: "fixed",
                  }
                }
              >
                <img
                  alt="profile"
                  className="profile"
                  src={this.props.commentModalData.profilePic}
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
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                  }}
                >
                  {this.props.commentModalData.name}
                </span>
              </div>
              <hr />
              <div
                style={{
                  overflowY: "auto",
                  height: "30rem",
                  marginTop: "4%",
                }}
              >
                {allComments}
              </div>
              <div
                style={{
                  // position: "relative",
                  zIndex: "0",
                  position: "fixed",
                  //   right: "1.5%",
                  bottom: 0,
                  width: "35%",
                }}
              >
                <form>
                  <input
                    onChange={this.commentChangeHandler}
                    value={this.state.commentMessage}
                    style={{
                      width: "85%",
                      border: "none",
                      outline: "none",
                      borderTop: "1px solid #dbdbdb",
                      padding: "1rem 0 1rem 1rem",
                      paddingLeft: "10px",
                      color: "black",
                    }}
                    placeholder="Add Comment"
                  />
                  <button
                    type="submit"
                    style={{ right: 0 }}
                    onClick={(e) =>
                      this.state.commentType === "CREATE"
                        ? this.commentSubmitHandler(
                            this.props.commentModalData,
                            e
                          )
                        : this.commentUpdateHandler(e)
                    }
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps)(MoveModal);
