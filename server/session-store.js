function getRedisSessionId(sid) {
    return `ssid:${sid}`
}

class RedisSessionStore {
    constructor(client) {
        this.client = client
    }

    // get session information in redis
    async get(sid) {
        const id = getRedisSessionId(sid)
        const data = await this.client.get(id)
        if (!data) {
            return null
        }
        try {
            const result = JSON.parse(data)
            return result
        } catch (err) {
            console.log('TCL: RedisSessionStore -> get -> err', err)
        }
    }

    // store session information to redis
    async set(sid, sess, ttl) {
        console.log('TCL: RedisSessionStore -> set', sid, sess, ttl)
        const id = getRedisSessionId(sid)

        if (typeof ttl === 'number') {
            ttl = Math.ceil(ttl / 1000)
        }
        try {
            const sessStr = JSON.stringify(sess)
            if (ttl) {
                await this.client.setex(id, ttl, sessStr)
            } else {
                await this.client.set(id, sessStr)
            }
        } catch (err) {}
    }

    //delete session form redis
    async destroy(sid) {
        console.log('TCL: RedisSessionStore -> destroy -> sid', sid)
        const id = getRedisSessionId(sid)
        try{
            await this.client.del(id)
        } catch (err) {
            console.log('TCL: RedisSessionStore -> del -> err', err)
        }
        
    }
}

module.exports = RedisSessionStore
