import express from "express";
import tasksRouter from "./tasks";

const apiRouter = express.Router({
  strict: true,
});

apiRouter.use("/task", tasksRouter);

export default apiRouter;
