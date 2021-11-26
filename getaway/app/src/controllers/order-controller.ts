import {Request, Response} from "express";
import Seneca from "seneca";
import {promisify} from "util";

const orderService = Seneca({
    log: {level: "none"}
});
orderService.client({
    host: process.env.orderService,
    port: parseInt(process.env.orderPort, 10)
});

const orderActService = promisify(orderService.act).bind(orderService)

export async function addOrder(req: Request, res: Response) {
    if (req.user === undefined)
        return res.send({
            message: "User is not defined"
        })

    const {orderName} = req.body;
    if (orderName === undefined) {
        return res.send({
            message: "Order name should be defined"
        });
    }
    try {
        const result = await orderActService({
            service: 'order',
            cmd: 'add',
            orderName: orderName,
            customerId: req.user.id
        })
        res.send(result)
    } catch (e) {
        res.send({
            message: "Order service Error"
        });
    }
}

export async function getOrdersCount(req: Request, res: Response) {
    if (req.user === undefined)
        return res.send({
            message: "User is not defined"
        })
    const {id} = req.user;
    try {
        const result = await orderActService({
            service: 'order',
            cmd: 'count',
            id: id
        });
        res.send(result)
    } catch (e) {
        res.send({
            message: "Cannot get count of orders"
        })
    }
}

export async function gelAllOrders(req: Request, res: Response) {
    if (req.user === undefined)
        return res.send({
            message: "User is not defined"
        })

    const {id} = req.user;

    try {
        const result: any = orderActService({
            service: 'order',
            cmd: 'all',
            id: id
        });
        res.send(result.listOfOrders)
    } catch (e) {
        res.send({
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
        res.send({message: error.message})
    }
}