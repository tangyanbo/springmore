#### FTPUtil
该工具基于com.jcraft.jsch.JSch进行封装
###### ftp配置文件信息:
默认路径为classpath:sftpConfig.properties
配置信息如下：
``` xml
host=192.168.1.226
port=22
userName=root
password=centos
```
###### 文件上传示例:
``` java
SFTPUtil sftp = new SFTPUtil();
//本地文件
File local = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
//保存在服务端的文件名，如果不设置，将默认为本地文件名
sftp.setLocal(local);
//保存在服务端的路径，如果不设置，将为用户登录之后的当前路径
sftp.setRemote("upload.txt");
sftp.uploadFile();
```
###### 文件下载示例:
``` java
SFTPUtil sftp = new SFTPUtil();
File local = new File("C:\\Users\\bypay\\Desktop\\download.java");
sftp.setLocal(local);
sftp.setRemote("upload.txt");
sftp.setRemotePath("/home/test");
sftp.download();
```
