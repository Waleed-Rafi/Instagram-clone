import React from "react";

export default function ProgressBar({ completed = 0 }) {
  let progressBar = null;
  if (completed)
    progressBar = (
      <div
        className="progress-bar"
        style={{
          height: "5px",
          width: `${completed}%`,
          backgroundColor: "dodgerblue",
        }}
      ></div>
    );
  return (
    <div style={{ width: "99.75vw", marginTop: "-2.6rem" }}>{progressBar}</div>
  );
}
