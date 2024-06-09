import axios from "./";

export default {
  async getAll(): Promise<String> {
    const response = await axios.get("/task/");

    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      return "";
    }
  },

  async getTaskByURL(title) {
    const response = await axios.post("/task/getTask", {
      name: title,
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      return "[]";
    }
  },

  async getCurrentSolution(title) {
    const response = await axios.post("/task/getTaskSolution", {
      name: title,
    });

    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      return "[]";
    }
  },
};
