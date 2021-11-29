import {MessagePayload,} from "seneca";
import {UserInterface} from "../interfaces/user-interface";
import bcrypt from "bcrypt";
import {UserRepository} from "../models/user-repository";


const userRepository: UserRepository = new UserRepository();
const rounds: number = parseInt(process.env.rounds, 10);

export async function signUp(msg: MessagePayload<UserInterface>, reply: (error: Error | null, msg?: any) => void) {
    const user: UserInterface = {
        firstName: msg.firstName,
        lastName: msg.lastName,
        password: msg.password,
        email: msg.email
    };

    console.log(user);

    const salt = await bcrypt.genSalt(rounds)

    user.password = await bcrypt.hash(Buffer.from(user.password), salt);
    try {
        const userExist = await userRepository.userExist(user.email);
        if (userExist) {
            throw new Error(`User with email = ${user.email} already exist`)
        }

        const createdUser = await userRepository.save(user);
        reply(null, {id: createdUser.id})

    } catch (e) {
        reply(new Error(`User_ with email = ${user.email} already exist`))
    }
}

export async function auth(msg: MessagePayload<{ password: string; email: string; }>, reply: (error: Error | null, msg?: any) => void) {
    let credential = await userRepository.getPasswordAndIdByEmail(msg.email);
    if (credential === null) {
        return reply(Error("Incorrect password or email"));
    }
    const {password, id} = credential;
    const check = await bcrypt.compare(Buffer.from(msg.password), password)
    if (!check) {
        return reply(Error("Incorrect password or email"));
    }
    reply(null, {id: id})
}

