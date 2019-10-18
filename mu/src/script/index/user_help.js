layui.use(["layer", "form", "extension", "urlrelated"], function () {
	var layer = layui.layer,
		extension = layui.extension,
		urlrelated = layui.urlrelated,
		form = layui.form;
	// 防止页面后退
	$(document).on("keydown", function (event) {
		var ev = event || window.event; //获取event对象 
		var obj = ev.target || ev.srcElement; //获取事件源 
		var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
		var code = event.keyCode || event.which;
		if ((code == 8 || code == 13) && t != "password" && t != "text" && t != "textarea") {
			return false
		}
	})
	
	urlrelated.requestBody.data = {};
	var loadingIndex = layer.load(1, {
		shade: 0.3
	});
	$.ajax({
		url: urlrelated.userHelp,
		type: "post",
		data: JSON.stringify(urlrelated.requestBody),
		cache: false,
		timeout: 120000,
		contentType: "application/json;charset=UTF-8",  //推荐写这个
		dataType: "json",
		success: function (res) {
			layer.close(loadingIndex);
			for(var i=0;i<res.data.length;i++){
				if(res.data[i].mouldName == "用户操作手册"){
					$("#operate").attr("href", res.data[i].mouldAdress);
				}
				if(res.data[i].mouldName == "设备导入模板"){
					$("#device_import").attr("href", res.data[i].mouldAdress);
				}
				if(res.data[i].mouldName == "用户导入模板"){
					$("#user_import").attr("href", res.data[i].mouldAdress);
				}
				if(res.data[i].mouldName == "IE8"){
					$("#ie8").attr("href", res.data[i].mouldAdress);
				}
				if(res.data[i].mouldName == "IE10"){
					$("#ie10").attr("href", res.data[i].mouldAdress);
				}
				if(res.data[i].mouldName == "IE11"){
					$("#ie11").attr("href", res.data[i].mouldAdress);
				}
			}
		},
		error: function (tt) {
			layer.close(loadingIndex);
			//只要进error就跳转到登录页面
			ex.errorLogin();
		}
	});



})
