export type LoginResponse = {
  accessToken: string;
  accessTokenExpiration: string;
  roles: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
};
