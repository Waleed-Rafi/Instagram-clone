import React, { Component } from "react";
import axios from "../../axios/axios";
import Modal from "react-modal";
import { connect } from "react-redux";
import "./Comments.css";
import { Link } from "react-router-dom";

const customStyles = {
  content: {
    top: "32.4%",
    left: "46.8%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "30rem",
    width: "17vw",
    padding: 0,
    // overflow: "hidden",
    // border: "none",
  },
};

class MoveModal extends Component {
  state = {
    allUsersHashtags: [],
  };

  componentDidMount = () => {
    console.log(this.props.isHashtag);

    axios.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("instagram");
    if (!this.props.isHashtag) {
      axios
        .post("/api/posts/searchedUsers", { name: this.props.data })
        .then((res) => {
          this.setState({
            allUsersHashtags: [...res.data.result],
          });
        });
    } else {
      let title = this.props.data
        .split("")
        .splice(1, this.props.data.length)
        .join("");
      axios.post("/api/posts/searchHashtags", { title: title }).then((res) => {
        console.log(res.data.result);
        this.setState({
          allUsersHashtags: [...res.data.result],
        });
      });
    }
  };

  closeModal = () => {
    this.props.closeModal();
  };

  render() {
    let allUsersHashtags = null;
    if (this.state.allUsersHashtags.length) {
      allUsersHashtags = this.state.allUsersHashtags.map((data, index) => {
        return (
          <div
            key={data.name + index}
            className="head-post"
            style={{
              marginBottom: "2rem",
            }}
            onClick={this.closeModal}
          >
            <Link
              to={
                this.props.isHashtag
                  ? `/hashtag?hashId=${data.H_ID}&hashTitle=${data.H_TITLE}`
                  : `/profile?userId=${data.id}`
              }
              style={{ textDecoration: "none" }}
            >
              <img
                style={{ objectFit: "cover" }}
                alt="profile"
                className="profile"
                src={
                  this.props.isHashtag
                    ? "https://www.ourquadcities.com/wp-content/uploads/sites/19/2019/01/hastag_1546638455807_66575095_ver1.0.png"
                    : data.profilePic
                }
              />{" "}
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
                {this.props.isHashtag ? data.H_TITLE : data.name}{" "}
              </span>{" "}
            </Link>{" "}
            <br />
            <div style={{ borderBottom: "1px solid gray" }}> </div>{" "}
          </div>
        );
      });
    } else {
      allUsersHashtags = (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "light blue",
            fontFamily: "Segoe UI",
          }}
        >
          No User or Hashtag Exists!!
        </div>
      );
    }

    return (
      <div>
        <Modal
          isOpen={this.props.isOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <div
            style={{
              overflowY: "hidden",
              height: "30rem",
              marginTop: "4%",
            }}
          >
            {allUsersHashtags}{" "}
          </div>{" "}
        </Modal>{" "}
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
