import { Request, Response } from "express-serve-static-core";

export function getUsers(req: Request, res: Response) {
  res.send("Users Route");
}
