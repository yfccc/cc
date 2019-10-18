layui.use(['table', 'form', 'layer', 'extension', 'urlrelated'], function () {
    var urlrelated = layui.urlrelated,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        extension = layui.extension,
        userInfo = extension.getUserInfo();

    $("textarea[name='description']").keyup(function () {
        var str = $("textarea[name='description']").val();
        if (str.length >= 30) {
            $("textarea[name='description']").val(str.substring(0, 30));
        }
        $("#description_len").text(str.length);
    });
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
    form.on('submit(form_add_label)', function (data) {
        var url = "";
        if ($(data.elem).attr("data-event") === "edit") {
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            url = urlrelated.modifyPersonLabel;
            urlrelated.requestBody.data = data.field;
            $.ajax({
                url: url,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function (res) {
                    layer.close(loadingicon);
                    if (res.status === 200) {
                        top.layer.msg(res.message);
                        //清空下拉缓存
                        extension.removeDropDownList();
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    } else {
                        top.layer.msg(res.message);
                    }
                },
                error: function (err) {
                    layer.close(loadingicon);
                }
            });
        } else {
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            $.extend(data.field, {
                "userId": userInfo.userId,
                "userPoliceId": userInfo.policeId,
                "jgxxJgid": userInfo.JGID,
                "jgxxGajgjgdm": userInfo.userJGDM
            });
            urlrelated.requestBody.data = data.field;
            url = urlrelated.addPersonLabel;
            $.ajax({
                url: url,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function (res) {
                    layer.close(loadingicon);
                    if (res.status === 200) {
                        top.layer.msg(res.message);
                        //清空下拉缓存
                        extension.removeDropDownList();
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    } else {
                        top.layer.msg(res.message);
                    }
                },
                error: function (err) {
                    layer.close(loadingicon);
                }
            });
        }
        return false;
    });

    form.verify({
        labelName: function (value, item) {
            var pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
            if (!pattern.test(value)) {
                return '标签名为汉字、数字、字母或三者任意组合';
            }
        }
    });
});
$(function () {
    add_label_setval = function (lab_id, lab_name, lab_desc) {
        $("#lab_id").val(lab_id);
        $("#lab_name").val(lab_name);
        $("#lab_desc").val(lab_desc);
    };
});