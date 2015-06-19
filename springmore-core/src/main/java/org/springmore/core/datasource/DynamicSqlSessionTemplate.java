package org.springmore.core.datasource;

import static java.lang.reflect.Proxy.newProxyInstance;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.executor.BatchResult;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * 动态代理SqlSessionTemplate
 * 在执行SqlSessionTemplate操作数据库方法之前，根据方法名
 * 动态判断是发往主库还是从库 
 * 如果方法是在spring的事务中，则跳过此环节
 * @author 唐延波
 * @date 2015-6-18
 */
public class DynamicSqlSessionTemplate implements SqlSession {
	
	private static final String SELECT = "select";
	
	private static final String INSERT = "insert";
	
	private static final String DELETE = "delete";
	
	private static final String UPDATE = "update";

	private SqlSessionTemplate sqlSessionTemplate;

	private final SqlSession sqlSessionProxy;
	
	

	public DynamicSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
		this.sqlSessionTemplate = sqlSessionTemplate;
		this.sqlSessionProxy = (SqlSession) newProxyInstance(
				SqlSessionFactory.class.getClassLoader(),
				new Class[] { SqlSession.class }, new SqlSessionInterceptor());
	}

	/**
	 * 方法拦截
	 * 此处是拦截SqlSessionTemplate的方法
	 * 进行读写分离
	 * @author 唐延波
	 * @date 2015-6-18
	 */
	private class SqlSessionInterceptor implements InvocationHandler {
		public Object invoke(Object proxy, Method method, Object[] args)
				throws Throwable {
			try {
				boolean synchronizationActive = TransactionSynchronizationManager.isSynchronizationActive();
				if(synchronizationActive){
					//在spring的事务中，不做任何处理
					//do nothing
					return method.invoke(sqlSessionTemplate, args);
				}else{
					String methodName = method.getName();
					if(methodName.startsWith(SELECT)){
						//获取读集群的数据源
						DataSourceHolder.setSlave();
					}else if(methodName.startsWith(INSERT)||
							methodName.startsWith(UPDATE)||
							methodName.startsWith(DELETE)){
						//获取主库数据源
						DataSourceHolder.setMaster();
					}
					Object result = method.invoke(sqlSessionTemplate, args);	
					//清理工作
					DataSourceHolder.clearDataSource();
					return result;
				}				
			} catch (Exception e) {
				throw e;
			}
		}
	}

	public <T> T selectOne(String statement) {
		return sqlSessionProxy.selectOne(statement);
	}

	public <T> T selectOne(String statement, Object parameter) {
		return sqlSessionProxy.selectOne(statement, parameter);
	}

	public <E> List<E> selectList(String statement) {
		return sqlSessionProxy.selectList(statement);
	}

	public <E> List<E> selectList(String statement, Object parameter) {
		return sqlSessionProxy.selectList(statement, parameter);
	}

	public <E> List<E> selectList(String statement, Object parameter,
			RowBounds rowBounds) {
		return sqlSessionProxy.selectList(statement, parameter, rowBounds);
	}

	public <K, V> Map<K, V> selectMap(String statement, String mapKey) {
		return sqlSessionProxy.selectMap(statement, mapKey);
	}

	public <K, V> Map<K, V> selectMap(String statement, Object parameter,
			String mapKey) {
		return sqlSessionProxy.selectMap(statement, parameter, mapKey);
	}

	public <K, V> Map<K, V> selectMap(String statement, Object parameter,
			String mapKey, RowBounds rowBounds) {
		return sqlSessionProxy.selectMap(statement, parameter, mapKey, rowBounds);
	}

	public void select(String statement, Object parameter, ResultHandler handler) {
		sqlSessionProxy.select(statement, parameter, handler);		
	}

	public void select(String statement, ResultHandler handler) {
		sqlSessionProxy.select(statement, handler);
	}

	public void select(String statement, Object parameter, RowBounds rowBounds,
			ResultHandler handler) {
		sqlSessionProxy.select(statement, parameter, rowBounds, handler);
	}

	public int insert(String statement) {
		return sqlSessionProxy.insert(statement);
	}

	public int insert(String statement, Object parameter) {
		return sqlSessionProxy.insert(statement, parameter);
	}

	public int update(String statement) {
		return sqlSessionProxy.update(statement);
	}

	public int update(String statement, Object parameter) {
		return sqlSessionProxy.update(statement, parameter);
	}

	public int delete(String statement) {
		return sqlSessionProxy.delete(statement);
	}

	public int delete(String statement, Object parameter) {
		return sqlSessionProxy.delete(statement, parameter);
	}

	public void commit() {
		sqlSessionProxy.commit();
	}

	public void commit(boolean force) {
		sqlSessionProxy.commit(force);
	}

	public void rollback() {
		sqlSessionProxy.rollback();
	}

	public void rollback(boolean force) {
		sqlSessionProxy.rollback(force);
	}

	public List<BatchResult> flushStatements() {
		return sqlSessionProxy.flushStatements();
	}

	public void close() {
		sqlSessionProxy.close();
	}

	public void clearCache() {
		sqlSessionProxy.clearCache();
	}

	public Configuration getConfiguration() {
		return sqlSessionProxy.getConfiguration();
	}

	public <T> T getMapper(Class<T> type) {
		return sqlSessionProxy.getMapper(type);
	}

	public Connection getConnection() {
		return sqlSessionProxy.getConnection();
	}

}
