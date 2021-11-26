export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            userService: string;
            orderService: string;
            rabbitmq: string;
            userPort: string;
            orderPort: string;
            rabbitMQPort1: string;
            rabbitMQPort2: string;
            redis: string;
            redisPort: string;
            mongodb: string;
            mongoPort: string;
            getawayService:string;
            getawayPort: string;
            rounds:string;
        }
    }

    namespace Express{
        interface User {
            id: string;
        }
    }
}