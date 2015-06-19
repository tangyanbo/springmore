package org.springmore.core.dao;

import java.util.List;

import org.springmore.core.domain.User;



public interface UserMapper {
	
	

	List<User> selectByUserNameAndPwd(User user);
	
	void insert(User user);
}
