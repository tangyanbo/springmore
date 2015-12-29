package org.springmore.rpc.netty.pool;

import java.io.Closeable;

import org.apache.commons.pool2.PooledObjectFactory;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springmore.rpc.netty.exception.NettyHttpException;

/**
 * 资源连接池抽象类
 * 
 * @author 唐延波
 * @date 2015年7月18日
 * @param <T>
 */
public abstract class Pool<T> implements Closeable {

	protected GenericObjectPool<T> internalPool;

	@Override
	public void close() {
		destroy();
	}

	public boolean isClosed() {
		return this.internalPool.isClosed();
	}

	public Pool(final GenericObjectPoolConfig poolConfig, PooledObjectFactory<T> factory) {
		initPool(poolConfig, factory);
	}

	/**
	 * 初始化
	 * 
	 * @author 唐延波
	 * @date 2015年7月18日
	 * @param poolConfig
	 * @param factory
	 */
	private void initPool(final GenericObjectPoolConfig poolConfig, PooledObjectFactory<T> factory) {

		if (this.internalPool != null) {
			try {
				destroy();
			} catch (Exception e) {
			}
		}
		this.internalPool = new GenericObjectPool<T>(factory, poolConfig);
	}

	/**
	 * 获取资源
	 * 
	 * @author 唐延波
	 * @date 2015年7月18日
	 * @return
	 */
	public T getResource() {
		try {
			return internalPool.borrowObject();
		} catch (Exception e) {
			throw new NettyHttpException("Could not get a resource from the pool", e);
		}
	}

	public void returnBrokenResource(final T resource) {
		if (resource != null) {
			returnBrokenResourceObject(resource);
		}
	}

	/**
	 * 回收资源
	 * 
	 * @author 唐延波
	 * @date 2015年7月18日
	 * @param resource
	 */
	public void returnResource(final T resource) {
		if (resource == null) {
			return;
		}
		try {
			internalPool.returnObject(resource);
		} catch (Exception e) {
			throw new NettyHttpException("Could not return the resource to the pool", e);
		}
	}

	/**
	 * 销毁连接池
	 * 
	 * @author 唐延波
	 * @date 2015年7月18日
	 */
	public void destroy() {
		try {
			internalPool.close();
		} catch (Exception e) {
			throw new NettyHttpException("Could not destroy the pool", e);
		}
	}

	protected void returnBrokenResourceObject(final T resource) {
		try {
			internalPool.invalidateObject(resource);
		} catch (Exception e) {
			throw new NettyHttpException("Could not return the resource to the pool", e);
		}
	}

}
