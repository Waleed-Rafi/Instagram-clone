import React, { Component } from "react";
import uploadImage from "../../assets/images/file-upload.png";

class createPost extends Component {
  render() {
    return (
      <div style={{ position: "fixed" }}>
        <div className="head-post">
          <img alt="profile" class="profile" src={this.props.postUserImage} />
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
            {this.props.postUserName}
          </span>
        </div>
        <div className="all-posts" style={{ width: "65%" }}>
          <textarea
            style={{
              border: "none",
              outline: "none",
              overflow: "hidden",
              resize: "none",
            }}
            name="Type Something to Post"
            id=""
            cols="40"
            rows="4"
            placeholder="Type Something to Post"
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
          <img
            src={uploadImage}
            style={{
              width: "7%",
              outline: "none",
              padding: "0.3rem 0 0rem 1rem",
              paddingLeft: "10px",
            }}
            type="text"
            placeholder="Add Comment"
          ></img>
          <button style={{ top: "0.5rem" }}>Post</button>
        </div>
      </div>
    );
  }
}

export default createPost;
