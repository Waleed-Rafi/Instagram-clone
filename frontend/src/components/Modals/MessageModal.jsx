import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FIREBASE from "../firebase/firebase";
import "./Comments.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "9rem",
    width: "37vw",
    padding: 0,
    overflow: "hidden",
    // overflow: "hidden",
    // border: "none",
  },
};

const MessageModal = ({ userDetail, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [myAllMessages, setMyAllMessages] = useState([]);
  const [targetAllMessages, setTargetAllMessages] = useState([]);
  useEffect(() => {
    console.log(userDetail, currentUser);
    (async () => {
      await FIREBASE.database()
        .ref("/usersMessages/" + currentUser.id)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setMyAllMessages(data);
          }
        });
      await FIREBASE.database()
        .ref("/usersMessages/" + userDetail.id)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setTargetAllMessages(data);
          }
        });
    })();
  }, []);

  const changeHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(myAllMessages, targetAllMessages);
    let tempMyAll = [...myAllMessages];
    let idx = tempMyAll.findIndex((data) => data.id === userDetail.id);
    if (idx !== -1) {
      tempMyAll[idx].messages.push({
        from: currentUser.id,
        to: userDetail.id,
        message: newMessage,
      });
    } else {
      tempMyAll.push({
        id: userDetail.id,
        sender: currentUser.id,
        name: userDetail.name,
        profilePic: userDetail.profilePic,
        messages: [
          { from: currentUser.id, to: userDetail.id, message: newMessage },
        ],
      });
    }
    let tempTargetAll = [...targetAllMessages];
    let idx2 = tempTargetAll.findIndex((data) => data.id === currentUser.id);
    if (idx2 !== -1) {
      tempTargetAll[idx2].messages.push({
        from: currentUser.id,
        to: userDetail.id,
        message: newMessage,
      });
    } else {
      tempTargetAll.push({
        id: currentUser.id,
        sender: userDetail.id,
        name: currentUser.name,
        profilePic: currentUser.profilePic,
        messages: [
          { from: currentUser.id, to: userDetail.id, message: newMessage },
        ],
      });
    }
    await FIREBASE.database()
      .ref("/usersMessages/" + currentUser.id)
      .set(tempMyAll);
    await FIREBASE.database()
      .ref("/usersMessages/" + userDetail.id)
      .set(tempTargetAll);
    setNewMessage("");
  };

  return (
    <Modal
      isOpen={true}
      // onRequestClose={this.closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="messages-top-section">New Message</div>
      <div className="new-messages" style={{ marginBottom: "10px" }}>
        <form onSubmit={(e) => submitHandler(e)}>
          <input
            style={{ color: "rgb(38, 38, 38)" }}
            value={newMessage}
            autoFocus={true}
            className="new-message-input"
            placeholder="Message..."
            onChange={(e) => changeHandler(e)}
          />
        </form>
      </div>
    </Modal>
  );
};
export default MessageModal;
