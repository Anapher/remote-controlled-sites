import express from "express";
import { configureApi } from "./api";
import configureWebSockets from "./ws";

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());

configureApi(app);

const server = configureWebSockets(app);

server.listen(port, () =>
  console.log(`Server is running on port: http://localhost:${port}`)
);
