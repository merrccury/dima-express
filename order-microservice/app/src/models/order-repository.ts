import {orderSchema} from './order-schema';
import mongoose, {HydratedDocument} from "mongoose";
import {OrderInterface} from "../interfaces/order-interface";
import {DeleteResult} from "mongodb";


(async () => {
    try {
        const uri = `mongodb://${process.env.mongodb}:${process.env.mongoPort}/order-microservice`;
        await mongoose.connect(uri)
    } catch (e) {
    }
})()

const Order = mongoose.model<OrderInterface>("Order", orderSchema);


interface OrderRepositoryInterface {
    save: { (order: OrderInterface): Promise<HydratedDocument<any, any, OrderInterface>> };
    getOrderCountByUser: { (userId: string): Promise<number> }
}

export class OrderRepository implements OrderRepositoryInterface {
    getOrderCountByUser(userId: string): Promise<number> {
        return Order.count({customerId: userId}).exec();
    }

    save(order: OrderInterface): Promise<HydratedDocument<any, any, OrderInterface>> {
        return Order.create(order);
    }

    getListOfOrders(userId: string): Promise<Array<OrderInterface>> {
        return Order.find({customerId: userId}).lean().exec();
    }

    isOrderExist(orderId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            Order.findById(orderId).exec()
                .then(item => {
                    resolve(item !== null)
                })
                .catch(error => reject(error))
        })
    }

    deleteOrder(orderId: string): Promise<DeleteResult> {
        return Order.deleteOne({id: orderId}).exec();
    }

}