declare module "jsonwebtoken" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface JwtPayload {
    userId: string;
    accessKey?: string;
    role: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Jwt {}
}
