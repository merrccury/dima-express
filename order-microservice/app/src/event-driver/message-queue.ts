import amqp from 'amqp-connection-manager';
import {ConfirmChannel} from "amqplib";
import ChannelWrapper from "amqp-connection-manager/dist/esm/ChannelWrapper";
import {IAmqpConnectionManager} from "amqp-connection-manager/dist/esm/AmqpConnectionManager";

export class MessageQueue {
    constructor() {
        this.connection = amqp.connect([`amqp://${process.env.rabbitmq}:${process.env.rabbitMQPort1}`])
        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: function (channel: ConfirmChannel) {
                return Promise.all([
                    channel.assertExchange("order-added", "fanout", {durable: false}),
                    channel.assertExchange("order-deleted", "fanout", {durable: false}),
                ])
            }
        });
    };

    private connection: IAmqpConnectionManager;
    private readonly channelWrapper: ChannelWrapper;


    public publish(exchange: string, message: any): Promise<boolean> {
        return this.channelWrapper.publish(exchange, '', message);
    }
}