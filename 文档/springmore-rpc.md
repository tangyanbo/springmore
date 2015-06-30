## springmore-rpc组件
* 封装mina客户端
* 实现mina的短连接通信，长连接同步通信，长连接异步通信

###### 短连接传输字节
spring配置文件：
``` xml
<!-- 短连接工厂 -->
<bean id="shortConnectFactory" class="org.springmore.rpc.mina.client.sc.ShortConnectFactory">
	<property name="host">
		<value>localhost</value>
	</property>
	<property name="port">
		<value>18886</value>
	</property>
	<property name="connectTimeoutMillis">
		<value>30000</value>
	</property>
	<property name="readBufferSize">
		<value>2048*2048</value>
	</property>
	<!-- protocolCodecFactory不配置则是字节传输 -->
</bean>

<!-- minaTemplate -->
<bean id="minaTemplate" class="org.springmore.rpc.mina.client.MinaTemplate">
	<property name="connectFactory" ref="shortConnectFactory"></property>
</bean>
```
java代码调用示例
``` java
@Autowired
MinaTemplate minaTemplate;
@Test
public void 发送字节() throws InterruptedException {
	
	byte[] s = minaTemplate.sengObject("fff".getBytes());
	System.out.println(new String(s));
	System.out.println(s);

}
```

###### 短连接传输字符串
spring配置文件：
``` xml
<!-- 传输字符串编码工厂 -->
<bean id="textLineCodecFactory" class="org.springmore.rpc.mina.codec.NewTextLineCodecFactory">
	<constructor-arg index="0" value="UTF-8"></constructor-arg>
</bean>
<!-- 短连接工厂 -->
<bean id="shortConnectFactory" class="org.springmore.rpc.mina.client.sc.ShortConnectFactory">
	<property name="host">
		<value>localhost</value>
	</property>
	<property name="port">
		<value>18886</value>
	</property>
	<property name="connectTimeoutMillis">
		<value>30000</value>
	</property>
	<property name="readBufferSize">
		<value>2048*2048</value>
	</property>
	<!-- protocolCodecFactory不配置则是字节传输 -->
	<property name="protocolCodecFactory" ref="textLineCodecFactory"/>
</bean>

<!-- minaTemplate -->
<bean id="minaTemplate" class="org.springmore.rpc.mina.client.MinaTemplate">
	<property name="connectFactory" ref="shortConnectFactory"></property>
</bean>
```
java代码示例：
``` java
@Autowired
MinaTemplate minaTemplate;

@Test
public void 发送字符串() throws InterruptedException {
	
	String s = minaTemplate.sengObject("xxx");
	System.out.println(s);

}
```

