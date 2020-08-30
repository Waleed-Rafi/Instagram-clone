import React, { Component } from "react";
import "./profile.css";

class Profile extends Component {
  render() {
    return (
      <div>
        <div className="complete-profile">
          <div>
            <img
              alt="profile"
              class="profile-pic"
              src={this.props.postUserImage}
            />
          </div>
          <div className="user-detail">
            <div className="user-name">{this.props.postUserName}</div>
            <div style={{ marginTop: "3%", marginBottom: "3%" }}>
              <span
                style={{
                  marginRight: "5%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  161
                </span>{" "}
                posts
              </span>
              <span
                style={{
                  marginRight: "5%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  200M
                </span>{" "}
                followers
              </span>
              <span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  45
                </span>{" "}
                following
              </span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>
              {this.props.postUserName}
            </div>
            <div style={{ width: "80%" }}>
              <hr />
            </div>
          </div>
          <br />
        </div>
        <div className="all-Posts">
          <div>
            <img src={this.props.postUserImage3} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage1} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage6} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage7} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage4} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage5} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage6} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage7} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage5} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage2} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage1} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage6} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage1} alt="" />
          </div>
          <div>
            <img src={this.props.postUserImage4} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
