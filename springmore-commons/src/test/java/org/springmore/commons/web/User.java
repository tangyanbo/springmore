package org.springmore.commons.web;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class User {

	private Long id;

	private String name;

	private Date date;

	private List<User> user = new ArrayList<User>();

	private Long count;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<User> getUser() {
		return user;
	}

	public void setUser(List<User> user) {
		this.user = user;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	@Override
	public String toString() {
		StringBuffer s = new StringBuffer();
		s.append("id:"+id);
		s.append("\n\r");
		s.append("name:"+name);
		s.append("\n\r");
		s.append("date:"+date);
		
		return s.toString();
	}

	public Long getCount() {
		return count;
	}

	public void setCount(Long count) {
		this.count = count;
	}

	
	
}
