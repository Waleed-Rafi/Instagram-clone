import React from "react";
import useScrollBottom from "../../hooks/useScrollBottom";

export default function ShowMessage() {
  useScrollBottom("messages-right-container");

  return (
    <div id="messages-right-container" className="messages-right-container">
      <div className="messages-right-detail">
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-right">
          Lorem ipsum dolor sit amet, consectetur adipisicing.
        </div>
        <div className="message-detail-left">Lorem sdfdf</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-right">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-right">Lorem</div>
        <div className="message-detail-left">Lorem asdfasdfsdf s</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-right">Lorem sdfsdfsdfsdf</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-right">Lorem sdfsdfsdfsdf</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-right">Lorem sdfsdfsdfsdf</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
        <div className="message-detail-left">Lorem</div>
      </div>
    </div>
  );
}
