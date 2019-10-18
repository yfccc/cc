layui.use(['table', 'form', "urlrelated", "extension"], function () {
    var laydate = layui.laydate
        , element = layui.element
        , table = layui.table
        , $ = layui.$
        , layer = layui.layer
        , form = layui.form
        , urlrelated = layui.urlrelated
        , index = parent.layer.getFrameIndex(window.name)
        , extension = layui.extension
        , loginuserinfo = extension.getUserInfo();      //获取用户登录信息
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
    var account = /^[0-9a-zA-Z\u4e00-\u9fa5]{0,20}$/; //20位数字、字母、汉字的组合
    var numberT = /^[1-9]\d*$/;   //三位数字
    // 验证
    form.verify({
        account: function (value) {
            if (value != "" && value != null) {
                if (account.test(value) === false) {
                    return "仅支持15位英文字母、数字或汉字";
                }
                if (value == "超级管理员") {
                    return "角色名称不能为超级管理员";
                }
            }
        },
        numberT: function (value) {
            if (value != "" && value != null) {
                if (numberT.test(value) === false) {
                    return "只能输入大于0并且不能以0开头的数字";
                }
            }
        }
    });
    // $(".layui-card-body").attr("style", "height:" + extension.getDialogSize().height);
    // $("#change_role_submit").on("click",function(){
    form.on('submit(modifyinfo)', function (data) {
        var request = data.field;
        var requsetUrl = urlrelated.roleAdd;
        request["rmId"] = "";
        request["userId"] = loginuserinfo.userId;
        request["userPoliceId"] = loginuserinfo.policeId;
        request["jgxxJgid"] = loginuserinfo.JGID;
        request["jgxxGajgjgdm"] = loginuserinfo.userJGDM;
        var roleid = $("#rmName").data("roleid");
        if (roleid != undefined && roleid != null) {
            request.rmId = roleid;
            requsetUrl = urlrelated.roleEdit;
        } else {
            //新增不需要
            delete request.rmId;
        }

        urlrelated.requestBody.data = request;
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: requsetUrl,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                //console.log(res);
                if (res.status == 200) {
                    top.layer.msg("保存成功");
                    parent.layer.close(index);
                } else {
                    if (roleid == undefined || roleid == null) {
                        if (res.message == "角色名称已存在") {
                            top.layer.msg(res.message, {
                                icon: 5
                            });
                            // $("#rmName").parent().css("border", "1px solid #FF5722");
                            // setTimeout(function () {
                            //     $("#rmName").parent().css("border", "none");
                            // }, 3000);
                        } else {
                            top.layer.msg(res.message);
                        }
                    } else {
                        top.layer.msg(res.message);
                    }
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

