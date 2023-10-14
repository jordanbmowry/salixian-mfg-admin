import { defineStore } from 'pinia';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  user_id: string | null;
  email: string | null;
  role: Role | null;
  first_name: string | null;
  last_name: string | null;
  last_login: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  notes: string | null;
  isAuthenticated: boolean;
}

const defaultState = null;

export const useUserStore = defineStore('user', {
  state: (): User => ({
    user_id: null,
    email: null,
    role: null,
    first_name: null,
    last_name: null,
    last_login: null,
    created_at: null,
    updated_at: null,
    isAuthenticated: false,
  }),
  persist: true,
});
