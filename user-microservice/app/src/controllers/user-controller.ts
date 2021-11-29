import Seneca, {MessagePayload} from "seneca";
import {Error} from "mongoose";
import {UserRepository} from "../models/user-repository";
import {promisify} from "util";
import {UserInterface} from "../interfaces/user-interface";
import redis from "redis";
import {MessageQueue} from "../event-driver/message-queue";

const orderService = Seneca();
orderService.client({
    host: process.env.orderService,
    port: parseInt(process.env.orderPort, 10)
});

const redisClient = redis.createClient({
    host: process.env.redis,
    port: parseInt(process.env.redisPort, 10)
});

const setCache = promisify(redisClient.set).bind(redisClient);
const getCache = promisify(redisClient.get).bind(redisClient);


const orderActService = promisify(orderService.act).bind(orderService)

const userRepository: UserRepository = new UserRepository();


export async function getProfile(msg: MessagePayload<{ id: string; }>, reply: (error: Error | null, msg?: any) => void) {

    let targetUser: UserInterface = await userRepository.findUser(msg.id);

    const cacheOrder: string | null = await getCache(`order_cache_${msg.id}`);
    let cache: { isCache: boolean; cache: any } = {
        isCache: true,
        cache: cacheOrder ? parseInt(cacheOrder, 10) : null
    };
    if (cache.cache === null) {
        const countOfOrders: any
            = await orderActService({
            service: 'order',
            cmd: 'count',
            id: msg.id
        });
        cache.cache = countOfOrders.orderCount;
        cache.isCache = false;
        await setCache(`order_cache_${msg.id}`, cache.cache.toString(10));
    }
    reply(null, {
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        countOfOrders: cache
    });
}

(async () => {
    const messageQueue = new MessageQueue();
    await messageQueue.consume((async msg => {
        if (msg === null)
            return;
        const targetOrder: {
            message: string;
            userId: string;
            orderId: string;
        } = JSON.parse(msg.content.toString())
        redisClient.del(`order_cache_${targetOrder.userId}`);
    }))
})()
