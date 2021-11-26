import Seneca from "seneca";

import {addOrder, getOrderCountByUser, getListOfOrders, deleteOrder} from "./controllers/order-controller";

const seneca = Seneca({
    log: {level: "none"}
});

seneca.add({service: 'order', cmd: 'add'}, addOrder);
seneca.add({service: 'order', cmd: 'count'}, getOrderCountByUser);
seneca.add({service: 'order', cmd: 'all'}, getListOfOrders);
seneca.add({service: 'order', cmd: 'delete'}, deleteOrder);


seneca.listen({
    host: process.env.orderService,
    port: parseInt(process.env.orderPort, 10)
})
