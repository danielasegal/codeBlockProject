import React from "react";
import { taskBlockStyle } from "../../styles/codeBlockStyles.js";
import { useNavigate } from "react-router-dom";

export default function TaskBlock({ taskItem, setCurrentTask }) {
  const navigate = useNavigate();

  function navigateToProduct(title) {
    //navigate to product
    navigate("/TaskPage/" + title);
  }

  function handleTaskClick() {
    setCurrentTask(taskItem);
    navigateToProduct(taskItem.title);
  }

  return (
    <div onClick={handleTaskClick} style={taskBlockStyle} id="taskBlock">
      <p>{taskItem.title}</p>
    </div>
  );
}
