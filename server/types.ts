import { JwtPayload } from "jsonwebtoken"
import { Document, Schema } from "mongoose"

export interface ValidateUserProps{
    firstName: string
    lastName: string
    email: string
    password: string
    role: ["student" | "lecturer" | "HOD"]
    departmentId: string
}
export interface ValidatePasswordProps{
    password: string
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "student" | "lecturer" | "HOD";
    indexNumber: string;
    department: Schema.Types.ObjectId;
    generateAuthToken: () => string;
  }

export interface TokenPayload extends JwtPayload{
    email: string
    id: string
}