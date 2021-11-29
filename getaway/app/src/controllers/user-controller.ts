import {Request, Response} from "express";
import {promisify} from "util";
import userService from '../config/seneca-config';


const userActService = promisify(userService.act).bind(userService)

export async function getProfile(req: Request, res: Response) {
    if (req.user === undefined)
        return res.status(401).send({
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
        res.status(404).send({
            message: 'Cannot get profile'
        })
    }
}