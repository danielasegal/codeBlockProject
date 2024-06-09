import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import TasksService from "../../services/TasksService";
import smileImg from "../../assets/images/smile.webp";
import {
  taskPageTitleStyle,
  taskPageDescriptionStyle,
  submitBtnStyle,
  smileImgStyle,
} from "../../styles/codeBlockStyles";

export default function Index({
  currentTask,
  setCurrentTask,
  socket,
  teacher,
}) {
  const [solution, setSolution] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const valueGetter = useRef();
  const pathName = window.location.pathname.split("/");
  const initialRender = useRef(true);
  const [showSmile, setShowSmile] = useState(false);

  useEffect(() => {
    // Fetch initial solution and task from the server
    TasksService.getCurrentSolution(
      decodeURI(pathName[pathName.length - 1])
    ).then((data) => {
      setSolution(data.solution);
      setIsSubmited(data.SubmitStatus);
    });

    TasksService.getTaskByURL(decodeURI(pathName[pathName.length - 1])).then(
      (data) => {
        setCurrentTask(data);
      }
    );
  }, []);

  useEffect(() => {
    valueGetter.current && valueGetter.current(solution);
  }, [solution]);

  useEffect(() => {
    // Emit the solution to the server
    if (!initialRender.current) {
      socket.emit("message", {
        title: currentTask ? currentTask.title : "",
        solution: solution,
      });
    }
  }, [solution, socket]);

  useEffect(() => {
    // Listen for the "message" event from the server
    const handleMessage = (data) => {
      // Update the received message state with the data from the server
      data.title === currentTask.title && setSolution(data.solution);
    };

    socket.on("message", handleMessage);

    // Listen for the "message" event from the server
    const handleSubmit = (data) => {
      // Update the received message state with the data from the server
      data.title === currentTask.title ? setIsSubmited(true) : "";
    };

    socket.on("submitMessage", handleSubmit);

    const handleCorrectSolution = (data) => {
      // Update the received message state with the data from the server
      if (data.title === currentTask.title) {
        setShowSmile(true);
        setTimeout(() => {
          setShowSmile(false);
        }, 2000);
      }
    };

    socket.on("correctSolution", handleCorrectSolution);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [currentTask, socket]);

  const handleChange = (value) => {
    if (value !== solution) {
      setSolution(value);
    }
  };

  const handleSubmitClick = () => {
    socket.emit("submitEvent", { title: currentTask.title });
    setIsSubmited(true);
  };

  useEffect(() => {
    initialRender.current = false;
  }, []);

  return (
    <>
      {currentTask && (
        <div style={taskPageTitleStyle}>
          <h2 style={{ color: "yellow" }}>{currentTask.title}</h2>
          <div style={taskPageDescriptionStyle}>
            <p>{currentTask.description}</p>
          </div>
          {isSubmited && (
            <p style={{ fontSize: "10px", color: "pink" }}>
              this task block has been submitted
            </p>
          )}
          <div id="monaco-container">
            <Editor
              height="40vh"
              width="60vw"
              language="javascript"
              value={solution}
              onChange={handleChange}
              editorDidMount={(getValue) => {
                valueGetter.current = getValue;
              }}
              options={{
                fontSize: 10,
                readOnly: teacher || isSubmited,
              }}
            />
          </div>
          {!teacher && !isSubmited && (
            <button style={submitBtnStyle} onClick={handleSubmitClick}>
              submit
            </button>
          )}
          {currentTask && (
            <div style={{ fontSize: "12px" }} className="task-Example">
              <p>test case : {currentTask.case}</p>
              <p>expected result : {currentTask.expectedResult}</p>
            </div>
          )}
        </div>
      )}
      {showSmile && <img src={smileImg} alt="Smiley" style={smileImgStyle} />}
    </>
  );
}
