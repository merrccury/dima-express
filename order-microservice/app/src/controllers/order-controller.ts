import {MessagePayload} from "seneca";
import {OrderInterface} from "../interfaces/order-interface";
import {OrderRepository} from "../models/order-repository";
import {MessageQueue} from "../event-driver/message-queue";

const messageQueue = new MessageQueue();


const orderRepository = new OrderRepository();

export async function addOrder(msg: MessagePayload<OrderInterface>, reply: (error: Error | null, msg?: any) => void) {
    const order: OrderInterface = {
        customerId: msg.customerId,
        orderName: msg.orderName,
    };
    try {
        const createdOrder = await orderRepository.save(order);
        messageQueue.publish("order-added", {
            message: "order-added",
            userId: msg.customerId,
            orderId: createdOrder.id
        });
        reply(null, {orderId: createdOrder.id})
    }
        // @ts-ignore
    catch (e: any) {
        reply(e);
    }
}

export async function getOrderCountByUser(msg: MessagePayload<{ id: string }>, reply: (error: Error | null, msg?: any) => void) {
    const count = await orderRepository.getOrderCountByUser(msg.id);
    reply(null, {
        orderCount: count,
        userId: msg.id
    });
}

export async function getListOfOrders(msg: MessagePayload<{ id: string }>, reply: (error: Error | null, msg?: any) => void) {
    const listOfOrders = await orderRepository.getListOfOrders(msg.id);
    const list = listOfOrders.map(order => {
        return {
            orderName: order.orderName,
            dateOfOrder: order.dateOfOrder,
            id: order.id
        }
    })
    reply(null, {listOfOrders: list})
}

export async function deleteOrder(msg: MessagePayload<{ orderId: string; userId: string }>, reply: (error: Error | null, msg?: any) => void) {
    try {
        const isExist = await orderRepository.isOrderExist(msg.orderId);
        if (!isExist) {
            return reply(null, {message: `Order with id ${msg.orderId} not exist`});
        }
        const delResponse = await orderRepository.deleteOrder(msg.orderId)
        messageQueue.publish("order-deleted", {
            message: "order-deleted",
            orderId: msg.orderId,
            userId: msg.userId
        });
        reply(null, {message: `Order ${msg.orderId} was deleted`})
    } catch (e) {
        return reply(null, {message: `Order with id ${msg.orderId} cannot be deleted`});
    }
}

