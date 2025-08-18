import { createClient } from "redis"
import { promisify } from "util"

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

const expire = promisify(client.expire).bind(client)
const setAsync = promisify(client.set).bind(client)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        const isLocked = await setAsync(key, expireTime);
        console.log('result:::', isLocked)
        if (isLocked === 1) {
            // thao tac vs sku
            return key;
        } else {
            await Promise((resolve) => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async (keyLock) => {
    const delAsync = promisify(client.del).bind(client)
    return await delAsync(keyLock)
}

export const redisService = {
    acquireLock,
    releaseLock
}