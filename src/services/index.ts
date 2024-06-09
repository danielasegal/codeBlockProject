import axios from "axios";
// var sessions = require("client-sessions");

// app.use(sessions({
//   secret: 'blargadeeblargblarg', // should be a large unguessable string
//   duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
//   activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
// }));

declare global {
  interface ImportMeta {
    env: {
      VITE_APP_BACKEND_URL: string;
    };
  }
}

export default axios.create({
  baseURL:
    `${import.meta.env.VITE_APP_BACKEND_URL}/api/` ||
    "http://localhost:3000/api/",
});
