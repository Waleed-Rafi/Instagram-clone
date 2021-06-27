import React, { useEffect } from "react";

const useScrollBottom = (elementId) => {
  const updateScroll = () => {
    var element = document.getElementById(elementId);
    element.scrollTop = element.scrollHeight;
  };

  useEffect(() => {
    updateScroll();
  }, [elementId]);
};

export default useScrollBottom;
