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
  _id: string
}

export interface AuthContextProps {
  user: UserProps | null;
  users: UserProps[];
  setUser: Dispatch<SetStateAction<UserProps | null>>;
  login: (url: string, body: BodyInit) => Promise<{message: string, error: boolean}>
  logout: () => Promise<{message: string, error: boolean}>
}

export const loggedInUserData = {
  id: 5,
  avatar: '/LoggedInUser.jpg',
  name: 'Jakob Hoeg',
};


export interface Message {
  _id: string;
  message: string;
  senderId: string;
  createdAt: string;
}

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}