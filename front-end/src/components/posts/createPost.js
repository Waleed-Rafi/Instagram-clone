import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios/axios";
import firebase from "../firebase/firebase";
import { setAllPosts } from "../../actions/authActions";
import "./createPost.css";

let hashtags = [];
class createPost extends Component {
  state = {
    description: "",
    imageUrl:
      "https://oorwin.com/wp-content/themes/sydney-child/images/post-placeholder-medium.jpg",
    selectedFile: null,
  };
  changeHandler = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  extractHashtags = (myString) => {
    var regexp = /#(\w+)/g;
    var match = regexp.exec(myString);
    while (match != null) {
      hashtags.push(match[1]);
      match = regexp.exec(myString);
    }
  };

  imageChangeHandler = (e) => {
    if (e.target.files.length > 0) {
      this.setState({
        selectedFile: e.target.files[0],
      });
    }
  };

  submitHandler = async () => {
    this.extractHashtags(this.state.description);
    let url = null;
    if (this.state.selectedFile) {
      let upload = await firebase
        .storage()
        .ref()
        .child(this.state.selectedFile.name)
        .put(this.state.selectedFile);
      // .then((snapshot) => snapshot.ref.getDownloadURL())
      // .then(async (res) => {
      //   url = res;
      //   axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
      //     "instagram"
      //   );
      //   let data = {
      //     description: this.state.description,
      //     imageUrl: url ? url : this.state.imageUrl,
      //   };
      //   await axios.post("/api/posts/create", data).then((res) => {
      //     axios.get("/api/posts/all").then((res) => {
      //       this.props.setAllPosts(res.data);
      //       this.setState({
      //         description: "",
      //         selectedFile: null,
      //       });
      //     });
      //   });
      // });
      upload.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          let bar = document.getElementById("file-loader");
          bar.style.border = "4px solid green";
          bar.style.width = `${progress}%`;
          if (progress === 100) bar.style.border = "none";
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          upload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
          });
        }
      );
    } else {
      axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
        "instagram"
      );
      let data = {
        description: this.state.description,
        imageUrl: url ? url : this.state.imageUrl,
        hashtags: hashtags,
      };
      axios.post("/api/posts/create", data).then((res) => {
        console.log(res.data.message);
        this.setState({
          description: "",
          imageUrl:
            "https://oorwin.com/wp-content/themes/sydney-child/images/post-placeholder-medium.jpg",
          selectedFile: null,
        });
        hashtags = [];
      });
    }
  };

  render() {
    return (
      <div style={{ position: "fixed" }}>
        <div className="head-post">
          <img
            alt="profile"
            className="profile"
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
              // border: "none",
              outline: "none",
              overflow: "hidden",
              resize: "none",
              fontFamily: "Segoe UI",
              fontSize: "14px",
              border: "1px solid silver",
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
            marginTop: "-1%",
            width: "90%",
            position: "relative",
            border: "1px solid silver",
            padding: "7px 12px",
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
          <hr
            style={{ marginTop: "-0.45rem" }}
            align="left"
            // hidden
            id="file-loader"
          />
          <label>
            Upload
            <input
              hidden
              className="upload-file"
              type="file"
              onChange={this.imageChangeHandler}
            />
          </label>

          <button
            style={{ top: "0.5rem", marginLeft: "100%" }}
            onClick={this.submitHandler}
          >
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

export default connect(mapStateToProps, { setAllPosts })(createPost);
