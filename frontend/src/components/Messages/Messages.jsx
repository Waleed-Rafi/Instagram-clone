import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import axios from "../../axios/axios";
import ShowMessage from "./ShowMessage";
import MessageSR from "./MessageSR";
import { loginAfter } from "../../actions/authActions";
import FIREBASE from "../firebase/firebase";
import "./messages.css";

// const DATABASE = FIREBASE.database();

function Messages(props) {
  const [myMessage, setMyMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [targetAllMessages, setTargetAllMessages] = useState([]);
  const [currentlyOpenMessage, setCurrentlyOpenedMessage] = useState({});
  const [currentlyOpenedIndex, setCurrentlyOpenedIndex] = useState(0);

  useEffect(() => {
    if (!props.auth.user.id) window.location.href = "/";
    (async () => {
      await FIREBASE.database()
        .ref("/usersMessages/" + props.auth.user.id)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          if (data) {
            setAllMessages(data);
            setCurrentlyOpenedMessage(data[0]);
          }
        });
    })();
  }, []);

  const changeHandler = async (e) => {
    setMyMessage(e.target.value);
    await FIREBASE.database()
      .ref("/usersMessages/" + currentlyOpenMessage.id)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        if (data) {
          setTargetAllMessages(data);
        }
      });
  };

  const messageUserClickHandler = (data, index) => {
    setCurrentlyOpenedMessage(data);
    setCurrentlyOpenedIndex(index);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let tempOpenedMessage = { ...currentlyOpenMessage };
    tempOpenedMessage.messages.push({
      from: props.auth.user.id,
      to: currentlyOpenMessage.id,
      message: myMessage,
    });
    let tempAllMessages = [...allMessages];
    tempAllMessages[currentlyOpenedIndex] = tempOpenedMessage;

    let tempTargetAll = [...targetAllMessages];
    let idx2 = tempTargetAll.findIndex(
      (data) => data.id === props.auth.user.id
    );
    if (idx2 !== -1) {
      tempTargetAll[idx2].messages.push({
        from: props.auth.user.id,
        to: currentlyOpenMessage.sender,
        message: myMessage,
      });
    }

    setMyMessage("");
    setCurrentlyOpenedMessage(tempOpenedMessage);
    setAllMessages(tempAllMessages);
    setTargetAllMessages(tempTargetAll);

    FIREBASE.database()
      .ref("/usersMessages/" + props.auth.user.id)
      .set(tempAllMessages);

    FIREBASE.database()
      .ref("/usersMessages/" + currentlyOpenMessage.id)
      .set(tempTargetAll);
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
        <ShowMessage
          openedMessage={currentlyOpenMessage}
          authUserId={props.auth.user.id}
        />

        <div className="new-messages">
          <form onSubmit={submitHandler}>
            <input
              style={{ color: "rgb(38, 38, 38)" }}
              autoFocus={true}
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

export default connect(mapStateToProps, {
  loginAfter,
})(Messages);
