layui.use(['form', "urlrelated", "extension", "laydate"], function () {
    var requestUrl = "";
    var laydate = layui.laydate,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        userId = "",
        userPoliceId = "",
        userName = "",
        index = parent.layer.getFrameIndex(window.name),
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
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
    //获取url信息
    var urldata = extension.getRequestParams(location.search);
    urlrelated.requestBody.data = {
        "isrId": urldata.isrId,
        "userId": loginuserinfo.userId
    }
    var loadingIndex = layer.load(1, {
        shade: 0.3
    });

    $("#querytype").val(localStorage.getItem("querytypeItem"));

    //获取权限信息
    var powerControl = $("#querytype").val();
    //console.log(powerControl);

    var requestUrl = urlrelated.editsetrules;
    if (urldata.type == "edit") {
        $.ajax({
            url: urlrelated.queryUserForSyncRule,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                if (res.status == 200) {
                    var html = '<option data-policeid="" value="">请选择</option>';
                    $.each(res.data.records, function (i, item) {
                        html += '<option value="' + item.userId + '" data-policeid = "' + item.userPoliceId + '">' + item.userName + '</option>'
                        if (urldata.userId == item.userId) {
                            userName = item.userName;
                            userPoliceId = item.userPoliceId;
                            userId = item.userId;
                        }
                    });
                    $("select[name='userName']").html(html);
                    form.render();
                    // var select = 'dd[lay-value=' + urldata.userId + ']';
                    // $("select[name='userName']").siblings("div.layui-form-select").find('dl').find(select).click();
                    $("select[name='userName']").val(urldata.userId);
                } else {
                    layer.msg(res.message);
                }

                form.render();
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorInOpen();
            }
        });
        form.render("select");
    } else if (urldata.type == "detail") {
        $(".hiddenmust").hide();
        $("input[name='isrRule']").each(function (i, e) {
            $(e).prop('disabled', true);
        });
        $("input[name='error']").each(function (i, e) {
            $(e).prop('disabled', true);
        });
        $("#isrAppointedTime").prop('disabled', true);
        $("#isrFailingTime").prop('disabled', true);
        $("#isrAppointedNum").prop('disabled', true);
        $("#userNameinput").prop('disabled', true);
        $("#usernameinput").show();
        $("#usernameselect").hide();
        $("select[name='userName']").prop('disabled', true);
        form.render('radio');
    }
    $("#isrAppointedNum").val("5");
    urlrelated.requestBody.data = {
        "isrId": urldata.isrId,
    };
    var loadingIndex1 = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        url: urlrelated.querySyncRule,
        type: "post",
        async: true,
        data: JSON.stringify(urlrelated.requestBody),
        cache: false,
        imeout: 120000,
        contentType: "application/json;charset=UTF-8", //推荐写这个
        dataType: "json",
        success: function (res) {
            layer.close(loadingIndex1);
            if (res.status == 200) {
                $("input[name='isrRule'][value=" + res.data.isrRule + "]").prop('checked', true);
                $("#isrAppointedTime").val(res.data.isrAppointedTime);
                $("#isrFailingTime").val(res.data.isrFailingTime);
                $("#userNameinput").val(res.data.userName);
            } else {
                layer.msg(res.message);
            }
            form.render();
        },
        error: function (xml, textstatus, thrown) {
            layer.close(loadingIndex1);
            //只要进error就跳转到登录页面
            extension.errorInOpen();
        }
    });

    form.on('select(userName)', function (data) {
        // console.log(data.elem); //得到select原始DOM对象
        // console.log(data.value); //得到被选中的值
        // console.log(data.othis); //得到美化后的DOM对象
        userId = data.value;
        userPoliceId = $(data.elem[data.elem.selectedIndex]).data("policeid") + "";
        userName = data.elem[data.elem.selectedIndex].text
    });

    form.on('submit(modifyinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        if (urldata.type == "detail") {
            parent.layer.close(index);
            return;
        }
        if (data.field.isrRule == "2") {
            if (data.field.isrAppointedTime == "") {
                layer.msg("请选择未上传数据上传时间");
                return;
            }
        } else {
            data.field.isrAppointedTime = "";
        }
        //异常同步规则 两个都是必填
        if (data.field.isrFailingTime == "") {
            layer.msg("请选择异常数据自动上传时间");
            return;
        }

        urlrelated.requestBody.data = {
            "isrRule": data.field.isrRule,
            "isrAppointedTime": data.field.isrAppointedTime,
            "isrFailingTime": data.field.isrFailingTime,
            "isrId": urldata.isrId,
            "userId": userId,
            "userPoliceId": userPoliceId,
            "userName": userName
        };
        var loadingIndex2 = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.editSyncRuleByAdmin,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            imeout: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex2);
                if (res.status == 200) {
                    top.layer.msg(res.message);
                    parent.layer.close(index);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingIndex2);
                //只要进error就跳转到登录页面
                extension.errorInOpen();
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 初始化按天的日期范围--同步规则
    laydate.render({
        elem: '#isrAppointedTime',
        trigger: "click",
        type: "time",
        format: 'HH:mm:ss',
        theme: '#2F4056' //设置主题颜色
        ,
        done: function (value) {

        }
    });
    //暂时不加
    // 初始化按天的日期范围--异常同步规则
    laydate.render({
        elem: '#isrFailingTime',
        trigger: "click",
        type: "time",
        format: 'HH:mm:ss',
        theme: '#2F4056' //设置主题颜色
        ,
        done: function (value) {

        }
    });


});