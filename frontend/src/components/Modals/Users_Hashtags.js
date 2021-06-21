import React, { Component } from "react";
import axios from "../../axios/axios";
import Modal from "react-modal";
import { connect } from "react-redux";
import "./Comments.css";
import { Link } from "react-router-dom";

const customStyles = {
  content: {
    top: "35.6%",
    left: "49.3%",
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
    allUsers: [],
  };

  componentDidMount = () => {
    axios.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("instagram");
    axios
      .post("/api/posts/searchedUsers", { name: this.props.data })
      .then((res) => {
        this.setState({
          allUsers: [...res.data.result],
        });
      });
  };

  closeModal = () => {
    this.props.closeModal();
  };

  render() {
    let allUsers = null;
    if (this.state.allUsers.length) {
      allUsers = this.state.allUsers.map((data, index) => {
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
              to={`/profile?userId=${data.id}`}
              style={{ textDecoration: "none" }}
            >
              <img alt="profile" className="profile" src={data.profilePic} />{" "}
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
                {data.name}{" "}
              </span>{" "}
            </Link>{" "}
            <br />
            <div style={{ borderBottom: "1px solid gray" }}> </div>{" "}
          </div>
        );
      });
    } else {
      allUsers = (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "maroon",
            fontFamily: "Segoe UI",
          }}
        >
          No User Exists!!
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
            {allUsers}{" "}
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
