declare module "jsonwebtoken" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface JwtPayload {
    userId: number;
    accessKey?: string;
    role: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Jwt {}
}
