import { Task } from "./models/task";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_URL ?? "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "admin",
  database: process.env.POSTGRES_DBNAME ?? "postgres",
  schema: process.env.POSTGRES_SCHEMA ?? "public",
  synchronize: true,
  logging: false,
  entities: [Task],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
