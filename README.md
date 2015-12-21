## 更新
1. 最新版:1.0.1-SNAPSHOT
2. 调整了项目结构
3. 调整了部分三方包的版本

## 概述
* 核心意义
 1. 提供一个项目框架：spring+mybatis+springMVC
 2. 提供最佳项目示例(工作中常见的功能)
 3. 封装一般工具类如FileUtil,DateUtil,StringUtil,FTPUtil等
 4. 封装复杂组件，如redis,mina,netty
 
  欢迎加入springmore讨论qq群：261502547 <br>
  
 
## springmore-core组件
#### spring+ibatis实现读写分离
* 特点
无缝结合spring+ibatis，对于程序员来说，是透明的 
除了修改配置信息之外，程序的代码不需要修改任何东西
支持spring的容器事务

* 规则:
 1. 基于spring配置的容器事务
 2. 读写事务到主库
 3. 只读事务到从库
 4. 如果没有配置事务，更新语句全部到主库，查询语句均衡到从库

* [springmore-core快速入门](文档/springmore-core.md)


## springmore-redis组件
* 封装jedis客户端
1. 使客户端调用更加简单
如：JedisTemplate负责对Jedis连接的获取与归还
2. 分布式JedisShardedTemplate改用一致性哈希算法存取
* [springmore-redis快速入门](文档/springmore-redis.md)

## springmore-rpc组件
* 封装mina客户端
* 实现mina的短连接通信，长连接同步通信，长连接异步通信
* [springmore-rpc快速入门](文档/springmore-rpc.md)

## 代码自动生成easycode
* 自动生成bean,dao,service,controller,jsp,js等代码
* 基于freemark模板,可修改
* [源码](https://github.com/tangyanbo/easycode)

## springmore-commons组件
这是一个工具类库 包含如下功能

* [springmore-commons快速入门](文档/springmore-commons/详细说明.md)
* [FTP+SFTP工具类封装-springmore让开发更简单](http://www.cnblogs.com/tangyanbo/p/4600105.html)

## HttpClientUtil

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
* JsonUtil 封装fastjson和jsonlib 二者可选其一，默认为fastjson

#### MapUtil 
百度地图 web api
