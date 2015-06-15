package org.springmore.commons.security;

import org.apache.commons.codec.binary.Base64;
import org.junit.Test;
import org.springmore.commons.lang.Hex;

public class DESUtilTest {

	/**
	 * 加密后的数据hex为dbeffec5df17927a
	 * 
	 * @param args
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015-6-9
	 */
	@Test
	public void testEncryptByteArrayByteArray() throws Exception {
		// byte[] key = initSecretKey();
		byte[] key = "12345678".getBytes("utf-8");
		System.out.println("key：" + showByteArray(key));
		System.out.println("key hex：" + Hex.encodeHexString(key));

		String data = "11111111"; // "DESxxx";
		System.out.println("加密前数据: string:" + data);
		System.out.println("加密前数据: byte[]:"
				+ showByteArray(data.getBytes("utf-8")));
		System.out.println("加密前数据: hex:"
				+ Hex.encodeHexString(data.getBytes("utf-8")));
		System.out.println();
		byte[] encryptData = DESUtil.encrypt(data.getBytes(), key);
		System.out.println("加密后数据: byte[]:" + showByteArray(encryptData));
		System.out.println("加密后数据: hexStr:" + Hex.encodeHexString(encryptData));

		String encodeBase64String = Base64.encodeBase64String(encryptData);
		System.out.println("加密后数据: base64:" + encodeBase64String);

		System.out.println();
		byte[] decryptData = DESUtil.decrypt(encryptData, key);
		System.out.println("解密后数据: byte[]:" + showByteArray(decryptData));
		System.out.println("解密后数据: string:" + new String(decryptData));
	}

	private static String showByteArray(byte[] data) {
		if (null == data) {
			return null;
		}
		StringBuilder sb = new StringBuilder("{");
		for (byte b : data) {
			sb.append(b).append(",");
		}
		sb.deleteCharAt(sb.length() - 1);
		sb.append("}");
		return sb.toString();
	}
}
