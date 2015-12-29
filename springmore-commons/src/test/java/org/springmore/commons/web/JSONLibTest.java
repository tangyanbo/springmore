package org.springmore.commons.web;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;

public class JSONLibTest {
	
	User user;
	
	Map<String,User> map;
	
	User[] array;
	
	List<User> users = new ArrayList<User>();
	
	Set<User> userSet = new HashSet<User>();
	
	JsonLib jsonlib = new JsonLib();
	
	@Before
	public void before(){
		user = new User();
		user.setId(1l);
		user.setName("xxx");
		user.setDate(new Date());
		map = new HashMap<String,User>();
		array = new User[3];
		for(int i=0;i<3;i++){
			User user2 = new User();
			user2.setId(new Long(i));
			user2.setName("xxx");
			user2.setDate(new Date());
			user.getUser().add(user2);
			map.put(String.valueOf(i), user2);
			array[i] = user2;
			users.add(user2);
			userSet.add(user2);
		}
	}

	@Test
	public void 对象ToJson() {
		String objectToJson = jsonlib.toJSONString(user);
		System.out.println(objectToJson);
	}
	
	@Test
	public void mapToJson() {
		String objectToJson = jsonlib.toJSONString(map);
		System.out.println(objectToJson);
	}
	
	@Test
	public void arrayToJson() {
		String objectToJson = jsonlib.toJSONString(array);
		System.out.println(objectToJson);
	}
	
	@Test
	public void listToJson() {
		String objectToJson = jsonlib.toJSONString(users);
		System.out.println(objectToJson);
	}
	
	@Test
	public void setToJson() {
		String objectToJson = jsonlib.toJSONString(userSet);
		System.out.println(objectToJson);
		
	}
	
	@Test
	public void toObject(){
		String str = "{\"date\":\"2015-07-06 12:06:47\",\"id\":1,\"name\":\"xxx\",\"user\":[]}";
		User object = jsonlib.toBean(str, User.class);
		System.out.println(object);
	}
	
}
