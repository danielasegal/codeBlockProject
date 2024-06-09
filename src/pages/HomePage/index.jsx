import React from "react";
import TaskBlock from "../../components/TaskBlock";

function index({ taskListArr, setCurrentTask, teacher }) {
  const renderTasks = taskListArr
    ? taskListArr.map((taskItem, index) => (
        <TaskBlock
          key={index}
          taskItem={taskItem}
          setCurrentTask={setCurrentTask}
        ></TaskBlock>
      ))
    : "";

  return (
    <>
      <div>
        {teacher && <p>HELLO TEACHER WELCOME TO</p>}
        {!teacher && <p>HELLO WELCOME TO</p>}
        <h2
          style={{ fontSize: "50px", color: "yellow", fontFamily: "logo-font" }}
        >
          {" "}
          CODE BLOCK
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {taskListArr.length > 0 ? renderTasks : <>Loading...</>}
        </div>
        <p>PLEASE CHOOSE A TASK</p>
      </div>
    </>
  );
}

export default index;
