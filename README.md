## springmore-core
* spring+ibatis实现读写分离
* 特点
无缝结合spring+ibatis，对于程序员来说，是透明的 
除了修改配置信息之外，程序的代码不需要修改任何东西
支持spring的容器事务

规则：
基于spring配置的容器事务
1.	读写事务到主库
2.	只读事务到从库
3.	如果没有配置事务，更新语句全部到主库，查询语句均衡到从库

* 快速入门
* maven依赖
``` xml
<dependency>
	<groupId>org.springmore</groupId>
	<artifactId>springmore-core</artifactId>
	<version>1.0.0</version>
</dependency>
```
dataSource配置(applicationContext.xml中)
``` xml
<?xml version="1.0" encoding="utf-8"?>
<beans 
	xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans 
		http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/context
		http://www.springframework.org/schema/context/spring-context-3.0.xsd
		">
	<!-- C3P0连接池配置 -->
	<bean id="master" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="driverClass">
			<value>com.mysql.jdbc.Driver</value>
		</property>
		<property name="jdbcUrl">
			<value>jdbc:mysql://192.168.1.246:3306/db1</value>
		</property>
		<property name="user">
			<value>ysb</value>
		</property>
		<property name="password">
			<value>ysb</value>
		</property>
		<property name="initialPoolSize">
			<value>20</value>
		</property>
		<property name="minPoolSize">
			<value>20</value>
		</property>
		<property name="maxPoolSize">
			<value>200</value>
		</property>
		<property name="maxIdleTime">
			<value>255000</value>
		</property>
	</bean>
	
	<bean id="dataSource2" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="driverClass">
			<value>com.mysql.jdbc.Driver</value>
		</property>
		<property name="jdbcUrl">
			<value>jdbc:mysql://192.168.1.246:3306/db2</value>
		</property>
		<property name="user">
			<value>ysb</value>
		</property>
		<property name="password">
			<value>ysb</value>
		</property>
		<property name="initialPoolSize">
			<value>20</value>
		</property>
		<property name="minPoolSize">
			<value>20</value>
		</property>
		<property name="maxPoolSize">
			<value>200</value>
		</property>
		<property name="maxIdleTime">
			<value>255000</value>
		</property>
	</bean>
	
	<bean id="dataSource3" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="driverClass">
			<value>com.mysql.jdbc.Driver</value>
		</property>
		<property name="jdbcUrl">
			<value>jdbc:mysql://192.168.1.246:3306/db3</value>
		</property>
		<property name="user">
			<value>ysb</value>
		</property>
		<property name="password">
			<value>ysb</value>
		</property>
		<property name="initialPoolSize">
			<value>20</value>
		</property>
		<property name="minPoolSize">
			<value>20</value>
		</property>
		<property name="maxPoolSize">
			<value>200</value>
		</property>
		<property name="maxIdleTime">
			<value>255000</value>
		</property>
	</bean>
	
	<bean id="dataSource" class="org.springmore.core.datasource.DynamicDataSource">
		<property name="master" ref="master" />		
		<property name="slaves">
			<list>
				<ref bean="dataSource2"/>
				<ref bean="dataSource3"/>
			</list>			
		</property>
	</bean>
</beans>
```

整合mybatis配置(applicationContext.xml中)
``` xml
	<!-- ibatis3 工厂类 -->
	<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
		<property name="dataSource" ref="dataSource" />
		<property name="configLocation" value="classpath:sqlMapConfig.xml" />
	</bean>
	<bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
		<constructor-arg index="0" ref="sqlSessionFactory" />
	</bean>
	
	<bean id="dynamicSqlSessionTemplate" class="org.springmore.core.datasource.DynamicSqlSessionTemplate">
		<constructor-arg index="0" ref="sqlSessionTemplate" />
	</bean>
```

事务配置(applicationContext.xml中)
``` xml
	<!-- 定义单个jdbc数据源的事务管理器 -->
	<bean id="transactionManager"
		class="org.springmore.core.datasource.DynamicDataSourceTransactionManager">
		<property name="dataSource" ref="dataSource" />
	</bean>
	<!-- 以 @Transactional 标注来定义事务  -->
	<tx:annotation-driven transaction-manager="transactionManager"
		proxy-target-class="true" />		
	
	<!-- 配置事务的传播特性 -->
	<tx:advice id="txAdvice" transaction-manager="transactionManager">
		<tx:attributes>
			<tx:method name="insert*" propagation="REQUIRED" read-only="false"
				rollback-for="Exception" />
			<tx:method name="delete*" propagation="REQUIRED" read-only="false"
				rollback-for="Exception" />
			<tx:method name="update*" propagation="REQUIRED" read-only="false"
				rollback-for="Exception" />
			<tx:method name="proc*" propagation="REQUIRED" read-only="false"
				rollback-for="Exception" />
			<tx:method name="select*" read-only="true" />
			<tx:method name="*" read-only="false" />
			<!-- <tx:method name="*" read-only="true" /> -->
		</tx:attributes>
	</tx:advice>
	<!-- 那些类的哪些方法参与事务 -->
	<aop:config>
		<aop:pointcut id="allManagerMethod" expression="execution(* org.springmore.core.dao..*(..))" />
		<aop:advisor pointcut-ref="allManagerMethod" advice-ref="txAdvice" />
	</aop:config>
```

dao代码示例：
``` java
@Repository("UserMapperImpl")
public class UserMapperImpl implements UserMapper{
	
	@Autowired
	private DynamicSqlSessionTemplate sqlSessionTemplate;

	//从库
	public List<User> selectByUserNameAndPwd(User user) {
		return sqlSessionTemplate.selectList("selectByUserNameAndPwd", user);
	}

	//主库
	public void insert(User user) {	
		sqlSessionTemplate.insert("insert", user);		
	}
}
```

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

* * * 

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


