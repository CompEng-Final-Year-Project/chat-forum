import mongoose, { Schema } from "mongoose";
import type { IChat } from "../types";

const chatSchema = new Schema<IChat>({
    members: [{type: Schema.Types.ObjectId, ref: 'User'} ],
    type: {type: String, enum: ["course", "program", "department", "direct"], required: true},
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    program: {type: Schema.Types.ObjectId, ref: 'Program'},
    department: {type: Schema.Types.ObjectId, ref: 'Department'},
    messages: [
        {
            sender: {type: Schema.Types.ObjectId, ref: 'User'},
            text: {type: String, required: true},
            createdAt: {type: Date, default: Date.now}
        }
    ]
})

const Chat = mongoose.model<IChat>('Chat', chatSchema)

export default Chat