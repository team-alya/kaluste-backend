import memjs from 'memjs';
import { MEMCACHED_HOST, MEMCACHED_PORT } from './constants';

const mc = memjs.Client.create(`${MEMCACHED_HOST}:${MEMCACHED_PORT}`);

const cacheData = async (key: string, data: any) => {
    try {
        await mc.set(key, JSON.stringify(data), { expires: 60 * 60 * 24 }); // 24 hours
    } catch (error) {
        console.error('An error occurred while caching data:', error);
    }
}

const getData = async (key: string) => {
    try {
        const data = await mc.get(key);
        if (data.value) {
            return JSON.parse(data.value.toString());
        } else {
            return null;
        }
    } catch (error) {
        return { error: 'An error occurred while getting data' };
    }
}

export { cacheData, getData };