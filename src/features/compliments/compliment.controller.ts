import httpStatus from "http-status";
import complimentService from "../profiles/compliments/compliment.service";
import type { Request, Response } from "express";
import { formatObjectLikeQuery } from "@/database/helpers/constructWhereQuery";

export const handleGetCompliments = async (req: Request, res: Response) => {
  const items = await complimentService.getCompliments({
    operators: {
      title: "ilike",
    },
    queryOptions: formatObjectLikeQuery(req.query as Record<string, string>),
  });
  res.status(httpStatus.OK).json({
    data: items,
  });
};
