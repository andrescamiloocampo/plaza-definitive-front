export interface JwtPayload {
  sub: string;
  jti: string;
  roles: string[];
  iat: number;
  exp: number;
}