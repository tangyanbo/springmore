package org.springmore.commons.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.ConnectException;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.springmore.commons.exception.CommonsException;
import org.springmore.commons.lang.StringUtil;

/**
 * ftp工具类
 * 
 * @author 唐延波
 * @date 2015-6-10
 */
public class FTPUtil {
	
	/**
	 * 默认端口
	 */
	private final static int DEFAULT_PORT = 21;
	
	private final static String HOST = "host";
	
	private final static String PORT = "port";
	
	private final static String USER_NAME = "userName";
	
	private final static String PASSWORD = "password";
	
	/**
	 * 默认配置文件路径
	 */
	private final static String FTP_CONFIG_PATH = "ftpConfig.properties";

	/**
	 * ftpClient
	 */
	private FTPClient ftpClient;
	
	/**
	 * 服务端保存的文件名
	 */
	private String remote;
	
	/**
	 * 服务端保存的路径
	 */
	private String remotePath;
	
	/**
	 * 本地文件
	 */
	private File local;
	
	/**
	 * 主机地址
	 */
	private String host;

	/**
	 * 端口
	 */
	private int port = DEFAULT_PORT;

	/**
	 * 登录名
	 */
	private String userName;

	/**
	 * 登录密码
	 */
	private String password;
	
	private static final Map<String,String> replyCodeMap;
	
	static{
		replyCodeMap = new HashMap<String,String>();
		replyCodeMap.put("530", "登录错误");
		replyCodeMap.put("550", "权限不足");		
	}
	
	public interface FTPAction {
		boolean action(FTPClient ftpClient) throws Exception;
	}
	
	public void execute(FTPAction ftpAction){
		try {
			boolean success = ftpAction.action(ftpClient);
			if(!success){
				int replyCode = ftpClient.getReplyCode();
				String reply = ftpClient.getReplyString();
				if (!FTPReply.isPositiveCompletion(replyCode)) {					
					throw new CommonsException(reply);
				}				
			}
		} catch (ConnectException e) {
			throw new CommonsException("连接到服务器"+host+":"+port+"失败,"+e.getMessage());		
		} catch(Exception e){
			throw new CommonsException(e);
		}
	}

	/**
	 * <pre>
	 * 默认读取classpath:ftpconfig.propertis
	 * 的信息
	 * 用户自行配置
	 * host:host
	 * port:port
	 * userName:userName
	 * password:password
	 * </pre>
	 */
	public FTPUtil() {
		this.init(FTP_CONFIG_PATH);
	}
	
	public FTPUtil(String host, int port, String userName, String password){
		this.init(host, port, userName, password);
	}
	
	public FTPUtil(Properties prop){		
		this.init(prop);
	}
	
	/**
	 * 
	 * @param configPath classpath路径
	 */
	public FTPUtil(String configPath){
		this.init(configPath);
	}
	
	/**
	 * 初始化
	 * @param prop
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	private void init(Properties prop){
		init(prop.getProperty(HOST),
				Integer.parseInt(prop.getProperty(PORT)),
				prop.getProperty(USER_NAME),
				prop.getProperty(PASSWORD));
	}
	
	/**
	 * 初始化
	 * @param host
	 * @param port
	 * @param userName
	 * @param password
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	private void init(String host, int port, String userName, String password){
		this.host = host;
		this.port = port;
		this.userName = userName;
		this.password = password;
	}
	
	private void init(String configPath){
		this.init(PropertiesUtil.getProperties(configPath));
	}
	
	/**
	 * 连接ftp
	 * @param ftpClient
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	private void ftpConnect(){
		execute(new FTPAction(){
			@Override
			public boolean action(FTPClient ftpClient) throws Exception {
				ftpClient.connect(host, port);
				return true;
			}			
		});
	}
	
	/**
	 * 登录
	 * @param ftpClient
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	private void ftpLogin(){
		execute(new FTPAction(){
			@Override
			public boolean action(FTPClient ftpClient) throws Exception{
				return ftpClient.login(userName, password);
			}			
		});
	}
	
	private void ftpSetFileType(){
		execute(new FTPAction(){
			@Override
			public boolean action(FTPClient ftpClient) throws Exception{
				return ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
			}			
		});
	}
	
	private void ftpChangeWorkingDirectory(){
		execute(new FTPAction(){
			@Override
			public boolean action(FTPClient ftpClient) throws Exception{
				return ftpClient.changeWorkingDirectory(remotePath);
			}			
		});
	}
	
	private void ftpRetrieveFile(final FileOutputStream output){
		execute(new FTPAction(){
			@Override
			public boolean action(FTPClient ftpClient) throws Exception{
				return ftpClient.retrieveFile(remote, output);		
			}			
		});
	}
	
	private void ftpStoreFile(final FileInputStream fis){
		execute(new FTPAction(){
			@Override
			public boolean action(FTPClient ftpClient) throws Exception{
				return ftpClient.storeFile(remote, fis);		
			}			
		});
	}

	/**
	 * 连接ftp服务器
	 * @param host 主机ip或域名
	 * @param port 端口
	 * @param username 登录用户名
	 * @param password 登录密码
	 * @throws Exception
	 * @author 唐延波
	 * @throws IOException 
	 * @throws SocketException 
	 * @date 2015-6-10
	 */
	private void connect() throws SocketException, IOException {
		validateConnectInfo();
		ftpClient = new FTPClient();
		ftpConnect();
		ftpLogin();
		ftpSetFileType();
	}
	
	/**
	 * 验证连接信息
	 * 
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	private void validateConnectInfo(){
		if(StringUtil.isEmpty(host)){
			throw new CommonsException("host不能为空");
		}
		if(StringUtil.isEmpty(userName)){
			throw new CommonsException("userName不能为空");
		}
		if(StringUtil.isEmpty(password)){
			throw new CommonsException("password不能为空");
		}
	}
	
	/**
	 * 断开连接
	 * 
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	private void disconnect() {
		try {
			ftpClient.disconnect();
		} catch (Exception e) {
			throw new CommonsException(e);
		}
	}		
	
	
	
	/**
	 * 下载文件
	 * 
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	public void download(){
		FileOutputStream output = null;
		try {
			this.connect();
			if(!StringUtil.isEmpty(remotePath)){
				ftpChangeWorkingDirectory();
			}
			output = new FileOutputStream(local);			
			ftpRetrieveFile(output);
			output.flush();
		} catch (Exception e) {
			throw new CommonsException(e);
		}finally{
			ResourceUtil.close(output);
			this.disconnect();
		}
	}
	
	/**
	 * 上传文件
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public void upload() {
		FileInputStream fis = null;
		try {
			this.connect();
			fis = new FileInputStream(local);
			if(!StringUtil.isEmpty(remotePath)){
				ftpChangeWorkingDirectory();
			}		
			if(StringUtil.isEmpty(remote)){
				remote = local.getName();
			}
			ftpStoreFile(fis);			
		} catch (Exception e) {
			throw new CommonsException(e);
		}finally{
			this.disconnect();
			ResourceUtil.close(fis);
		}
	}

	/**
	 * 服务端保存的路径
	 * 如果不设置此值，将会默认为用户登录之后的路径
	 * @param remotePath
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	public void setRemotePath(String remotePath) {
		this.remotePath = remotePath;
	}

	/**
	 * 服务端保存的文件名
	 * 如果不设置此值，将会默认为本地文件的文件名
	 * @param remote
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	public void setRemote(String remote) {
		this.remote = remote;
	}

	/**
	 * 本地文件
	 * @param local
	 * @author 唐延波
	 * @date 2015-6-23
	 */
	public void setLocal(File local) {
		this.local = local;
	}

	
	
}
