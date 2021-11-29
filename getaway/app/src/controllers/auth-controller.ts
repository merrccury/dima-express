import {Request, Response} from "express";
import userService from '../config/seneca-config';
import {promisify} from 'util';
import Jwt from '../security/jwt';
const jwt = new Jwt();


const userActService = promisify(userService.act).bind(userService)

export async function logIn(req: Request, res: Response) {
    const {password, email} = req.body;
    if (password === undefined || email === undefined) {
        return res.status(400).send({
            message: 'Request parameters are incorrect'
        })
    }

    try {
        const payload: any = await userActService({
            service: "user",
            cmd: "auth",
            password,
            email
        });
        const accessToken = jwt.createAccessToken({id: payload.id});
        res.send({accessToken: accessToken});
    } catch (e) {
        res.status(401).send({
            message: 'Your credential are invalid. try again'
        })
    }
}

export async function signUp(req: Request, res: Response) {
    const {firstName, lastName, password, email} = req.body;
    if (firstName === undefined || lastName === undefined ||
        password === undefined || email === undefined) {
        return res.status(400).send({
            message: 'Request parameters are incorrect'
        })
    }
    try {
        const result: any = await userActService({
            service: "user",
            cmd: "signup",
            password,
            email,
            firstName,
            lastName
        });
        const accessToken = jwt.createAccessToken({id: result.id});
        res.send({accessToken: accessToken});

    }
        // @ts-ignore
    catch (e: any) {
        console.log(e);
        res.status(409).send({
            message: `User with Email = ${email} already exist`
        })
    }
}