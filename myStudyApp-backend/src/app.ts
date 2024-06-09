import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import apiRouter from "./routes";
import { dataSource } from "./database";
import TaskService from "./services/TaskService";

const PORT = 3000;

let teacherID = null;
let studentID = null;

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const solutionArr = [];
const connectedClients: any = {};
let teacherMessageSent = false;

async function fetchDataAndCreateSolutionArray() {
  const taskArr = await TaskService.getAll();

  taskArr.forEach((item) => {
    solutionArr.push({
      title: item.title,
      solution: "",
      SubmitStatus: false,
      expectedResult: item.expectedResult,
    });
  });
}

// establish database connection
dataSource
  .initialize()
  .then(async () => {
    await fetchDataAndCreateSolutionArray();
    httpServer.listen(PORT, () => {
      console.log(`
        ################################################
        #  Server listening on port: ${PORT}    
        ################################################
      `);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  const clientId =
    (socket.handshake.query as { clientId: string }).clientId || "";

  connectedClients[clientId] = socket;

  console.log("Connected client ID:", clientId);

  // Handling a request on the server
  socket.on("requestEvent", (requestData) => {
    console.log("Received request from client:", requestData);

    // Event listener for "message" event from client

    // Sending a response from the server
    socket.emit("responseEvent", { message: "Hello from server" });
  });

  socket.on("message", (data) => {
    console.log("Received message from client:", data);
    // Handle the received message here (e.g., log it or perform further processing)
    const foundItem = solutionArr.find((item) => item.title === data.title);

    if ("solution" in data && foundItem) {
      foundItem.solution = data.solution;
      checkCode(foundItem);
    }

    socket.broadcast.emit("message", data); // Broadcast it to all of the client
  });

  function checkCode(foundItem) {
    try {
      const userFunction = eval(foundItem.solution);
      console.log(userFunction);
      console.log(foundItem.expectedResult);
      console.log(String(userFunction) === String(foundItem.expectedResult));
      if (String(userFunction) === String(foundItem.expectedResult)) {
        socket.emit("correctSolution", foundItem);
      }
    } catch {
      console.log("incorrect");
    }
  }

  socket.on("isTeacher", (data) => {
    const firstClientKey = Object.keys(connectedClients)[0];
    if (firstClientKey) {
      const firstClientSocket = connectedClients[firstClientKey];
      firstClientSocket.emit("teacher", { teacher: true }); // Emit "teacher" message to the first client
    }
  });

  socket.on("submitEvent", (data) => {
    const foundItem = solutionArr.find((item) => item.title === data.title);
    foundItem ? (foundItem.SubmitStatus = true) : "";
    console.log(solutionArr);
    console.log("Submit event received from client:", data);
    const firstClientKey = Object.keys(connectedClients)[0];
    if (firstClientKey) {
      const firstClientSocket = connectedClients[firstClientKey];
      firstClientSocket.emit("submit", data.title);
    }
    socket.broadcast.emit("submitMessage", data);
  });

  if (!teacherMessageSent) {
    console.log("new teacher");
    const firstClientKey = Object.keys(connectedClients)[0];
    if (firstClientKey) {
      const firstClientSocket = connectedClients[firstClientKey];
      firstClientSocket.emit("teacher", { teacher: true });
      teacherMessageSent = true;
    }
  }
});

app.use("/api", apiRouter);

export { solutionArr };
export default app;
