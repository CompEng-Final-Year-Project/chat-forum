import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Joi, { object } from "joi";
import { IUser, ValidateUserProps } from "../types";

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  indexNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
    match: /^\d{10}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "lecturer", "HOD"],
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const jwtPrivateKey = process.env.JWTPrivateKey;

if (!jwtPrivateKey) {
  throw new Error("JWTPrivateKey environment variable not set");
}

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, jwtPrivateKey);
  return token;
};

export const User = mongoose.model('User', userSchema)

export const validateUser = (user: ValidateUserProps) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .required(),
      // .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      // .messages({
      //   "string.empty": "Password is required",
      //   "string.min": "Password must be at least {#limit} characters long",
      //   "string.pattern.base":
      //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
      // }),
      indexNumber: Joi.string().required().length(10)
  })
  return schema.validate(user)
};
