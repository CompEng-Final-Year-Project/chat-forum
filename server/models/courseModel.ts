import mongoose, { Schema } from "mongoose";
import { ICourse } from "../types";

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  lecturers: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
