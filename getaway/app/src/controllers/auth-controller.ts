import {Request, Response} from "express";
import Seneca from "seneca";
import {promisify} from 'util';
import Jwt from '../security/jwt';

const jwt = new Jwt();

const userService = Seneca({
    log: {level: "none"}
});

userService.client({
    host: process.env.userService,
    port: parseInt(process.env.userPort, 10)
});

const userActService = promisify(userService.act).bind(userService)


export async function logIn(req: Request, res: Response) {
    const {password, email} = req.body;
    if (password === undefined || email === undefined) {
        return res.send({
            message: 'Your credential are invalid. try again'
        })
    }

    try {
        const payload: any = await userActService({
            service: "user",
            cmd: "auth",
            password: password,
            email: email
        });
        const accessToken = jwt.createAccessToken({id: payload.id});
        res.send({accessToken: accessToken});
    } catch (e) {
        res.send({
            message: 'Your credential are invalid. try again'
        })
    }
}

export async function signUp(req: Request, res: Response) {
    const {firstName, lastName, password, email} = req.body;
    try {
        const result: any = await userActService({
            service: "user",
            cmd: "signup",
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        const accessToken = jwt.createAccessToken({id: result.id});
        res.send({accessToken: accessToken});

    }
    // @ts-ignore
    catch (e: any) {
        res.send({
            message: `User with Email = ${email} already exist`
        })
    }
}