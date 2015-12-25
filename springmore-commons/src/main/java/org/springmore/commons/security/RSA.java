package org.springmore.commons.security;

import java.io.FileInputStream;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Enumeration;

import javax.crypto.Cipher;

import org.springmore.commons.codec.Base64Util;

/**
 * RSA核心工具类
 * 
 * @author 唐延波
 * @date 2015年12月25日
 */
public class RSA {

	public static final String KEY_ALGORITHM = "RSA";

	public static final String PUBLIC_KEY = "RSAPublicKey";

	public static final String PRIVATE_KEY = "RSAPrivateKey";

	public static final String RSA_model = "RSA/ECB/PKCS1Padding";
	
	/**
	 * 获取私钥对应的Cipher
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param key 私钥
	 * @param mode 
	 * Cipher.DECRYPT_MODE 解密
	 * Cipher.ENCRYPT_MODE 加密
	 * @return
	 * @throws Exception
	 */
	private static Cipher getPriKeyCipher(byte[] key,int mode) throws Exception{
		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(key);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		PrivateKey privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(mode, privateKey);
		return cipher;
	}
	
	/**
	 * 获取公钥对应的Cipher
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param key
	 * @param mode
	 * @return
	 * @throws Exception
	 */
	private static Cipher getPubKeyCipher(byte[] key,int mode) throws Exception{
		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(key);
		KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
		PublicKey publicKey = keyFactory.generatePublic(x509KeySpec);
		Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
		cipher.init(mode, publicKey);
		return cipher;
	}
	
	/**
	 * 获取私钥解密对应的Cipher
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static Cipher getPriKeyDecryptCipher(byte[] key) throws Exception{
		return getPriKeyCipher(key,Cipher.DECRYPT_MODE);
	}	
	
	/**
	 * 获取私钥加密对应的Cipher
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static Cipher getPriKeyEncryptCipher(byte[] key) throws Exception{
		return getPriKeyCipher(key,Cipher.ENCRYPT_MODE);
	}
	
	/**
	 * 获取公钥解密对应的Cipher
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param key
	 * @param mode
	 * @return
	 * @throws Exception
	 */
	public static Cipher getPubKeyDecryptCipher(byte[] key) throws Exception{
		return getPubKeyCipher(key,Cipher.DECRYPT_MODE);
	}
	
	/**
	 * 获取公钥加密对应的Cipher
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param key
	 * @param mode
	 * @return
	 * @throws Exception
	 */
	public static Cipher getPubKeyEncryptCipher(byte[] key) throws Exception{
		return getPubKeyCipher(key,Cipher.ENCRYPT_MODE);
	}
	
	/**
	 * 加密或者解密操作
	 * @author 金鹊
	 * @date 2015年12月25日
	 * @param cipher
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public static byte[] doFinal(byte[] data,Cipher cipher) throws Exception{
		return cipher.doFinal(data);
	}
	
	/**
	 * 获取公钥
	 * 
	 * @param certPath 公钥证书地址(.cer文件)
	 * @return base64密钥
	 * @throws Exception
	 */
	public static String getPublicKeyByCert(String certPath) throws Exception {
		CertificateFactory cff;
		try {
			cff = CertificateFactory.getInstance("X.509");
			FileInputStream fis = new FileInputStream(certPath);
			java.security.cert.Certificate certificate = cff
					.generateCertificate(fis);
			PublicKey publicKey = certificate.getPublicKey();
			fis.close();
			return Base64Util.encodeBase64String(publicKey.getEncoded());
		} catch (Exception e) {
			throw e;
		}

	}

	/**
	 * 获得私钥
	 * 
	 * @param certPath 证书地址(.pfx)
	 * @param password 证书密码
	 * @return base64密钥
	 * @throws Exception
	 */
	public static String getPrivateKeyByCert(String certPath, String password)
			throws Exception {
		KeyStore keyStore = KeyStore.getInstance("PKCS12");
		InputStream fis = new FileInputStream(certPath);
		keyStore.load(fis, password.toCharArray());
		Enumeration<String> aliases = keyStore.aliases();
		String alias = null;
		if (aliases.hasMoreElements()) {
			alias = aliases.nextElement();
		}
		PrivateKey privateKey = (PrivateKey) keyStore.getKey(alias,
				password.toCharArray());
		fis.close();
		return Base64Util.encodeBase64String(privateKey.getEncoded());
	}
}
