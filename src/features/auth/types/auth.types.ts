export type LoginResponse = {
  token: string;
  roles: string[];
  tokenExpiration: string;
  refreshToken: string;
  refreshTokenExpiration: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
