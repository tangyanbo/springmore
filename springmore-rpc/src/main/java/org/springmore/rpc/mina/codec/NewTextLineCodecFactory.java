package org.springmore.rpc.mina.codec;

import java.nio.charset.Charset;

import org.apache.mina.filter.codec.textline.LineDelimiter;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;

/**
 * 扩展TextLineCodecFactory
 * @author 唐延波
 * @date 2015-6-24
 */
public class NewTextLineCodecFactory extends TextLineCodecFactory{
	
	/**
     * Creates a new instance with the current default {@link Charset}.
     */
	public NewTextLineCodecFactory(){
		super();
	}

	/**
     * Creates a new instance with the specified {@link Charset}.  The
     * encoder uses a UNIX {@link LineDelimiter} and the decoder uses
     * the AUTO {@link LineDelimiter}.
     *
     * @param charset
     *  The charset to use in the encoding and decoding
     */
	public NewTextLineCodecFactory(String charset){
		super(Charset.forName(charset));
	}
	
	/**
     * Creates a new instance of TextLineCodecFactory.  This constructor
     * provides more flexibility for the developer.
     *
     * @param charset
     *  The charset to use in the encoding and decoding
     * @param encodingDelimiter
     *  The line delimeter for the encoder
     * @param decodingDelimiter
     *  The line delimeter for the decoder
     */
	public NewTextLineCodecFactory(String charset,String encodingDelimiter, String decodingDelimiter){
		super(Charset.forName(charset),encodingDelimiter,decodingDelimiter);
	}
	
}
