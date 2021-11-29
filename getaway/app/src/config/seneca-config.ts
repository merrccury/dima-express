import Seneca from "seneca";


const options: Seneca.Options = {
    log: {level: "none"}
}
const senecaOptions = {
    options,
    instances: [
        {
            host: process.env.userService,
            port: parseInt(process.env.userPort, 10),
            pin: 'service:user'
        },
        {
            host: process.env.orderService,
            port: parseInt(process.env.orderPort, 10),
            pin: 'service:order'
        }
    ]
}

const seneca = Seneca(senecaOptions.options);

senecaOptions.instances.forEach(instance => {
    seneca.client({
        host: instance.host,
        port: instance.port,
        pin: instance.pin
    })
})

export default seneca;