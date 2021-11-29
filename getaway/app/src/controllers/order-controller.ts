import {Request, Response} from "express";
import orderService from '../config/seneca-config';
import {promisify} from "util";
import {logIn} from "./auth-controller";


const orderActService = promisify(orderService.act).bind(orderService)

export async function addOrder(req: Request, res: Response) {
    if (req.user === undefined)
        return res.status(401).send({
            message: "User is not defined"
        })

    const {orderName} = req.body;
    if (orderName === undefined) {
        return res.status(400).send({
            message: "Order name should be defined"
        });
    }
    try {
        const result = await orderActService({
            service: 'order',
            cmd: 'add',
            orderName,
            customerId: req.user.id
        })
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send({
            message: "Order service Error"
        });
    }
}

export async function getOrdersCount(req: Request, res: Response) {
    if (req.user === undefined)
        return res.status(401).send({
            message: "User is not defined"
        })
    const {id} = req.user;
    try {
        const result = await orderActService({
            service: 'order',
            cmd: 'count',
            id
        });
        res.send(result)
    } catch (e) {
        res.status(404).send({
            message: "Cannot get count of orders"
        })
    }
}

export async function gelAllOrders(req: Request, res: Response) {
    if (req.user === undefined)
        return res.status(401).send({
            message: "User is not defined"
        })

    const {id} = req.user;

    try {
        const result: any = await orderActService({
            service: 'order',
            cmd: 'all',
            id
        });
        res.send(result.listOfOrders)
    } catch (e) {
        res.status(404).send({
            message: "Cannot get count of orders"
        })
    }
}

export async function delOrder(req: Request, res: Response) {
    try {
        const result: any = await orderActService({
            service: 'order',
            cmd: 'delete',
            orderId: req.params.orderId,
            userId: req.user?.id
        });
        res.send({message: result.message})
    }
        // @ts-ignore
    catch (error: any) {
        res.status(500).send({message: error.message})
    }
}