package org.springmore.rpc.netty.pool;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;

import io.netty.channel.ChannelFuture;

/**
 * ChannelFuturePool
 * 
 * @author 唐延波
 * @date 2015年7月18日
 */
public class ChannelFuturePool extends Pool<ChannelFuture> {

	public ChannelFuturePool(final GenericObjectPoolConfig poolConfig, String host, int port) {

		super(poolConfig, new ChannelFutureFactory(host, port));
	}

	public ChannelFuturePool(String host, int port) {

		super(new GenericObjectPoolConfig(), new ChannelFutureFactory(host, port));
	}
}
