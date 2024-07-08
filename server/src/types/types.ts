import { JwtPayload } from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";

export interface ValidateUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ["student" | "lecturer" | "HOD"];
  departmentId: string;
}
export interface ValidatePasswordProps {
  password: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "lecturer" | "HOD";
  indexNumber: string;
  department: { _id: Schema.Types.ObjectId; name: string };
  courses:  { _id: Schema.Types.ObjectId; name: string }[];
  generateAuthToken: () => string;
}

export interface TokenPayload extends JwtPayload {
  email: string;
  id: string;
}

export interface IFeed extends Document {
  author: mongoose.Schema.Types.ObjectId;
  text?: string;
  images?: string[];
  audio?: string;
  video?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat extends Document {
  members: Schema.Types.ObjectId[];
  type: "course" | "program" | "department" | "direct";
  courses?: Schema.Types.ObjectId[];
  program?: Schema.Types.ObjectId;
  department?: Schema.Types.ObjectId;
  messages: { sender: Schema.Types.ObjectId; text: string; createdAt: Date }[];
}

export interface IDepartment extends Document {
  name: string;
  head: Schema.Types.ObjectId;
  lecturers: Schema.Types.ObjectId[];
}

export interface IProgram extends Document {
  name: string;
  department: Schema.Types.ObjectId;
  courses: Schema.Types.ObjectId[];
}

export interface ICourse extends Document {
  name: string;
  code: string;
  department: Schema.Types.ObjectId;
  lecturers: Schema.Types.ObjectId[];
  students: Schema.Types.ObjectId[];
}
