import amqp from 'amqp-connection-manager';
import {ConfirmChannel, Message} from "amqplib";
import ChannelWrapper from "amqp-connection-manager/dist/esm/ChannelWrapper";
import {IAmqpConnectionManager} from "amqp-connection-manager/dist/esm/AmqpConnectionManager";

export class Rabbit {
    constructor( queueName: string = 'update-order-count') {
        this.queueName = queueName;
        this.connection = amqp.connect([`amqp://${process.env.rabbitmq}:${process.env.rabbitMQPort1}`])
        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: function (channel: ConfirmChannel) {
                return Promise.all([
                    channel.assertQueue(queueName, {durable: true}),
                    //channel.assertExchange('order-added', "fanout", {durable: false}),
                    //channel.assertExchange('order-deleted', "fanout", {durable: false}),
                    channel.bindQueue(queueName, 'order-added', ''),
                    channel.bindQueue(queueName, 'order-deleted', '')
                ])
            }
        });
    };

    private readonly queueName: string;
    private connection: IAmqpConnectionManager;
    private readonly channelWrapper: ChannelWrapper;


    public async consume(cb: { (msg: Message | null): void }) {
        this.channelWrapper.consume(this.queueName, cb)
    }
}