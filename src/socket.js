import { v4 as uuidv4 } from "uuid"; // Import uuidv4 for generating client IDs
import io from "socket.io-client"; // Import socket.io-client for creating socket connections

const clientId = localStorage.getItem("clientId") || uuidv4(); // Get client ID from local storage or generate a new one
localStorage.setItem("clientId", clientId); // Store the client ID in local storage

const socket = io("http://localhost:3000", {
  query: { clientId }, // Pass the client ID to the server during the handshake
});

export default socket;
