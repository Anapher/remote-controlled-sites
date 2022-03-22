import cors from "cors";
import express from "express";

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () =>
  console.log(`Server is running on port: http://localhost:${port}`)
);
