import { Task } from "../models/task";
import { dataSource } from "../database";

export default {
  async getAll() {
    const repository = dataSource.getRepository(Task);
    return await repository.find();
  },

  async getTaskByName(title) {
    const result = dataSource
      .getRepository(Task)
      .findOne({ where: { title: title } });
    return await result;
  },
};
