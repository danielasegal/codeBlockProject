import express from "express";
import { solutionArr } from "../app";
import TaskService from "../services/TaskService";

const router = express.Router();

router.get("/", async (req, res) => {
  //proc return array of all tasks
  res.send(await TaskService.getAll());
});

router.post("/getTask", async (req, res) => {
  const slug = req.body;
  res.send(await TaskService.getTaskByName(slug.name));
});

router.post("/getTaskSolution", async (req, res) => {
  const slug = req.body;
  const matchingItems = solutionArr.filter((item) => item.title === slug.name);

  // If matching items were found, send them in the response
  if (matchingItems.length > 0) {
    res.send(...matchingItems);
  } else {
    // If no matching items were found, send an empty array
    res.send([]);
  }
});

export default router;
