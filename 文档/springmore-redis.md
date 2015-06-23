## springmore-redis组件
* 封装jedis客户端
1. 使客户端调用更加简单
如：JedisTemplate负责对Jedis连接的获取与归还
2. 分布式JedisShardedTemplate改用一致性哈希算法存取

JedisTemplate代码示例(用于非分布式部署的redis)
初始化jedisTemplate，客户端可以将该部分代码封装到工厂类中
```java
HostAndPort address = new HostAndPort("192.168.1.245",6380);
JedisPoolConfig config = new JedisPoolConfig();
JedisPool jedisPool = new JedisDirectPool("pool", address, config);
jedisTemplate = new JedisTemplate(jedisPool);
```
调用方法：JedisTemplate负责对Jedis连接的获取与归还
```java
jedisTemplate.set("key", "value");
```

JedisShardedTemplate代码示例(用于分布式部署的redis)
初始化JedisShardedTemplate
```java
HostAndPort address1 = new HostAndPort("192.168.1.245",6380);
HostAndPort address2 = new HostAndPort("192.168.1.246",6380);
JedisPoolConfig config = new JedisPoolConfig();
JedisPool jedisPool1 = new JedisDirectPool("pool1", address1, config);
JedisPool jedisPool2 = new JedisDirectPool("pool2", address2, config);
jedisTemplate = new JedisShardedTemplate(new JedisPool[] { jedisPool1, jedisPool2 });
```

调用方法
```java
jedisTemplate.set("key", "value");
```
