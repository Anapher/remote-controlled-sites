import { Express } from "express";

export function configureApi(app: Express) {
  app.post("/api/screen", (res, resp) => {
    resp.json({ test: "test" });
  });
}
