import React from "react";

export default function MessageSR({
  allMessages = [],
  messageUserClickHandler,
  authUserId,
}) {
  return (
    <>
      {allMessages.length &&
        allMessages.map((data, index) => {
          return (
            <div
              // key={data.from}
              className="messages-all-users"
              onClick={() => messageUserClickHandler(data, index)}
            >
              <img
                style={{
                  height: "50px",
                  width: "50px",
                }}
                className="messages-user-image"
                src={data.profilePic}
                alt=""
              />
              <div className="messages-all-name-message">
                <div className="messages-user-name">{data.name}</div>
                <div className="messages-user-message">
                  <small>
                    {data.messages[data.messages.length - 1].message}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
