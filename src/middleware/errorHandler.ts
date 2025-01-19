import type { NextFunction, Request, Response } from "express";

function errorHandler(
  err: Error,
  _r: Request,
  res: Response,
  _n: NextFunction
) {
  console.log(res);
  res.status(500).json({ message: err.message });
}

export default errorHandler;
