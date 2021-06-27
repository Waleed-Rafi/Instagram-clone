import React, { useEffect, useState } from "react";
import ShowMessage from "./ShowMessage";
import "./messages.css";

export default function Messages() {
  const [myMessage, setMyMessage] = useState("");

  const changeHandler = (e) => {
    setMyMessage(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(myMessage);
  };

  return (
    <div className="messages-main-section">
      <div className="messages-left-section">
        <div className="messages-top-section">Messages</div>
      </div>
      <div className="messages-right-section">
        <div className="messages-top-section">Messages</div>
        <ShowMessage />
        <div className="new-messages">
          <form onSubmit={submitHandler}>
            <input
              style={{ color: "rgb(38, 38, 38)" }}
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
