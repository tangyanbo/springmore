package org.springmore.commons.map;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.springmore.commons.web.HttpClientUtil;
import org.springmore.commons.web.JsonUtil;

/**
 * 百度地图API
 * 
 * @author 唐延波
 * @date 2014-4-28 下午3:40:34
 */
public class MapUtil {
	
	private static String MAP_URL = "http://api.map.baidu.com/geocoder/v2/?";

	private static String MAP_AK = "7yrVTmjDRf4ChhQhnQfwdBGL";

	
	
	/**
	 * 获取格式化地址
	 * @param longitude
	 * @param latitude
	 * @return
	 * @throws ClientProtocolException
	 * @throws IOException
	 * @author 唐延波
	 */
	public static String getFormatAddress(String longitude, String latitude) throws Exception{
		String address = "";
		address = getAddress(longitude,latitude).getFormatted_address();
		return address;
	}
	
	/**
	 * 根据经纬度获取城市地址
	 * @param longitude
	 * @param latitude
	 * @return
	 * @throws ClientProtocolException
	 * @throws IOException
	 * @author 唐延波
	 */
	public static String getCity(String longitude, String latitude) throws Exception{
		Address address = getAddress(longitude,latitude);
		return address.getAddressComponent().getCity();		
	}
	
	
	/**
	 * 根据地址获取经纬坐标
	 * @param address
	 * @return
	 * @author 唐延波
	 * @throws IOException 
	 * @throws ClientProtocolException 
	 */
	public static Location getLocation(String address){
		try {
			StringBuffer url = new StringBuffer();
			url.append(MAP_URL);
			url.append("ak=" + MAP_AK);
			url.append("&address=" + address);
			url.append("&output=json");
			HttpClientUtil httpUtil = new HttpClientUtil();
			String content = httpUtil.get(url.toString());
			System.out.println(content);
			AddressResult result = JsonUtil.toBean(content, AddressResult.class);
			if(result.getStatus()==0){
				return result.getResult().getLocation();
			}else{
				return null;
			}
		} catch (Exception e) {
			return null;
		}	
	}
	
	/**
	 * 根据经纬度获取地址
	 * 
	 * @param longitude
	 * @param latitude
	 * @return
	 * @author 唐延波
	 * @throws IOException
	 * @throws ClientProtocolException
	 */
	private static Address getAddress(String longitude, String latitude)
			throws Exception {
		StringBuffer url = new StringBuffer();
		url.append(MAP_URL);
		url.append("ak=" + MAP_AK);
		url.append("&location=" + latitude + "," + longitude);
		url.append("&output=json");
		url.append("&pois=0");
		HttpClientUtil httpUtil = new HttpClientUtil();
		String content = httpUtil.get(url.toString());
		AddressResult result = JsonUtil.toBean(content, AddressResult.class);
		return result.getResult();
	}	
	

	public static void main(String[] args) throws Exception{
		
		Location location = getLocation("上海浦东新区广兰路地铁站");
		System.out.println(location.getLat()+":"+location.getLng());
		String content = getAddress(location.getLng(),location.getLat()).getFormatted_address();
		System.out.println(content);
	}
}
