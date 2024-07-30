import React from "react";
import "./loader.css";

const Loader = ({ message = "Fetching Resources..." }) => {
  return (
    <div className="loader-container">
      <div className="rough">
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;