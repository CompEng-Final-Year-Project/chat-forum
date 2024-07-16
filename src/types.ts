export interface OnlineUsers{
  userId: string
  socketId: string
}
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
  courses: {_id: string, name: string}[];
  _id: string
}

export interface Message {
  text: string;
  sender: string;
  createdAt: Date;
}

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}

export interface UserChat{
  _id: string
  members: string[]
  messages: Message[]
  type: "direct" | "course"
  name?: string
}

export interface UserChatWithId {
  user: UserProps;
  chatId: string;
  messages: Message[];
}
export interface UserGroupChatWithId {
  users: UserProps[];
  chatId: string;
  messages: Message[];
  name: string;
}