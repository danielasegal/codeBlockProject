import React from "react";
import { logBlockStyle } from "../../styles/codeBlockStyles.js";
import { useNavigate } from "react-router-dom";

function index() {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "yellow", fontFamily: "logo-font" }}>CODE BLOCK</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button style={logBlockStyle} onClick={() => navigate("/HomePage")}>
            connect class
          </button>
        </div>
      </div>
    </>
  );
}

export default index;
