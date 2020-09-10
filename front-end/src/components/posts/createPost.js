import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios/axios";
import firebase from "../firebase/firebase";
import "./createPost.css";

class createPost extends Component {
  state = {
    description: "",
    imageUrl:
      "https://pbs.twimg.com/profile_images/1222782643676368896/VJmUtX_e_400x400.jpg",
    selectedFile: null,
  };
  changeHandler = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  imageChangeHandler = (e) => {
    if (e.target.files.length > 0) {
      this.setState({
        selectedFile: e.target.files[0],
      });
    }
  };

  submitHandler = async () => {
    let url = null;
    if (this.state.selectedFile) {
      firebase
        .storage()
        .ref()
        .child(this.state.selectedFile.name)
        .put(this.state.selectedFile)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then(async (res) => {
          url = res;
          axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
            "instagram"
          );
          let data = {
            description: this.state.description,
            imageUrl: url ? url : this.state.imageUrl,
          };
          await axios.post("/api/posts/create", data).then((res) => {
            console.log(res.data.message);
            this.setState({
              description: "",
              selectedFile: null,
            });
          });
        });
    } else {
      axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
        "instagram"
      );
      let data = {
        description: this.state.description,
        imageUrl: url ? url : this.state.imageUrl,
      };
      axios.post("/api/posts/create", data).then((res) => {
        console.log(res.data.message);
        this.setState({
          description: "",
        });
      });
    }
  };
  render() {
    return (
      <div style={{ position: "fixed" }}>
        <div className="head-post">
          <img
            alt="profile"
            class="profile"
            src={this.props.auth.user.profilePic}
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
            {this.props.auth.user.name}
          </span>
        </div>
        <div className="all-posts" style={{ width: "65%" }}>
          <textarea
            style={{
              border: "none",
              outline: "none",
              overflow: "hidden",
              resize: "none",
              fontFamily: "Segoe UI",
              fontSize: "14px",
            }}
            name="Type Something to Post"
            id=""
            cols="40"
            rows="4"
            placeholder="Type Something to Post"
            value={this.state.description}
            onChange={this.changeHandler}
          ></textarea>
        </div>
        <div
          style={{
            width: "65%",
            position: "relative",
            zIndex: "0",
            border: "1px solid #dbdbdb",
            borderTop: "none",
          }}
        >
          {/* <img
            src={uploadImage}
            style={{
              width: "7%",
              outline: "none",
              padding: "0.3rem 0 0rem 1rem",
              paddingLeft: "10px",
            }}
          ></img> */}
          <input
            style={{
              width: "100%",
              outline: "none",
              padding: "0.4rem 15rem 0.4rem 1rem",
              paddingLeft: "10px",
            }}
            type="file"
            onChange={this.imageChangeHandler}
          />

          <button style={{ top: "0.5rem" }} onClick={this.submitHandler}>
            Post
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps)(createPost);
