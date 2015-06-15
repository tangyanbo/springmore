
package org.springside.modules.nosql.redis;

import static org.assertj.core.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.mockito.Mockito;
import org.springmore.nosql.redis.JedisShardedTemplate;
import org.springmore.nosql.redis.JedisTemplate;
import org.springmore.nosql.redis.JedisTemplate.JedisAction;
import org.springmore.nosql.redis.JedisTemplate.JedisActionNoResult;
import org.springmore.nosql.redis.pool.JedisDirectPool;
import org.springmore.nosql.redis.pool.JedisPool;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPoolConfig;


public class JedisShardedTemplateTest {

	private JedisShardedTemplate jedisTemplate;


	@Before
	public void setup() {
		HostAndPort address1 = new HostAndPort("192.168.1.245",6380);
		HostAndPort address2 = new HostAndPort("192.168.1.246",6380);
		JedisPoolConfig config = new JedisPoolConfig();
		JedisPool jedisPool1 = new JedisDirectPool("pool1", address1, config);
		JedisPool jedisPool2 = new JedisDirectPool("pool2", address2, config);
		jedisTemplate = new JedisShardedTemplate(new JedisPool[] { jedisPool1, jedisPool2 });
	}

	@Test
	public void stringActions() {
		String key = "test.string.key";
		String notExistKey = key + "not.exist";
		String value = "123";

		// get/set
		jedisTemplate.set(key, value);
		assertThat(jedisTemplate.get(key)).isEqualTo(value);
		assertThat(jedisTemplate.get(notExistKey)).isNull();

		// setnx
		assertThat(jedisTemplate.setnx(key, value)).isFalse();
		assertThat(jedisTemplate.setnx(key + "nx", value)).isTrue();

		// incr/decr
		jedisTemplate.incr(key);
		assertThat(jedisTemplate.get(key)).isEqualTo("124");
		jedisTemplate.decr(key);
		assertThat(jedisTemplate.get(key)).isEqualTo("123");
	}

	@Test
	public void hashActions() {
		String key = "test.hash.key";
		String field1 = "aa";
		String field2 = "bb";
		String notExistField = field1 + "not.exist";
		String value1 = "123";
		String value2 = "456";

		// hget/hset
		jedisTemplate.hset(key, field1, value1);
		assertThat(jedisTemplate.hget(key, field1)).isEqualTo(value1);
		assertThat(jedisTemplate.hget(key, notExistField)).isNull();

		// hmget/hmset
		Map<String, String> map = new HashMap<String, String>();
		map.put(field1, value1);
		map.put(field2, value2);
		jedisTemplate.hmset(key, map);

		assertThat(jedisTemplate.hmget(key, new String[] { field1, field2 })).containsExactly(value1, value2);

		// hkeys
		assertThat(jedisTemplate.hkeys(key)).contains(field1, field2);

		// hdel
		assertThat(jedisTemplate.hdel(key, field1));
		assertThat(jedisTemplate.hget(key, field1)).isNull();
	}

	@Test
	public void listActions() {
		String key = "test.list.key";
		String value = "123";
		String value2 = "456";

		// push/pop single element
		jedisTemplate.lpush(key, value);
		assertThat(jedisTemplate.llen(key)).isEqualTo(1);
		assertThat(jedisTemplate.rpop(key)).isEqualTo(value);
		assertThat(jedisTemplate.rpop(key)).isNull();

		// push/pop two elements
		jedisTemplate.lpush(key, value);
		jedisTemplate.lpush(key, value2);
		assertThat(jedisTemplate.llen(key)).isEqualTo(2);
		assertThat(jedisTemplate.rpop(key)).isEqualTo(value);
		assertThat(jedisTemplate.rpop(key)).isEqualTo(value2);

		// remove elements
		jedisTemplate.lpush(key, value);
		jedisTemplate.lpush(key, value);
		jedisTemplate.lpush(key, value);
		assertThat(jedisTemplate.llen(key)).isEqualTo(3);
		assertThat(jedisTemplate.lremFirst(key, value)).isTrue();
		assertThat(jedisTemplate.llen(key)).isEqualTo(2);
		assertThat(jedisTemplate.lremAll(key, value)).isTrue();
		assertThat(jedisTemplate.llen(key)).isEqualTo(0);
		assertThat(jedisTemplate.lremAll(key, value)).isFalse();
	}

	@Test
	public void orderedSetActions() {
		String key = "test.orderedSet.key";
		String member = "abc";
		String member2 = "def";
		double score1 = 1;
		double score11 = 11;
		double score2 = 2;

		// zadd
		assertThat(jedisTemplate.zadd(key, score1, member)).isTrue();
		assertThat(jedisTemplate.zadd(key, score2, member2)).isTrue();

		// zcard
		assertThat(jedisTemplate.zcard(key)).isEqualTo(2);
		assertThat(jedisTemplate.zcard(key + "not.exist")).isEqualTo(0);

		// zrem
		assertThat(jedisTemplate.zrem(key, member2)).isTrue();
		assertThat(jedisTemplate.zcard(key)).isEqualTo(1);
		assertThat(jedisTemplate.zrem(key, member2 + "not.exist")).isFalse();

		// unique & zscore
		assertThat(jedisTemplate.zadd(key, score11, member)).isFalse();
		assertThat(jedisTemplate.zcard(key)).isEqualTo(1);
		assertThat(jedisTemplate.zscore(key, member)).isEqualTo(score11);
		assertThat(jedisTemplate.zscore(key, member + "not.exist")).isNull();
	}

	@Test
	public void execute() {

		final String key = "test.string.key";

		final String value = "123";

		jedisTemplate.execute(key, new JedisActionNoResult() {

			@Override
			public void action(Jedis jedis) {
				jedis.set(key, value);
			}
		});

		assertThat(jedisTemplate.get(key)).isEqualTo(value);

		String result = jedisTemplate.execute(key, new JedisAction<String>() {

			@Override
			public String action(Jedis jedis) {
				return jedis.get(key);
			}

		});

		assertThat(result).isEqualTo(value);
	}
}
