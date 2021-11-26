import {Request, Response} from "express";
import Seneca from "seneca";
import {promisify} from "util";

const userService = Seneca({
    log: {level: "none"}
});

userService.client({
    host: process.env.userService,
    port: parseInt(process.env.userPort, 10)
});

const userActService = promisify(userService.act).bind(userService)

export async function getProfile(req: Request, res: Response) {
    if (req.user === undefined)
        return res.send({
            message: "User is not defined"
        })
    try {
        const result = await userActService({
            service: "user",
            cmd: "getProfile",
            id: req.user.id
        })
        res.send({profile: result});
    } catch (e) {
        res.send({
            message: 'Cannot get profile'
        })
    }
}