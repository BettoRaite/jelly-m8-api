import type { CreateUserPayload } from "./user.schema";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import * as userService from "./user.service";
import type { TypedRequest } from "@/lib/types/types";

export const handleCreateUser = async (req: Request, res: Response) => {
  const payload = req.body as CreateUserPayload;

  const storedUser = await userService.getUserBy({
    username: payload.username,
  });
  if (storedUser) {
    return res.status(httpStatus.CONFLICT).json({
      message: "user with given name already exists",
    });
  }
  await userService.createUser(payload);
  res.status(httpStatus.CREATED).json({
    message: "Successfully created user",
  });
};

export const handleGetUsers = async (_: Request, res: Response) => {
  const users = await userService.getUsers();
  res.status(httpStatus.OK).json({
    data: users,
  });
};

export const handleGetCurrentUser = async (req: Request, res: Response) => {
  const id = req.payload?.userId as number;
  const user = await userService.getUserBy({
    id,
  });
  res.status(httpStatus.OK).json({
    data: user,
  });
};

export const handleInvalidateAccessKey = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      id: number;
    }
  >,
  res: Response,
) => {
  const { id } = req.params;
  // Making sure that user actually exists
  const user = await userService.getUserBy({
    id: id as number,
  });
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User with given id does not exist",
    });
  }
  await userService.invalidateUserAccessSecret(id as number);
  res.status(httpStatus.OK).json({
    message: "Successfully invalidated user access key",
  });
};

export const handleDeleteUser = async (
  req: TypedRequest<
    unknown,
    unknown,
    {
      id: number;
    }
  >,
  res: Response,
) => {
  const id = req.params.id as number;
  const user = await userService.getUserBy({
    id,
  });
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User with given id does not exist",
    });
  }
  await userService.deleteUser(id);
  res.status(httpStatus.OK).json({
    message: "Successfully deleted user",
  });
};
