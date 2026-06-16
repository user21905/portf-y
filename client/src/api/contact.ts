import { api } from "./client";

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  hp_company?: string;
}

export const contactApi = {
  send: (payload: ContactPayload) => api.post<{ success: boolean }>("/contact", payload),
};
