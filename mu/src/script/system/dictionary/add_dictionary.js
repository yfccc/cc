layui.use(["layer", "form", "extension", "urlrelated"], function () {
    var laydate = layui.laydate,
        extension = layui.extension,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        index = parent.layer.getFrameIndex(window.name),
        urlrelated = layui.urlrelated;
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
    form.render();
    var urldata = extension.getRequestParams(location.search);
    //验证
    var account = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/; //数字、字母、汉字的组合
    // 验证
    form.verify({
        account: function (value) {
            if (value != "" && value != null) {
                if (account.test(value) === false) {
                    return "仅支持英文字母、数字或汉字";
                }
            }
        }
    });
    form.on('submit(modifyinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var request = data.field;
        // request.ctId = Number(request.ctId);
        var changeurl = "";
        if (urldata.type == "edit") {
            changeurl = urlrelated.irisCodeEdit;
        } else {
            delete request["ctId"];
            changeurl = urlrelated.irisCodeAdd;
        }

        urlrelated.requestBody.data = request;
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: changeurl,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timepit: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                //console.log(res);
                layer.close(loadingIndex);
                if (res.status == 200) {
                    top.layer.msg("保存成功");
                    parent.layer.close(index);
                    extension.removeDropDownList();
                } else {
                    top.layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorInOpen();
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});