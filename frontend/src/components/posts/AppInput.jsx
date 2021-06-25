import React, { useState } from "react";

export default function AppInput(props) {
  const [commentMessage, setCommentMessage] = useState("");
  const commentChangeHandler = (e) => {
    setCommentMessage(e.target.value);
  };
  const commentSubmitHandler = (index, e) => {
    props.submitHandler(index, e, commentMessage);
    setCommentMessage("");
  };
  return (
    <div>
      <input
        onChange={commentChangeHandler}
        value={commentMessage}
        style={{
          width: "97%",
          border: "none",
          outline: "none",
          borderTop: "1px solid #dbdbdb",
          padding: "1rem 0 1rem 1rem",
          paddingLeft: "10px",
          color: "black",
        }}
        placeholder="Add Comment"
      />
      <button
        type="submit"
        onClick={(e) => commentSubmitHandler(props.index, e)}
      >
        Post
      </button>
    </div>
  );
}
