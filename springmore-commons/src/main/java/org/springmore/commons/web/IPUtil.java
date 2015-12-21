package org.springmore.commons.web;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

/**
 * ip获取工具类
 * @author 唐延波
 * @date 2015年12月21日
 */
public class IPUtil {

	/**
	 * 获取客户端真实ip
	 * @author 金鹊
	 * @date 2015年12月21日
	 * @return
	 */
    public static String getIP() {
        try {
            InetAddress thisIp = getFirstNonLoopbackAddress();
            return thisIp.getHostAddress();
        } catch (Exception e) {
            return "127.0.0.1";
        }
    }

    /**
     * 获取机器名称
     * @author 唐延波
     * @date 2015年12月21日
     * @return
     */
    public static String getMachineName() {
        try {
            InetAddress thisIp = getFirstNonLoopbackAddress();
            return thisIp.getHostName();
        } catch (Exception e) {
            return "hps";
        }
    }
    
    private static InetAddress getFirstNonLoopbackAddress() throws SocketException {
	    Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces();
	    while (en.hasMoreElements()) {
	        NetworkInterface i = (NetworkInterface) en.nextElement();
	        for (Enumeration<InetAddress> en2 = i.getInetAddresses(); en2.hasMoreElements();) {
	            InetAddress addr = (InetAddress) en2.nextElement();
	            if (!addr.isLoopbackAddress() ) {
	                if (addr instanceof Inet4Address) {
	                    return addr;
	                }
	            }
	        }
	    }
	    return null;
	}
    
	public static void main(String args[]){
		System.out.println(getIP());
		System.out.println(getMachineName());
	}
}