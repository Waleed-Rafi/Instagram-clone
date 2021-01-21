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
            axios.get("/api/posts/all").then((res) => {
              this.props.setAllPosts(res.data);
              this.setState({
                description: "",
                selectedFile: null,
              });
            });
          });
        });
      // upload.on(
      //   "state_changed",
      //   function (snapshot) {
      //     var progress =
      //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      //     let bar = document.getElementById("file-loader");
      //     bar.style.border = "4px solid green";
      //     bar.style.width = `${progress}%`;
      //     if (progress === 100) bar.style.border = "none";
      //   },
      //   function () {
      //     // Handle successful uploads on complete
      //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      //     upload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
      //       console.log("File available at", downloadURL);
      //     });
      //   }
      // );
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
      <div className="create-new">
        <div>
          <textarea
            className="upload-text-area"
            cols="55"
            rows="3"
            placeholder="Type Something to Post"
            value={this.state.description}
            onChange={this.changeHandler}
          ></textarea>
        </div>
        <div className="upload-post-btn">
          <label className="upload">
            Upload
            <input
              hidden
              type="file"
              accept="image/png, image/jpeg"
              onChange={this.imageChangeHandler}
            />
          </label>

          <a className="postBtn" onClick={this.submitHandler}>
            Post
          </a>
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
