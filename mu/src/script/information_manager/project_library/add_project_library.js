layui.use(['form', 'urlrelated', 'extension'], function () {
    var $ = layui.$,
        form = layui.form,
        extension = layui.extension,
        layer = layui.layer,
        urlrelated = layui.urlrelated,
        userInfo = extension.getUserInfo();
    var args = extension.getRequestParams(location.search);
    //设置提交按钮的data event
    $("#add_library_submit").attr("data-event", args.layEvent);
    urlrelated.requestBody.data = {
        "isId": args.isId
    };
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });

    function setval(data) {
        $("#isId").val(data.isId);
        $("#name").val(data.isName);
        $("#desc").val(data.isDescrible);
        $("input[name=isWarn][value=0]").attr("checked", data.isWarn == 0 ? true : false);
        $("input[name=isWarn][value=1]").attr("checked", data.isWarn == 1 ? true : false);
        form.render();
    }
    if (args.layEvent == "edit") {
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        $.ajax({
            url: urlrelated.specialget,
            type: "post",
            dataType: "json",
            timeout: 120000,
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            contentType: "application/json",
            success: function (res) {
                if (res.status === 200) {
                    setval(res.data);
                    layer.close(loadingicon);
                } else {
                    layer.close(loadingicon);
                    layer.msg(res.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(loadingicon);
                extension.errorMessage(errorThrown);
            }
        });
    }
    //获取数据
    function Post(url, datas_json_str, callback) {
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        var e = arguments[3];
        $.ajax({
            url: url,
            type: "post",
            async: true,
            data: datas_json_str,
            cache: false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            timeout: 120000,
            success: function (res) {
                if (res.status === 200) {
                    callback(res, e);
                    layer.close(loadingicon);
                } else {
                    layer.msg(res.message);
                    layer.close(loadingicon);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(loadingicon);
                extension.errorMessage(errorThrown);
            }
        });
    }

    function Form_CallBack() {
        var args = arguments;
        if (args[0].status === 200) {
            //清空下拉框缓存
            extension.removeDropDownList();
            if (args[1] === "edit") {
                top.layer.msg("修改成功！");
                //清空下拉缓存
                extension.removeDropDownList();
            } else if (args[1] === "add") {
                top.layer.msg("新增成功！");
                //清空下拉缓存
                extension.removeDropDownList();
            }
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        } else {
            if (args[1] === "edit") {
                top.layer.msg("修改失败！");
            } else if (args[1] === "add") {
                top.layer.msg("新增失败！");
            }
        }
    }
    form.on('submit(add_library_submit)', function (data) {
        var url = "";
        if ($(data.elem).attr("data-event") === "edit") {
            url = urlrelated.specialedit;
        } else {
            url = urlrelated.specialadd;
        }

        $.extend(data.field, {
            "userId": userInfo.userId,
            "userPoliceId": userInfo.policeId,
            "jgxxGajgjgdm": userInfo.userJGDM
        })

        urlrelated.requestBody.data = data.field;
        Post(url, JSON.stringify(urlrelated.requestBody), Form_CallBack, $(data.elem).data("event"));
        return false;
    });

    form.verify({
        labelName: function (value, item) {
            var pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
            if (!pattern.test(value)) {
                return '15个汉字、数字、字母或三者任意组合';
            }
        }
    });
});