import {userSchema} from "./user-schema";
import {UserInterface} from "../interfaces/user-interface";
import mongoose, {HydratedDocument} from "mongoose";

(async () => {
    try {
        const uri = `mongodb://${process.env.mongodb}:${process.env.mongoPort}/user-microservice`;
        await mongoose.connect(uri)
    } catch (e) {
    }
})()

const User = mongoose.model<UserInterface>("User", userSchema);

interface UserRepositoryInterface {
    save: { (user: UserInterface): Promise<HydratedDocument<any, any, UserInterface>> };
    userExist: { (email: string): Promise<boolean> };
    getPasswordAndIdByEmail: { (email: string): Promise<{ password: string; id:string } | null> };
    findUser: {(id: string): Promise<UserInterface>};
}

export class UserRepository implements UserRepositoryInterface {

    public save(user: UserInterface): Promise<HydratedDocument<any, any, UserInterface>> {
        return User.create(user);
    }

    public userExist(email: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            const count = await User.count({email: email});
            resolve(count > 0);
        })
    }

    public getPasswordAndIdByEmail(email: string): Promise<{ password: string; id: string } | null> {
        return new Promise<{ password: string; id: string } | null>(async (resolve) => {
            const userModel = await User.findOne({email: email}).exec();
            resolve(userModel?.password ? {
                password: userModel.password,
                id: userModel.id
            } : null);
        })
    }

    public async findUser(id:string): Promise<UserInterface>{
        return User.findById(id).lean();
    }

}