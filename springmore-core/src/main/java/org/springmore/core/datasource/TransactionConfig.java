package org.springmore.core.datasource;

/**
 * 事务配置
 * 
 * @author 唐延波
 * @date 2015-6-18
 */
public class TransactionConfig {

	/**
	 * 方法名称
	 */
	private String name;

	/**
	 * 事务传播
	 */
	private String propagation;

	/**
	 * 只读事务
	 */
	private boolean readOnly;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPropagation() {
		return propagation;
	}

	public void setPropagation(String propagation) {
		this.propagation = propagation;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

}
