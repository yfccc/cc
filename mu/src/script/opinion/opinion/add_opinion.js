layui.use(['form', "urlrelated", "extension", "layer"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        index = parent.layer.getFrameIndex(window.name),
        extension = layui.extension,
        dropDownList = extension.getDropDownList() //获取下拉框信息
        ,
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
    // 初始化单选框
    var opinionType = "";
    //意见类别
    $.each(dropDownList.yjlbList, function (i, e) {
        if (i == 0) {
            opinionType += '<input type="radio" checked lay-filter="opiniontype" name="adviceType" value="' + e.codeIndex + '" title="' + e.codeName + '">';

        } else {
            opinionType += '<input type="radio" lay-filter="opiniontype" name="adviceType" value="' + e.codeIndex + '" title="' + e.codeName + '">';
        }
    });
    $("#opinionType").html(opinionType);
    form.render("radio");

    // $(".layui-card-body").attr("style","height:"+extension.getDialogSize().height);

    form.on('submit(modifyinfo)', function (data) {
        //console.log(data)
        var request = data.field;

        urlrelated.requestBody["userId"] = loginuserinfo.userId;
        urlrelated.requestBody["userName"] = loginuserinfo.userName;
        urlrelated.requestBody.data = {
            "adviceType": data.field.adviceType,
            "adviceContent": data.field.adviceContent,
            "userJGDM": loginuserinfo.userJGDM
        }
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.adviceAdd,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                //console.log(res);
                if (res.status == 200) {
                    layer.close(loadingIndex);
                    top.layer.msg("保存成功");
                    parent.layer.close(index);
                } else {
                    top.layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        })
    })
});