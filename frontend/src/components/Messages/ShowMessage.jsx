import React from "react";
import useScrollBottom from "../../hooks/useScrollBottom";

export default function ShowMessage({ openedMessage }) {
  useScrollBottom("messages-right-container");

  return (
    <>
      <div className="messages-top-section">{openedMessage.name}</div>
      <div id="messages-right-container" className="messages-right-container">
        <div className="messages-right-detail">
          {openedMessage.messages.map((msg, index) => {
            return msg.type === "SEND" ? (
              <div className="message-detail-right" key={msg.message + index}>
                {msg.message}
              </div>
            ) : (
              <div className="message-detail-left" key={msg.message + index}>
                {msg.message}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
