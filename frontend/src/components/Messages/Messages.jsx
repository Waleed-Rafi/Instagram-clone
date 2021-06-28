import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShowMessage from "./ShowMessage";
import MessageSR from "./MessageSR";
import FIREBASE from "../firebase/firebase";
import "./messages.css";

// const DATABASE = FIREBASE.database();

function Messages(props) {
  // useEffect(() => {
  //   FIREBASE.database().ref('/usersMessages/' + )
  // },[])
  const [myMessage, setMyMessage] = useState("");
  const [allMessages, setAllMessages] = useState([
    {
      from: 1,
      to: 2,
      id: 1,
      name: "Waleed Rafi",
      profilePic:
        "https://firebasestorage.googleapis.com/v0/b/react-my-burger-ec8a6.appspot.com/o/profile.jpg?alt=media&token=f1d30d50-db03-4e7c-bf4a-6101e0c72ed6",
      messages: [
        { type: "SEND", message: "Hello" },
        { type: "RECEIVE", message: "HI" },
        { type: "RECEIVE", message: "HI" },
        { type: "RECEIVE", message: "HI" },
      ],
    },
    {
      from: 1,
      to: 2,
      id: 1,
      name: "Waleed Rafi",
      profilePic:
        "https://firebasestorage.googleapis.com/v0/b/react-my-burger-ec8a6.appspot.com/o/profile.jpg?alt=media&token=f1d30d50-db03-4e7c-bf4a-6101e0c72ed6",
      messages: [
        { type: "SEND", message: "Hello" },
        { type: "RECEIVE", message: "HI" },
        { type: "RECEIVE", message: "HI" },
        { type: "RECEIVE", message: "HI" },
      ],
    },
  ]);
  const [currentlyOpenMessage, setCurrentlyOpenedMessage] = useState({
    id: 1,
    name: "Waleed Rafi",
    profilePic:
      "https://firebasestorage.googleapis.com/v0/b/react-my-burger-ec8a6.appspot.com/o/profile.jpg?alt=media&token=f1d30d50-db03-4e7c-bf4a-6101e0c72ed6",
    messages: [
      { type: "SEND", message: "Hello" },
      { type: "RECEIVE", message: "HI" },
      { type: "RECEIVE", message: "HI" },
      { type: "RECEIVE", message: "HI" },
    ],
  });

  const [currentlyOpenedIndex, setCurrentlyOpenedIndex] = useState(0);

  const changeHandler = (e) => {
    setMyMessage(e.target.value);
  };

  const messageUserClickHandler = (data, index) => {
    setCurrentlyOpenedMessage(data);
    setCurrentlyOpenedIndex(index);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let tempOpenedMessage = { ...currentlyOpenMessage };
    tempOpenedMessage.messages.push({ type: "SEND", message: myMessage });
    let tempAllMessages = [...allMessages];
    tempAllMessages[currentlyOpenedIndex] = tempOpenedMessage;
    setMyMessage("");
    setCurrentlyOpenedMessage(tempOpenedMessage);
    setAllMessages(tempAllMessages);
  };

  return (
    <div className="messages-main-section">
      <div className="messages-left-section">
        <div className="messages-top-section">Messages</div>
        <div className="messages-all-users-container">
          <MessageSR
            allMessages={allMessages}
            messageUserClickHandler={messageUserClickHandler}
          />
        </div>
      </div>
      <div className="messages-right-section">
        <ShowMessage openedMessage={currentlyOpenMessage} />

        <div className="new-messages">
          <form onSubmit={submitHandler}>
            <input
              style={{ color: "rgb(38, 38, 38)" }}
              value={myMessage}
              className="new-message-input"
              placeholder="Message..."
              onChange={changeHandler}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state,
  };
};

export default connect(mapStateToProps)(Messages);
