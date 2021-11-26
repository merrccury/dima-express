import { Request } from 'express';
import Jwt from "./jwt";
import {Strategy} from 'passport-jwt';
import passport from 'passport';



const headerExtractor = function (req: Request) {
    let token = req.header('Authorization');
    return token ? token : null;
}

const options = {
    jwtFromRequest: headerExtractor,
    secretOrKey: new Jwt().getSecretKey()
};


const jwtStrategy = new Strategy(options, (async (payload, done) => {
    return done(null, {
        id: payload.id
    });
}));

passport.use(jwtStrategy);

export default passport;