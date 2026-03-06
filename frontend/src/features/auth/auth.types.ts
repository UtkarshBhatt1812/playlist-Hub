export interface AuthState {
  user: {
    id: string;
    name: string;
    isAuthenticated: boolean;
  } | null;
  loading: boolean;
}