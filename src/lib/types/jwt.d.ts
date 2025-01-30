declare module "jsonwebtoken" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface JwtPayload {
    userId: number;
    accessSecret?: string;
    userRole: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Jwt {}
}
