import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios/axios";
import firebase from "../firebase/firebase";
import { setAllPosts } from "../../actions/authActions";
import Swal from "sweetalert2";
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
    let SS;
    if (this.state.selectedFile) {
      firebase
        .storage()
        .ref()
        .child(this.state.selectedFile.name + new Date().getTime())
        .put(this.state.selectedFile)
        .on(
          "state_changed",
          (snapshot) => {
            SS = snapshot;
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //because I create 80% of file upload to firebase and use 20% to upload data to mysql
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.log("ERROR IN UPLOADING FILE");
            Swal.fire({
              title: "Upload Failed",
              text: "Error in uploading your post try again!",
              icon: "error",
              showConfirmButton: false,
              timer: 1000,
            });
          },
          () => {
            SS.ref.getDownloadURL().then((downloadURL) => {
              console.log("File available at", downloadURL);
              url = downloadURL;
              axios.defaults.headers.common["x-auth-token"] =
                localStorage.getItem("instagram");
              let data = {
                description: this.state.description,
                imageUrl: downloadURL,
                hashtags: hashtags,
              };

              axios
                .post("/api/posts/create", data)
                .then((res) => {
                  axios.get("/api/posts/all").then((ress) => {
                    this.props.setAllPosts(ress.data);

                    Swal.fire({
                      title: "Uploaded Successfully",
                      text: "Your post is now live your friends can see your post",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 1000,
                    });

                    hashtags = [];
                    this.setState({
                      description: "",
                      selectedFile: null,
                    });
                  });
                })
                .catch((e) => {
                  Swal.fire({
                    title: "Upload Failed",
                    text: "Error in uploading your post try again!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                });
            });
          }
        );
    } else {
      axios.defaults.headers.common["x-auth-token"] =
        localStorage.getItem("instagram");
      let data = {
        description: this.state.description,
        imageUrl: url ? url : this.state.imageUrl,
        hashtags: hashtags,
      };
      axios
        .post("/api/posts/create", data)
        .then((res) => {
          axios.get("/api/posts/all").then((ress) => {
            this.props.setAllPosts(ress.data);
            Swal.fire({
              title: "Uploaded Successfully",
              text: "Your post is now live your friends can see your post",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
            hashtags = [];
            this.setState({
              description: "",
              imageUrl:
                "https://oorwin.com/wp-content/themes/sydney-child/images/post-placeholder-medium.jpg",
              selectedFile: null,
            });
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Upload Failed",
            text: "Error in uploading your post try again!",
            icon: "error",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    }
  };

  render() {
    return (
      <>
        <div className="create-new">
          <div>
            <textarea
              className="upload-text-area"
              cols="27"
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

            <div className="postBtn" onClick={this.submitHandler}>
              Post
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps, { setAllPosts })(createPost);
