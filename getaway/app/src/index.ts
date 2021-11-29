import express from 'express'
import passportJWT from './security/passport-strategy'
import Seneca from "seneca";
import {logIn, signUp} from "./controllers/auth-controller";
import bodyParser from "body-parser";
import {addOrder, delOrder, gelAllOrders, getOrdersCount} from "./controllers/order-controller";
import {getProfile} from "./controllers/user-controller";

const userService = Seneca();
userService.client({
    host: process.env.userService,
    port: parseInt(process.env.userPort, 10)
});

const orderService = Seneca();
orderService.client({
    host: process.env.orderService,
    port: parseInt(process.env.orderPort, 10)
})


const app = express();
app.use(bodyParser.json());

app.post('/auth', logIn);
app.post('/signup', signUp);

app.use(passportJWT.initialize());
app.use(passportJWT.authenticate('jwt', {session: false}))

app.post('/orders', addOrder);
app.get('/profile', getProfile)
app.get('/orders', gelAllOrders);
app.delete('/orders/:orderId', delOrder)

app.listen({
    host: process.env.getawayService,
    port: parseInt(process.env.getawayPort, 10)
})