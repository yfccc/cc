var request = {
    "userId": "", //暂时只有2才会成功 
    "userPassword": ""
}
layui.use(['table', 'form', "urlrelated", "layer", "extension"], function () {
    var laydate = layui.laydate,
        table = layui.table,
        extension = layui.extension,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        index = parent.layer.getFrameIndex(window.name);
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
    form.on('submit(modifypsd)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        urlrelated.requestBody.data = {
            "param": data.field.userPassword
        }
        jQuery.support.cors = true;
        $.ajax({
            url: urlrelated.logDesUrl,
            type: "post",
            timeout: 120000,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            contentType: "application/json", //推荐写这个
            // dataType: "json",
            success: function (res) {
                // layer.close(loadingicon);
                //console.log(res);
                if (res.status == 200) {
                    request.userPassword = res.data.result;
                    urlrelated.requestBody.data = request;
                    $.ajax({
                        url: urlrelated.modifyUserPsd,
                        type: "post",
                        // async: true,
                        timeout: 120000,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        contentType: "application/json;charset=UTF-8", //推荐写这个
                        // dataType: "json",
                        success: function (res) {
                            layer.close(loadingicon);
                            //console.log(res);
                            if (res.status == 200) {
                                top.layer.msg("保存成功");
                                parent.layer.close(index);
                            } else {
                                top.layer.msg(res.message);
                            }
                        },
                        error: function (xml, textstatus, thrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(thrown);
                        }
                    });
                } else {
                    top.layer.msg(res.message);
                }
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingicon);
                extension.errorMessage(thrown);
                alert(213)
            }
        });
        // request.userPassword = data.field.userPassword

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //验证
    var password = /^[0-9a-zA-Z]{8,16}$/; // 长度为8-16位 数字、英文的组合；
    // 验证
    form.verify({
        password: function (value) {
            if (value != "" && value != null) {
                if (password.test(value) === false) {
                    return "新密码格式错误，支持8-16位数字或字母的任意组合";
                }
            }
        },
        confirmPwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value != $("#userPassword").val()) {
                return '两次密码输入不一致';
            }
        }
    });

    var active = {
        GetRequest: function (url) {
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        close: function () {
            // 关闭当前窗口
            parent.layer.close(index);
        }
    }
});

//获取当前修改密码人员的id
function changeData(data) {
    request.userId = data;
}