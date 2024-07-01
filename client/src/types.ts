import { Dispatch, SetStateAction } from "react";

export interface LoginProps {
  indexNumber: string;
  password: string;
}

export interface ForgotPasswordProps {
  indexNumber: string;
}

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "lecturer" | "HOD";
  department: string;
  courses: string[];
}

export interface AuthContextProps {
  user: UserProps | null;
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  login: (url: string, body: BodyInit) => Promise<{message: string, error: boolean}>
  logout: () => Promise<{message: string, error: boolean}>
}
