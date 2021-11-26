import Seneca from "seneca";
import {auth, signUp} from "./controllers/auth-controller";
import {getProfile} from "./controllers/user-controller";

const seneca = Seneca({
    log: {level: "none"}
});

seneca.add({service: 'user', cmd: 'signup'}, signUp);
seneca.add({service: 'user', cmd: 'auth'}, auth);
seneca.add({service: 'user', cmd: 'getProfile'}, getProfile);


seneca.listen({
    host: process.env.userService,
    port: parseInt(process.env.userPort, 10)
})
