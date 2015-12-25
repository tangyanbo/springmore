package org.springmore.commons.security;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Map;

import javax.crypto.Cipher;

import org.junit.Test;
import org.springmore.commons.codec.Base64Util;

public class RSAUtilTest {

	@Test
	public void testDecryptByPrivateKeyStringString() {
		
		
	}

	@Test
	public void testEncryptByPublicKeyStringString() throws Exception {
		Map<String, Object> initKey = RSAUtil.initKey();
		RSAPublicKey pubKey = (RSAPublicKey) initKey.get(RSAUtil.PUBLIC_KEY);
		byte[] pubKeyByte = pubKey.getEncoded();
		
		
		long t11 = System.currentTimeMillis();
		Cipher pubKeyCipher = RSA.getPubKeyEncryptCipher(pubKeyByte);
		long t12 = System.currentTimeMillis();
		System.out.println("初始密钥时间"+(t12-t11)+"ms");
		long t1 = System.currentTimeMillis();
		byte[] data = RSA.doFinal("11111111111111111111111111111111".getBytes(),pubKeyCipher);
		long t2 = System.currentTimeMillis();
		System.out.println(Base64Util.encodeBase64String(data));
		System.out.println("加密字符串:11111111111111111111111111111111");
		System.out.println("加密时间"+(t2-t1)+"ms");
		
		//解密
		RSAPrivateKey priKey = (RSAPrivateKey) initKey.get(RSAUtil.PRIVATE_KEY);
		Cipher priKeyCipher = RSA.getPriKeyDecryptCipher(priKey.getEncoded());
		
		long t3 = System.currentTimeMillis();
		byte[] data2 = RSA.doFinal(data,priKeyCipher);
		long t4 = System.currentTimeMillis();
		System.out.println(new String(data2));
		System.out.println("解密时间"+(t4-t3)+"ms");
		
	}

}
