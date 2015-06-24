package org.springmore.core.dao.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springmore.core.dao.UserMapper;
import org.springmore.core.datasource.DynamicSqlSessionTemplate;
import org.springmore.core.domain.User;


@Repository("UserMapperImpl")
public class UserMapperImpl implements UserMapper{
	
	@Autowired
	private DynamicSqlSessionTemplate sqlSessionTemplate;

	public List<User> selectByUserNameAndPwd(User user) {
		return sqlSessionTemplate.selectList("selectByUserNameAndPwd", user);
	}

	public void insert(User user) {	
		sqlSessionTemplate.insert("insert", user);
		//Connection connection1 = sqlSessionTemplate.getConnection();
		//Connection connection2 = sqlSessionTemplate.getConnection();
		
	}

}
