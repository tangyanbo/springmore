/**
 * string 扩展
 * @author 唐延波
 * @date 2015-07-29
 * @version 1.1
 */
//=========================================================
/**
 * string封装
 * startWith
 */
String.prototype.startWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substr(0,str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
};

/**
 * string封装
 * endWith
 */
String.prototype.endWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substring(this.length-str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
};