package org.springmore.commons.security;

import org.springmore.commons.codec.Base64Util;

/**
 * <pre>
 * rsa 3des 相结合实现加密
 * 充分利用非对称加密的安全性以及对称加密的高效性
 * 密文格式：Base64(商户号)|Base64(RAS(3des秘钥))|Base64(3des(报文))
 * 其中rsa密钥可以是公钥,也可以是私钥
 * </pre>
 * @author 唐延波
 * @date 2015年7月15日
 */
public class RsaDesUtil {

	/**
	 * 3段报文解密
	 * 公钥解密
	 * 报文格式: Base64(商户号)|Base64(RAS(3des秘钥))|Base64(3des(报文))
	 * @param decryptData 
	 * @param base64RsaKey 公钥
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月15日
	 */
	public static String decryptByPublicKey(String decryptData,String base64RsaKey) throws Exception{
		String[] data = decryptData.split("\\|");
		String desKey = RSAUtil.decryptByPublicKey(data[1], base64RsaKey);
		byte[] desdata = Base64Util.decodeBase64(data[2]);		
		String result = DESedeUtil.decryptString(desdata, desKey.getBytes());
		return result;
	}
	
	/**
	 * 3段报文解密
	 * 公钥证书解密
	 * 报文格式: Base64(商户号)|Base64(RAS(3des秘钥))|Base64(3des(报文))
	 * @param decryptData 
	 * @param certPath 公钥证书路径
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月15日
	 */
	public static String decryptByPublicKeyCert(String decryptData,String certPath) throws Exception{
		String publicKey = RSA.getPublicKeyByCert(certPath);	
		return decryptByPublicKey(decryptData,publicKey);
	}
	
	/**
	 * 3段报文解密
	 * 私钥解密
	 * 报文格式: Base64(商户号)|Base64(RAS(3des秘钥))|Base64(3des(报文))
	 * @param decryptData 
	 * @param base64RsaKey 私钥
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月15日
	 */
	public static String decryptByPrivateKey(String decryptData,String base64RsaKey) throws Exception{
		String[] data = decryptData.split("\\|");
		String desKey = RSAUtil.decryptByPrivateKey(data[1], base64RsaKey);
		byte[] desdata = Base64Util.decodeBase64(data[2]);		
		String result = DESedeUtil.decryptString(desdata, desKey.getBytes());
		return result;
	}
	
	/**
	 * 3段报文解密
	 * 私钥证书解密
	 * 报文格式: Base64(商户号)|Base64(RAS(3des秘钥))|Base64(3des(报文))
	 * @param decryptData 
	 * @param certPath 私钥证书路径
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月15日
	 */
	public static String decryptByPrivateKeyCert(String decryptData,String certPath,String certPwd) throws Exception{
		String publicKey = RSA.getPrivateKeyByCert(certPath, certPwd);
		return decryptByPrivateKey(decryptData,publicKey);
	}
	
	
}
