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
  };

  componentDidMount = () => {
    this.setState({
      postComments: this.props.commentModalData.comments,
    });
  };

  commentChangeHandler = (e) => {
    this.setState({
      commentMessage: e.target.value,
    });
  };

  commentSubmitHandler = (post, e) => {
    console.log(this.props.auth.user);
    e.preventDefault();

    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
      "instagram"
    );
    axios
      .post(`/api/posts/comment/${post.post_id}`, {
        message: this.state.commentMessage,
      })
      .then((res) => {
        console.log(res);
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
          comments: [...this.state.comments, data],
          commentMessage: "",
        });
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
            marginBottom: "2rem",
          }}
        >
          <img alt="profile" className="profile" src={data.profilePic} />
          <span
            style={{
              display: "block",
              marginLeft: "2.7rem",
              marginTop: "-2rem",
              fontFamily: "Segoe UI",
              color: "rgb(38, 38, 38)",
              fontSize: "14px",
              fontWeight: "600",
              wordBreak: "break-all",
              overflowWrap: "break-word",
            }}
          >
            {data.name}
            <span
              style={{
                marginLeft: "0.5rem",
                fontFamily: "Segoe UI",
                color: "rgb(38, 38, 38)",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "18px",
              }}
            >
              {data.message}
            </span>
          </span>
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
            <div style={{ marginRight: "1.5%" }}>
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
                  overflowY: "scroll",
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
                    onClick={(e) =>
                      this.commentSubmitHandler(this.props.commentModalData, e)
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
