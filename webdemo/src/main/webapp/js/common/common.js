/***
 * 传递第一个为页面元素班级select元素id
 * 第二个为年级编号
 * @param classId
 * @param gradeId
 */
function selectClassByGradeId(classId,gradeId,url){
	$("#"+classId+"").empty();
	if(gradeId===""){
		$("#"+classId+"").html("<option value=''>--班级--</option>");
		return;
	}else{
		$("#"+classId+"").html("<option value=''>--班级--</option>");
	}
	$.ajax({
		url : (url==null?"common/findClassByGrideId.action":url),
		data : {
			"gradeId" : gradeId
		},
		async : false,
		dataType : "json",
		type : "post",
		cache : false,
		success : function(data) {
			if(data!=null) {
				var classList = data;
			
				for(var i=0;i<classList.length;i++){
					var option ="<option value=\""+classList[i].classId+"\">"+classList[i].name+"</option>";
					$("#"+classId+"").append(option);					
				}
			}
		}
	});
	
}
/**
 * 验证字段值的合法性
 * @param {string} value 字段值
 * @param {int} maxLength 最大长度
 * @param {boolean} notEmpty 不允许为空
 * @param {String} labelName 字段标签名
 */
function chkFieldValue(value, maxLength, notEmpty, labelName) {
	var value = VCKString.trimToEmpty(value);
	
	//  检查是否必填
	if (notEmpty && VCKString.isBlank(value)) {
		$.messager.alert('提示',labelName + ' 的值不允许为空，请输入值！','info');
		return false;
	}
	
	// 检查字段最大长度
	if (maxLength === false) {
		return true;
	}
	
	var length = VCKString.strLength(value);
	if (length > maxLength) {
		$.messager.alert('提示',labelName + ' 的最大长度为 ' + maxLength + ' 个字符，请重新输入！','info');
		return false;
	}
	
	return true;
}
/**
 * 检查数字有效性
 * @param {String} value 字段值
 * @param {boolean} notEmpty 是否为空
 * @param {int} length 有效位数
 * @param {int} scale 精度
 * @param {String} lable 字段标签名
 * @return
 */
function chkNumberFieldValue(value, notEmpty, length, scale, lable) {
	var value = VCKString.trimToEmpty(value);
	
	//  检查是否必填
	if (VCKString.isBlank(value)) {
		if (notEmpty) {
			$.messager.alert('提示',lable + ' 的值不允许为空，请输入值！','info');
			return false;
		}
		return true;
	}
	if(scale == 0) {	//整数
		if (!VCKNumber.isNumber(value,length,scale)) {
			$.messager.alert('提示', lable+' 的值必须为整数，且长度不能超过 '+ length  + ' ！','info');
			return false;
		}
	}else {	//小数
		if (!VCKNumber.isNumber(value,length,scale)) {
			$.messager.alert('提示', lable+' 的值必须为数值，且整数部份长度不能超过 '+ (length - scale) +' ，小数位数不能超过 '+scale+' ！' ,'info');
			return false;
		}
	}
	
	return true;
}
/**
 * 检查日期有效性
 * @param {String} value 字段值
 * @param {boolean} notEmpty 是否为空
 * @param {String} lable 字段标签名
 * @return
 */
function chkDateFieldValue(value, notEmpty, lable) {
	var value = VCKString.trimToEmpty(value);
	
	//  检查是否必填
	if (VCKString.isBlank(value)) {
		if (notEmpty) {
			$.messager.alert('提示',lable + ' 的值不允许为空，请输入值！','info');
			return false;
		}
		return true;
	}
	
	if (!VCKDate.isDate(value)) {
		$.messager.alert('提示',lable+' 的值必须为有效日期(yyyy-MM-dd)！','info');
		return false;
	}
	return true;
}