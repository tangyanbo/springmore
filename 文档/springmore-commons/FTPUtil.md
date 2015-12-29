#### FTPUtil
该工具基于org.apache.commons.net.ftp.FTPClient进行封装
###### ftp配置文件信息:
默认路径为classpath:ftpConfig.properties
配置信息如下：
``` xml
host=127.0.0.1
port=21
userName=admin
password=admin
```

###### 文件上传使用示例：
``` java
FTPUtil ftpUtil = new FTPUtil();	
//本地文件	
File local = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
//保存在服务端的文件名，如果不设置，将默认为本地文件名
ftpUtil.setRemote("upload.txt");
//保存在服务端的路径，如果不设置，将为用户登录之后的当前路径
ftpUtil.setRemotePath("/user/");
ftpUtil.setLocal(local);
ftpUtil.upload();

```

###### 文件下载使用示例：
``` java
FTPUtil ftpUtil = new FTPUtil();
//下载之后，保存到本地的文件
File file = new File("C:\\Users\\Administrator\\Desktop\\dowload.doc");
//服务端的文件名
ftpUtil.setRemote("upload.doc");
//服务端文件的路径，如果不设置，将为用户登录之后的当前路径
ftpUtil.setRemotePath("/user/");
ftpUtil.setLocal(file);
ftpUtil.download();

```

自定义设置ftp连接配置文件路径
``` java
//示例1
FTPUtil ftpUtil = new FTPUtil("ftpConfig.properties");
//示例2
Properties properties = PropertiesUtil.getProperties("ftpConfig.properties");
FTPUtil ftpUtil = new FTPUtil(properties);
```
