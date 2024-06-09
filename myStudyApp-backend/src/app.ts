import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import apiRouter from "./routes";
import { dataSource } from "./database";
import TaskService from "./services/TaskService";

const PORT = process.env.PORT || 3000;

let teacher = null;

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

function broadcast(clientId, eventKey, message) {
  for (const otherClientId in connectedClients) {
    if (clientId !== otherClientId) {
      connectedClients[otherClientId].emit(eventKey, message);
    }
  }
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

  console.log("isTeacher", teacher, clientId);
  if (teacher === null || clientId === teacher) {
    teacher = clientId;
    socket.emit("teacher", { teacher: true });
  }

  socket.on("message", (data) => {
    console.log("Received message from client:", data);
    // Handle the received message here (e.g., log it or perform further processing)
    const foundItem = solutionArr.find((item) => item.title === data.title);

    if ("solution" in data && foundItem) {
      foundItem.solution = data.solution;
      checkCode(foundItem);
    }

    broadcast(clientId, "message", data); // Broadcast it to all of the client
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
    if (clientId === teacher) {
      socket.emit("teacher", { teacher: true }); // Emit "teacher" message to the client that asked
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

  socket.conn.on("close", () => {
    delete connectedClients[clientId];
    console.log(clientId, "disconnected");
  });
});

app.use("/api", apiRouter);

export { solutionArr };
export default app;
