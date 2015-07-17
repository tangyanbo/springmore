package org.springmore.commons.security;

import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;

import org.springmore.commons.codec.Base64Util;
import org.springmore.commons.codec.Charsets;

/**
 * 3DES加密
 * DESede/ECB/PKCS5Padding
 * 加密算法理论参考:http://aub.iteye.com/blog/1131514
 * @author 唐延波
 * @date 2015-6-9
 */
public class DESedeUtil {
	 
	
	/**
	 * 密钥算法
	 */
	public static final String KEY_ALGORITHM = "DESede";
		
	/**
	 * 加密/解密算法/工作模式/填充方式
	 */	
	public static final String CIPHER_ALGORITHM = "DESede/ECB/PKCS5Padding";
		
	/**
	 * 转换密钥
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param key 二进制密钥
	 * @return
	 * @throws Exception
	 */
	private static Key toKey(byte[] key) throws Exception{
		//实例化DES密钥材料
		DESedeKeySpec dks = new DESedeKeySpec(key);
		//实例化秘密密钥工厂
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
		//生成秘密密钥
		return keyFactory.generateSecret(dks);
	}

	/**
	 * 解密
	 * @param data 待解密数据
	 * @param key 密钥
	 * @return byte[] 解密数据
	 * @author 唐延波
	 * @date 2015-6-9
	 */	
	public static byte[] decrypt(byte[] data, byte[] key)throws Exception{
		//还原密钥
		Key k = toKey(key);
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		//初始化，设置为解密模式
		cipher.init(Cipher.DECRYPT_MODE, k);
		//执行操作
		return cipher.doFinal(data);
	}
	
	/**
	 * 解密
	 * @param data 待解密数据
	 * @param key 密钥
	 * @return String 解密数据编码为UTF-8
	 * @author 唐延波
	 * @date 2015-6-9
	 */	
	public static String decryptString(byte[] data, byte[] key)throws Exception{
		byte[] decrypt = decrypt(data,key);
		return new String(decrypt,Charsets.UTF_8);
	}
	
	/**
	 * 加密
	 * @param data 待加密数据
	 * @param key 密钥
	 * @return byte[] 加密数据
	 * @author 唐延波
	 * @date 2015-6-9
	 */	
	public static byte[] encrypt(byte[] data, byte[] key) throws Exception{
		//还原密钥
		Key k = toKey(key);
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		//初始化，设置为解密模式
		cipher.init(Cipher.ENCRYPT_MODE, k);
		//执行操作
		return cipher.doFinal(data);
	}
	
	/**
	 * 加密
	 * @param data 待加密数据
	 * @param key 密钥
	 * @return byte[] 加密数据
	 * @author 唐延波
	 * @date 2015-6-9
	 */	
	public static byte[] encrypt(String data, byte[] key) throws Exception{
		byte[] dataByte = data.getBytes(Charsets.UTF_8);
		//还原密钥
		Key k = toKey(key);
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		//初始化，设置为解密模式
		cipher.init(Cipher.ENCRYPT_MODE, k);
		//执行操作
		return cipher.doFinal(dataByte);
	}
	
	/**
	 * 加密并base64编码
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月16日
	 */
	public static String encryptAndBase64(byte[] data, byte[] key) throws Exception{
		byte[] encrypt = encrypt(data,key);
		String base64String = Base64Util.encodeBase64String(encrypt);
		return base64String;
	}
	
	/**
	 * 加密并base64编码
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月16日
	 */
	public static String encryptAndBase64(String data, byte[] key) throws Exception{
		byte[] dataByte = data.getBytes(Charsets.UTF_8);
		String base64String = encryptAndBase64(dataByte,key);
		return base64String;
	}
	
	/**
	 * 生成密钥
	 * 
	 * @return byte[] 二进制密钥
	 */	
	public static byte[] generateKey() throws Exception{
		/**
		 * 实例化
		 * 使用128位或192位长度密钥
		 * KeyGenerator.getInstance(KEY_ALGORITHM,"BC");
		 */
		KeyGenerator kg = KeyGenerator.getInstance(KEY_ALGORITHM);
		//112 or 168
		kg.init(112);
		//生成秘密密钥
		SecretKey secretKey = kg.generateKey();
		//获得密钥的二进制编码形式
		return secretKey.getEncoded();
	}
	

	/**
	 * 生成随机3des密钥
	 * 32位
	 * @return
	 * @author 唐延波
	 * @date 2015年7月16日
	 */
	public static String generateMD5Key(){
		double ranNum = Math.random();
		int i = (int) (ranNum * 1000000);
		String key = Md5Util.md5Hex(String.valueOf(i));
		return key;
	}

	
}
