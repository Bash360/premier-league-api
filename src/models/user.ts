import { Schema, model } from 'mongoose';
import Iuser from '../typings/user';
import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';
require('dotenv/config');
import uniqueValidate from 'mongoose-unique-validator';
let secret: string;
let UserSchema = new Schema(
  {
    id: String,
    firstName: { type: String, required: true, trim: true, lowercase: true },
    lastName: { type: String, required: true, trim: true, lowercase: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
      trim: true,
      lowercase: true,
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, id: false },
);
UserSchema.pre('save', async function() {
  if (this.isNew) {
    this.id = uuid();
  }
});
if (process.env.SECRET) {
  secret = process.env.SECRET;
} else {
  console.log('environment variable secret not set');
  process.exit(1);
}
UserSchema.methods.generateToken = function(): string {
  const token: string = jwt.sign(
    { isAdmin: this.isAdmin, id: this.id },
    secret,
  );
  return token;
};
UserSchema.plugin(uniqueValidate, {
  message: 'Error, {VALUE} is already a registered account',
});
export default model<Iuser>('user', UserSchema);
