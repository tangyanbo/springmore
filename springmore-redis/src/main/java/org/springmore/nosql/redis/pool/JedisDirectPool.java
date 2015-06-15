package org.springmore.nosql.redis.pool;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisPoolConfig;

/**
 * 直连redis的pool
 * @author 唐延波
 * @date 2015-6-15
 */
public class JedisDirectPool extends JedisPool {

	
	public JedisDirectPool(String poolName, HostAndPort address, JedisPoolConfig config) {
		this(poolName, address, new ConnectionInfo(), config);
	}

	public JedisDirectPool(String poolName, HostAndPort address, ConnectionInfo connectionInfo, JedisPoolConfig config) {
		initInternalPool(address, connectionInfo, config);
		this.poolName = poolName;
	}
}
