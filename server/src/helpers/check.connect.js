import mongoose from "mongoose";
import os from "os";
import { env } from "~/configs/environment";
const _SECONDS = env.SECONDS_CHECK_CONNECT;
const process = require('process');

const countConnect = () => {
    const numberConnect = mongoose.connections.length;
    return numberConnect;
}

const checkOverload = () => {
    setInterval(() => {
        const numberConnect = countConnect();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        const maxConnect = numCores * 5;
        if (numberConnect > maxConnect) {
            console.log(`Connection overload! Number of connections: ${numberConnect}`);
        }
        console.log(`Number of connections: ${numberConnect}`);
        console.log(`Memory usage: ${memoryUsage} MB`);
    }, _SECONDS)
}

export {
    countConnect,
    checkOverload
}