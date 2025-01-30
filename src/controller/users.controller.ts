import type { CreateUserPayload } from "@/schemas/user.schema";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import usersService, { getUserBy } from "@/services/users.service";
import type { TypedRequest } from "@/lib/types/types";

export const handleCreateUser = async (req: Request, res: Response) => {
  const payload = req.body as CreateUserPayload;

  const storedUser = await usersService.getUserBy({
    username: payload.username,
  });
  if (storedUser) {
    return res.status(httpStatus.CONFLICT).json({
      message: "user with given name already exists",
    });
  }
  await usersService.createUser(payload);
  res.status(httpStatus.CREATED).json({
    message: "Successfully created user",
  });
};

export const handleCreateUserProfile = async (req: Request, res: Response) => {
  const payload = req.body as CreateUserPayload;

  const storedUser = await usersService.getUserBy({
    username: payload.username,
  });
  if (storedUser) {
    return res.status(httpStatus.CONFLICT).json({
      message: "user with given name already exists",
    });
  }
  await usersService.createUser(payload);
  res.status(httpStatus.CREATED).json({
    message: "Successfully created user",
  });
};

export const handleGetUsers = async (_: Request, res: Response) => {
  const users = await usersService.getUsers();
  res.status(httpStatus.OK).json({
    data: users,
  });
};

export const handleGetUserSelf = async (req: Request, res: Response) => {
  const { userId } = req.payload as JwtPayload;
  const user = await usersService.getUserBy({
    id: userId,
  });
  if (!user) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  user.accessSecret = undefined as unknown as string;
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
  const user = await usersService.getUserBy({
    id: id as number,
  });
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User with given id does not exist",
    });
  }
  await usersService.invalidateUserAccessSecret(id as number);
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
  const { id } = req.params;
  const user = await getUserBy({
    id: id as number,
  });
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: "User with given id does not exist",
    });
  }
  await usersService.deleteUser(id as number);
  res.status(httpStatus.OK).json({
    message: "Successfully deleted user",
  });
};
