import mongoose from "mongoose";
import {UserInterface} from "../interfaces/user-interface";

export const userSchema = new mongoose.Schema<UserInterface>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});
