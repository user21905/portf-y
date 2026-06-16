import { api } from "./client";

export interface LoginPayload {
  username: string;
  password: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ success: boolean }>("/auth/login", payload, { silent: true }),
  logout: () => api.post<{ success: boolean }>("/auth/logout"),
  me: () =>
    api.get<{ admin: { id: string; username: string } }>("/auth/me", { silent: true }),
};
