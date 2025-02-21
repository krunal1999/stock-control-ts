import express, { NextFunction, Request, Response } from "express";
import usersRouter from "./routes/users";

const app = express();
const port = 3000;

app.use("/api/users", usersRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
