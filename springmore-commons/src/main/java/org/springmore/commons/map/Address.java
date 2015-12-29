package org.springmore.commons.map;

/**
 * 地址信息
 * @author 唐延波
 * @date 2014-4-28 下午6:20:06
 */
public class Address {

	private Location location;
	
	private String formatted_address;
	
	private AddressComponent addressComponent;
	
	private String cityCode;

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public String getFormatted_address() {
		return formatted_address;
	}

	public void setFormatted_address(String formatted_address) {
		this.formatted_address = formatted_address;
	}

	public AddressComponent getAddressComponent() {
		return addressComponent;
	}

	public void setAddressComponent(AddressComponent addressComponent) {
		this.addressComponent = addressComponent;
	}

	public String getCityCode() {
		return cityCode;
	}

	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}
	
	
}
