## springmore-redis组件
* 封装jedis客户端
1. 使客户端调用更加简单
如：JedisTemplate负责对Jedis连接的获取与归还
2. 分布式redis改用一致性哈希算法

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




- - - 
## springmore-commons组件
* 这是一个工具类库 包含如下功能:

#### org.springmore.commons.codec:
* Base64.java Base64编码与解码

#### org.springmore.commons.io:
* ExcelUtil excel文件读写
* FileUtil 文件读写
* FTPUtil ftp操作
* ResourceUtil
* XMLUtil dom4j jaxb封装
* ImageUtil 图片缩放，切割封装

#### org.springmore.commons.lang
* ArrayUtil
* HexUtil 字符字节十六进制转换
* StringUtil
* DateUtil

#### org.springmore.commons.security
* DESedeUtil 3des加密
* DESUtil 单des加密
* Md5Util md5加密
* RSAUtil rsa加密

#### org.springmore.commons.web
* HttpClientUtil http https封装
* WebUtil servlet发送response信息封装，发送json字符串封装


