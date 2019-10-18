layui.use(["layer", "form", "extension", "urlrelated"], function () {
    var laydate = layui.laydate
        , extension = layui.extension
        , table = layui.table
        , $ = layui.$
        , layer = layui.layer
        , form = layui.form
        , index = parent.layer.getFrameIndex(window.name)
        , urlrelated = layui.urlrelated
    loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false
        }
    })
    var urldata = extension.getRequestParams(location.search);
    if (urldata.type == "add") {

    } else if (urldata.type == "edit") {
        urlrelated.requestBody.data = {
            "id": urldata.id
        }
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.selectInsertIpById,
            type: "post",
            // async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                //console.log(res);
                layer.close(loadingIndex);
                if (res.status == 200) {
                    $("#clientId").val(res.data.clientId);
                    $("#clientSecret").val(res.data.clientSecret);
                    $("#remark").val(res.data.remark);
                    $("#status").val(res.data.status);
                    $("#name").val(res.data.name);
                    form.render('select');
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorInOpen();
            }
        });
    }
    form.on('submit(modifyinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}

        var changeurl = "";
        urlrelated.requestBody.data = data.field;
        urlrelated.requestBody.data["userJGDM"] = loginuserinfo.userJGDM;
        if (urldata.type == "edit") {
            changeurl = urlrelated.updateInfoById;
            urlrelated.requestBody.data["id"] = urldata.id
        } else {
            changeurl = urlrelated.addInsertIp;
        }
        var loadingIndex1 = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: changeurl,
            type: "post",
            // async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex1);
                //console.log(res);
                if (res.status == 200) {
                    top.layer.msg("保存成功");
                    parent.layer.close(index);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex1);
                //只要进error就跳转到登录页面
                extension.errorInOpen();
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    // //验证
    // var password = /^[0-9a-zA-Z]{8,16}$/; // 长度为8-16位 数字、英文的组合；
    // // 验证
    // form.verify({
    //     password: function (value) {
    //         if (value != "" && value != null) {
    //             if (password.test(value) === false) {
    //                 return "新密码格式错误，支持8-16位数字或字母的任意组合";
    //             }
    //         }
    //     }
    // });
});
