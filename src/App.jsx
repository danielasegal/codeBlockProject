import "./App.css";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import LogPage from "./pages/LogPage";
import TasksService from "./services/TasksService";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import socket from "./socket";

function App() {
  const [tasksList, setTasksList] = useState([]);
  const [currentTask, setCurrentTask] = useState();
  const [teacher, setTeacher] = useState(false);

  useEffect(() => {
    TasksService.getAll().then((data) => {
      data !== undefined ? setTasksList(data) : "";
    });

    socket.on("connect", () => {
      console.log("Connected to server");
      // Sending a request from the client after connection
      socket.emit("requestEvent", { message: "Hello from client" });
    });

    // Receiving a message from the server
    socket.on("message", (message) => {
      console.log("Received message from server:", message);
    });

    // Listening for "teacher" message from the server
    socket.on("teacher", (message) => {
      console.log("Received teacher message from server:", message);
      // Set teacher status based on the message
      setTeacher(true);
    });

    // Listening for "submit" message from the server
    socket.on("submit", (data) => {
      console.log("Received submit message from server:", data);
      // window.alert(
      //   "A student has submitted a function: " + JSON.stringify(data)
      // );
    });

    socket.emit("isTeacher", {});

    return () => {
      // Clean up event listeners or any teardown logic related to the socket connection
      socket.removeAllListeners();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LogPage setTeacher={setTeacher} />} />
        {tasksList.length > 0 && (
          <Route
            path="/HomePage"
            exact
            element={
              <HomePage
                taskListArr={tasksList}
                setCurrentTask={setCurrentTask}
                teacher={teacher}
              />
            }
          />
        )}

        <Route
          path={"/TaskPage/:currentTask"}
          element={
            <TaskPage
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              socket={socket}
              teacher={teacher}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
