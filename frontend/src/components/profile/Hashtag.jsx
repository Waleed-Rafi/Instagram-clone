import React, { Component } from "react";
import "./profile.css";
import { setMyPosts, setAllPosts } from "../../actions/authActions";
import { connect } from "react-redux";
import CModal from "../Modals/Comments";
import axios from "../../axios/axios";

const title = document.title;

class Hashtag extends Component {
  state = {
    allPosts: [],
    showCommentModal: false,
    commentModalData: {},
    commentModalPostIndex: null,
    hashtagId: null,
    title: "",
  };

  logout = () => {
    this.props.logoutUser();
  };
  findHashId() {
    let url = window.location.search;
    url = url.split("=")[1].split("&")[0];
    return url;
  }
  findHashTitle = () => {
    let title = window.location.search;
    title = title.split("=")[2];
    return title;
  };
  componentDidMount = async () => {
    let hashId = parseInt(this.findHashId());

    // if (this.props.auth.user.id !== userId) {
    axios.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("instagram");
    axios.get(`/api/posts/hashtag/${hashId}`).then((res) => {
      let allPosts = [];
      this.props.auth.allPosts.forEach((post) => {
        res.data.result.forEach((r) => {
          if (post.post_id === r.p_id) {
            allPosts.push(post);
          }
        });
      });
      this.setState({
        allPosts: allPosts,
        hashtagId: hashId,
        title: this.findHashTitle(),
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

  render() {
    let myPosts = null;
    let headSection = null;
    if (this.state.title) {
      headSection = (
        <div className="complete-profile" style={{ marginBottom: "2rem" }}>
          <div>
            <img
              style={{ objectFit: "cover" }}
              alt="profile"
              className="profile-pic"
              src="https://www.ourquadcities.com/wp-content/uploads/sites/19/2019/01/hastag_1546638455807_66575095_ver1.0.png"
            />
          </div>
          <div className="user-detail" style={{ marginTop: "1.6rem" }}>
            <div>
              <span
                className="user-name"
                style={{
                  fontWeight: "bold",
                  color: "rgba(0, 0, 0, 0.7)",
                }}
              >
                {"#" + this.state.title}
              </span>
            </div>

            <div style={{ width: "80%", marginTop: "35px" }}>
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
  setMyPosts,
  setAllPosts,
})(Hashtag);
