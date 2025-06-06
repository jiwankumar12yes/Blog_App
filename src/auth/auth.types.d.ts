export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  id: number; // User ID
  email: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expiration
}

export type UserPayload = {
  id: number;
  username?: string;
  email: string;
  role: "USER" | "ADMIN" | "EDITOR"; // or just `string` if Role is not imported
};
