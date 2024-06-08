import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type todDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true, minlength: 5 })
  title: string;

  @Prop()
  description: string;

  @Prop({ require: true })
  dueDate: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  User: User;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
