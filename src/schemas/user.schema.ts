import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;
  @Prop()
  profileImageUrl: string;
  @Prop()
  headline: string;
  @Prop()
  linkedinProfileUrl: string;
  @Prop({
    required: [true, "Email is required"],
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  })
  email: string;
  @Prop({
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"]
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
