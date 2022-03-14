export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  userId: string;
  token: string;
  expiresIn: number;
}
