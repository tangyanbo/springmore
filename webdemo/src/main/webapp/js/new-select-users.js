/**
 * 选择用户弹出框
 * 
 * @author Rambo
 * @date 2014-3-18
 * @version 1.0
 */
(function($){
	
	//定义选择用户的插件对象
	var selectUserBox = {
		selectUsers : function(data,callback,dataType){
			var config = {};
			if ( $.isFunction( data )) {
				dataType = callback;
				callback = data;
				data = undefined;
			} else if($.isArray(data)){
				$.extend(config,{
					selected : {
						userIds : data
					}
				});
			} else if(typeof data === 'string'){
				config.groupType = data;
			}else if(typeof data === 'object'){
				$.extend(config,data);
			}
			if(dataType !== undefined){
				config.dataType = dataType;
			}
			if(callback !== undefined){
				config.callback = callback;
			}
			var userbox = sUser.init(config);
			return userbox;
		},
		refreshUsers : function(userType){
			cache.removeUserGroups(userType);
			getJSONP(ROOT_PATH+"removeUsersCache.action",{userType : userType},function(){
				if(sUser._userType == userType){
					sUser.changeUserType(userType);
				}
			});
		},
		refreshTeachers : function(){
			this.refreshUsers(2);
		},
		refreshStudents : function(){
			this.refreshUsers(1);
			this.refreshParents();
		},
		refreshParents : function(){
			this.refreshUsers(3);
		}
	};
	$.extend(selectUserBox,{
		selectUser : selectUserBox.selectUsers,
		selectStudent : function(data,callback,dataType){
			var config = {};
			if($.isArray(data)){
				$.extend(config,{
					selected:{
						userType :1,
						userIds : data//预选中用户
					},
					title:'请选择学生',
					userTypes:[1]//要显示的用户类型
				});
			}else{
				config = data;
			}
			selectUserBox.selectUsers(config,callback,dataType);
		}
	});
	//selectUserBox.selectUser = selectUserBox.selectUsers;
	if(top.jQuery){//如果父窗口也引用了jQuery对象
		/*
		 * 如果插件的方法在top.jQuery中都存在则无需再初始化
		 */
		var isExist = true;
		for(var fn in selectUserBox){
			if(!top.jQuery[fn]){ 
				isExist = false;
				break;
			}
			jQuery[fn] = top.jQuery[fn];
		}
		if(isExist){
			return selectUserBox;
		}
	}
	function getRootPath(scriptUri){
		var root_path = "";
		$("script").each(function(){
			var index = -1;
			if((index = this.src.search(scriptUri)) != -1){
				root_path = this.src.substring(0,index);
				return false;
			}
		});
		return root_path;
	}
	var Cache = function(){
		this.user_group = {};
		this.users={};
	};
	Cache.prototype = {
		addUserGroups : function(userType,userGroups){
			this.user_group[userType] = userGroups;
			for(var i=0;i<userGroups.length;i++){
				var group = userGroups[i];
				if(group.userGroupVOs.length>0){
					for(var j=0;j<group.userGroupVOs.length;j++){
						var subGroup = group.userGroupVOs[j];
						this.addUsers(subGroup.userList);
					}
				}
			}
		},
		addUser : function(user){
			this.users[user.userId] = user;
		},
		addUsers : function(users){
			for ( var i = 0; i < users.length; i++) {
				this.addUser(users[i]);
			}
		},
		getUser : function(userId){
			return this.users[userId];
		},
		getUserGroups : function(userType){
			return this.user_group[userType];
		},
		containsUserGroups:function(userType){
			return this.user_group[userType] !== undefined;
		},
		removeUserGroups : function(userType){
			if(userType){
				delete this.user_group[userType];
			}else{
				this.user_group = {};
				this.users={};
			}
		}
	};
	
	var cache = new Cache();
	
	var ShiyueUser = function(){
		this._initBox();
	};
	ShiyueUser.prototype = {
		init : function(_config){
			this._initBox();
			var config = this.config = $.extend(true,{},ShiyueUser.defaults,_config);
			if(config.autoOpen){
				this.open();
			}
			var _this = this;
			this.createUserTypes(config.userTypes);
			this.changeUserType(config.selected.userType,function(){
				for(var i=0;i<config.selected.userIds.length;i++){
					var userId = config.selected.userIds[i];
					_this.addSelectedUser(userId);
				}
				_this.loadUsers(config.selected.groupType,config.selected.groupName);
			});
			return this;
		},
		_initBox : function(){
			var _boxId = 'tanMain-user';
			box = $('#'+_boxId);
			if(box.length){
				return box;
			}

			var boxStr=
				'<div id="tanMain-user" style="width: 800px; margin: 0px auto;">'+
				'	<div class="tanTop">'+
				'		<span class="user_types">用户类型：<select><option>教师</option></select></span>'+
				'		<span>关键字：<input name="keyword" type="search" class="txt_search"></span>'+
				'		<button class="btnbd">搜索</button>'+
				'	</div>'+
				'	<div class="tanCon">'+
				'		<div class="tanLeft" style="height:380px;overflow: auto;">'+
				'			<ul class="tanLUI">'+
				'				<li><a href="javascript:void(0);">全部</a></li>'+
				'			</ul>'+
				'		</div>'+
				'		<div class="tanRight">'+
				'			<table border="0" cellspacing="0" cellpadding="0" class="table0">'+
				'				<tr>'+
				'					<th><input id="chk-tanMain-user-delay-all" type="checkbox"/><strong><label for="chk-tanMain-user-delay-all">以下是待选用户</label></strong></th>'+
				'				</tr>'+
				'				<tr>'+
				'					<td>'+
				'						<div class="tanXG users_box" style="height: 190px; overflow: auto;"></div>'+
				'					</td>'+
				'				</tr>'+
				'				<tr>'+
				'					<th><strong>已选用户</strong><div class="toolbar-right"><a href="javascript:void(0);" id="btn-tanMain-user-already-all" class="icon-trash">清除已选用户</a><div></th>'+
				'				</tr>'+
				'				<tr>'+
				'					<td>'+
				'						<div class="tanXG selected_users_box" style="height: 150px; overflow: auto;"></div>'+
				'					</td>'+
				'				</tr>'+
				'			</table>'+
				'		</div>'+
				'	</div>'+
				'	<div class="tanFoot"></div>'+
				'</div>';
			box = $(boxStr);
			$("body").append(box);
			this._box = box;
			this._typeBox = $(".user_types",box);
			this._groupsBox = $("ul.tanLUI",box);
			this._usersBox = $(".users_box",box);
			this._selectedUsersBox = $(".selected_users_box",box);
			this._initEvents();
			return box;
		},
		_initEvents:function(){
			var _this = this;
			this._box.on("click",".tanLUI>li>a",function(e){
				var groupId = $(this).parent().attr("groupId");
				_this.loadUsers(groupId);
			}).on("click",".tanLUI ul a",function(e){
				var li = $(this).parent();
				var subGroupName = li.attr("groupname");
				var groupId = li.parent().parent().attr("groupId");
				_this.loadUsers(groupId, subGroupName);
			}).on("change",".users_box :checkbox",function(e){
				var userId = $(this).val();
				if(this.checked){
					_this.addSelectedUser(userId);
				}else{
					_this.removeSelectedUser(userId);
				}
			}).on("change",".selected_users_box :checkbox",function(e){
				var userId = $(this).val();
				_this.removeSelectedUser(userId);
			}).on("click",".btnbd",function(){
				var keyword = $(".tanTop .txt_search",_this._box).val();
				_this.searchUser(keyword);
			}).on("keydown",".tanTop .txt_search",function(e){
				if(e.keyCode==13){
					_this.searchUser($(this).val());
					return false;
				}
			}).on("change","#chk-tanMain-user-delay-all",function(e){
				_this._usersBox.find(":checkbox").prop("checked",this.checked);
				setTimeout(function(){
					_this._usersBox.find(":checkbox").each(function(){
						$(this).change();
					});
				},1);
			}).on("click","#btn-tanMain-user-already-all",$.proxy(_this.removeSelectedUserAll,_this));
		},
		changeUserType:function(userType,callback){
			this._userType = userType;
			var _this = this;
			callback  = callback || function(){
				_this.loadUsers();
			};
			_this.clearUserBox();
			_this.clearUserGroupsBox();
			if(cache.containsUserGroups(userType)){
				_this.createUserGroups(cache.getUserGroups(userType));
				callback();
			}else{
				getJSONP(_this.config.userGroupURI,{userType:userType},function(userGroups){
					_this.createUserGroups(userGroups);
					cache.addUserGroups(userType, userGroups);
					callback();
				});
			}
			_this.config.selected.userType = userType;
		},
		createUserTypes:function(userTypes){
			var _this = this;
			this._typeBox.empty();
			if(userTypes.length == 1){
				this.config.selected.userType = userTypes[0];
			}else{
				this._typeBox.append('用户类型：');
				var selt = $('<select></select>').change(function(){
					//_this.changeUserType($(this).val()); //如果数据多，select框会卡
					setTimeout(function(){
						_this.changeUserType(selt.val());
					},1);
				}).appendTo(this._typeBox);
				for ( var i = 0; i < userTypes.length; i++) {
					var userType = userTypes[i];
					var name = this.config.userTypesNames[userType];
					selt.append('<option value="'+userType+'">'+name+'</option>');
				}
				selt.val(this.config.selected.userType);
			}
		},
		//创建多用户组
		createUserGroups:function(userGroups){
			this.userGroups = userGroups;
			var groupsBox = this._groupsBox;
			for(var i=0;i<userGroups.length;i++){
				var group = userGroups[i];
				var groupBox = $('<li groupid="'+group.id+'" groupname = "'+group.name+'"><a href="javascript:void(0);">'+group.name+'</a></li>').appendTo(groupsBox);
				if(group.userGroupVOs.length>0){
					var subGroupBox = $('<ul style="display:none;"></ul>').appendTo(groupBox);
					this.createUserGroup(subGroupBox,group.userGroupVOs);
				}
			}
		},
		//创建用户组
		createUserGroup:function(element,groups){
			for(var i=0;i<groups.length;i++){
				var group = groups[i];
				var groupBox = $('<li groupname="'+group.groupName+'"><a href="javascript:void(0);">'+group.groupName+'</a></li>').appendTo(element);
			}
		},
		createUsers:function(users){
			$("#chk-tanMain-user-delay-all",this._box).prop("checked",false);
			var str = "";
			for ( var i = 0; i < users.length; i++) {
				str += this.createUser(users[i],true);
			}
			this._usersBox.append(str);
		},
		createUser:function(user,flag){
			if($("#user-box-u-"+user.userId,this._usersBox).length){
				return '';
			}
			var checked = this.config.selectedUsers[user.userId] != undefined;
			var str = '<span class="spanDis" title="'+user.name+'"><input type="checkbox" '+(checked ? 'checked="checked"':'')+' id="user-box-u-'+user.userId+'" value="'+user.userId+'" style="cursor:pointer;"><label for="user-box-u-'+user.userId+'" style="cursor:pointer;">'+user.name+'</label></span>';
			if(!flag){
				this._usersBox.append(str);
			}
			return str;
		},
		loadUsers : function(groupId,subGroupName){
			//防止重复点击
			if(this._groupId === groupId && this._subGroupName === subGroupName){
				return false;
			}
			this._groupId = groupId;
			this._subGroupName = subGroupName;
			//防止重复点击 end
			this.unfoldUserGroup(groupId, subGroupName);
			this.clearUserBox();
			for(var i=0; i<this.userGroups.length; i++){
				var group = this.userGroups[i];
				if(groupId != undefined && group.id != groupId && group.name != groupId){
					continue;
				}
				var subGroups = group.userGroupVOs;
				for ( var j = 0; j < subGroups.length; j++) {
					var subGroup = subGroups[j];
					if(subGroupName == undefined || subGroup.groupName == subGroupName){
						this.createUsers(subGroup.userList);
					}
				}
			}
		},
		unfoldUserGroup:function(groupId,subGroupName){
			this._groupsBox.find("ul").hide().find("li a").removeClass("actived");
			if(groupId == undefined){
				return false;
			}
			var li = this._groupsBox.find('>li[groupid="'+groupId+'"],>li[groupname="'+groupId+'"]');
			li.find(">ul").show();
			if(subGroupName == undefined){
				return false;
			}
			li.find('>ul>li[groupname="'+subGroupName+'"]>a').addClass("actived");
		},
		searchUser: function(keyword,userType){
			var _this = this;
			var userType = userType || _this.config.selected.userType;
			keyword = keyword.replace(/(^\s*)|(\s*$)/, "");//去掉前后空白字符
			/*if(keyword==""){
				return;
			}*/
			_this.clearUserBox();
			getJSONP(_this.config.searchURI,{keyword:keyword,userType:userType},function(users){
				_this.createUsers(users);
			});
		},
		open:function(){
			var _this = this;
			if($.widget){//jqueryui
				this._box.dialog({
					title: this.config.title,
					width:820,
					autoOpen: true,
					modal: true,
					buttons: [{
						text:'确定',
						click:function(){
							_this.submit();
							_this._box.dialog('close');
						}
					}],
					close:function(){
						_this.destroy();
					}
				});
			}else{//jeasyui
				if(this._box.data("dialog") != undefined){
					this._box.dialog("open");
				}else{
					this._box.dialog({
						title: this.config.title,
						width:810,
						closed: false,
						cache: false,
						modal: true,
						buttons: [{
							text:'确定',
							handler:function(){
								_this.submit();
								_this._box.dialog('close');
							}
						}],
						onClose:function(){
							_this.destroy();
						}
					});
				}
			}
			
		},
		destroy: function(){
			this.clearUserGroupsBox();
			this.clearUserBox();
			this.clearSelectedUserBox();
		},
		addSelectedUser:function(user){
			if(typeof user != 'object'){
				var userId = user;
				user = cache.getUser(userId);
			}
			if(!user){
				return false;
			}
			if(!this.config.selectedUsers[user.userId]){
				$('<span class="spanDis" title="'+user.name+'"><input type="checkbox" checked="checked" id="user-box-u-s-'+user.userId+'" value="'+user.userId+'" style="cursor:pointer;"><label for="user-box-u-s-'+user.userId+'" style="cursor:pointer;">'+user.name+'</label></span>').appendTo(this._selectedUsersBox);
				this.config.selectedUsers[user.userId] = user;
			}
		},
		removeSelectedUser : function(userId){
			$("#user-box-u-s-"+userId,this._selectedUsersBox).parent().remove();
			$("#user-box-u-"+userId,this._usersBox).prop("checked",false);
			delete this.config.selectedUsers[userId];
		},
		removeSelectedUserAll : function(){
			for ( var userId in this.config.selectedUsers) {
				$("#user-box-u-"+userId,this._usersBox).prop("checked",false);
			}
			this._selectedUsersBox.empty();
			this.config.selectedUsers = {};
		},
		clearUserGroupsBox:function(){
			this._groupId = null;
			this._subGroupName = null;
			this._groupsBox.find(">li:gt(0)").remove();
		},
		clearUserBox:function(){
			this._usersBox.empty();
		},
		clearSelectedUserBox:function(){
			this._selectedUsersBox.empty();
		},
		submit:function(){
			var users = this.config.selectedUsers;
			if(this.config.dataType == "json"){
				this.config.callback(users);
			}else if(this.config.dataType == "string"){
				var ids = "",names = "";
				var i=0;
				$.each(users,function(id,u){
					if(i++!=0){
						ids+=",";
						names+=",";
					}
					ids+=id;names+=u.name;
				});
				this.config.callback(ids,names);
			}else{//默认dataType array
				var userList = [];
				$.each(users,function(i,v){
					userList.push(v);
				});
				this.config.callback(userList);
			}
		},
		//防止重复点击
		_groupId : null,
		_subGroupName : null
		//防止重复点击 end
	};
	
	
	var ROOT_PATH = getRootPath("js/new-select-users.js");
	/**
	 * 默认配置
	 */
	ShiyueUser.defaults = {
		autoOpen:true,
		selected:{
			userType :2,
			//groupType:'department',
			//groupName:undefined,
			userIds : []//预选中用户
		},
		title:'请选择用户',
		selectedUsers:{},//选中用户
		userTypes:[2],//要显示的用户类型
		userTypesNames:{'1':'学生','2':'教师','3':'家长'},
		userGroupURI :ROOT_PATH+'findUserGroups.action',//获取用户组的URI
		searchURI:ROOT_PATH+'findUsersByKeyword.action',//搜索用户的URI
		dataType:'array',
		onLoadUserGroup:function(userType,userGroup){
			return true;
		},
		onLoadUser:function(userType){
			return true;
		},
		onCheckUser:function(user){
			return true;
		},
		callback:function(){}

	};
	function getJSONP( url, data, callback ) {
		$.ajax({
			url:url,
			type:'post',
			data:data,
			dataType:"jsonp",
			jsonpCallback : "selectUserCallback"+new Date().getTime(),
			success : callback
			
		});
		return $;
	};
	var sUser = new ShiyueUser();
	
	$.extend(selectUserBox);
	return selectUserBox;
})(jQuery);