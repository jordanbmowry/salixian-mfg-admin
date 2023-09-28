import { defineStore } from 'pinia';

export interface User {
  user_id: string | null;
  email: string | null;
  role: string | null;
  first_name: string | null;
  last_name: string | null;

  last_login: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
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
});
