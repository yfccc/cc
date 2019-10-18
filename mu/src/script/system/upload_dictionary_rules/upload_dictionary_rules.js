layui.use(['form', "urlrelated", "extension", "laydate"], function () {
    var requestUrl = "";
    var laydate = layui.laydate,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        isrId = "",
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"))
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

    //获取权限信息
    var powerControl = $("#querytype").val();
    //console.log(powerControl);

    urlrelated.requestBody.data = {};
    var loadingicon = layer.load(1, {
        shade: 0.3
    })
    $.ajax({
        url: urlrelated.querySystemConfig,
        type: "post",
        async: true,
        timeout: 120000,
        data: JSON.stringify(urlrelated.requestBody),
        cache: false,
        contentType: "application/json;charset=UTF-8", //推荐写这个
        dataType: "json",
        success: function (res) {
            layer.close(loadingicon);
            if (res.status == 200) {
                if (res.data.records.length > 0) {
                    for (var i = 0; i < res.data.records.length; i++) {
                        //系统日志设置天数
                        if (res.data.records[i].iscApiKey == "SystemLogConfig") {
                            $("input[name='SystemLogConfig']").val(res.data.records[i].iscRetentionTime).attr("data-iscId", res.data.records[i].iscId);
                        }
                        //刑专日志设置天数
                        if (res.data.records[i].iscApiKey == "XingZhuanLogConfig") {
                            $("input[name='XingZhuanLogConfig']").val(res.data.records[i].iscRetentionTime).attr("data-iscId", res.data.records[i].iscId);
                        }
                        //第三方日志设置天数                        
                        if (res.data.records[i].iscApiKey == "OtherLogConfig") {
                            $("input[name='OtherLogConfig']").val(res.data.records[i].iscRetentionTime).attr("data-iscId", res.data.records[i].iscId);
                        }
                        //刑专地址
                        if (res.data.records[i].iscApiKey == "XingZhuanConfig") {
                            $("input[name='XingZhuanConfig']").val(res.data.records[i].iscUrl).attr("data-iscId", res.data.records[i].iscId);
                            $("input[name='clientId']").val(res.data.records[i].clientId);
                            $("input[name='clientSecret']").val(res.data.records[i].clientSecret);
                            $("input[name='timeOut']").val(res.data.records[i].timeOut);
                            $("input[name='isActive'][value=" + res.data.records[i].isActive + "]").prop('checked', true);
                        }
                        //胜云地址
                        if (res.data.records[i].iscApiKey == "ShengYunConfig") {
                            $("input[name='ShengYunConfig']").val(res.data.records[i].iscUrl).attr("data-iscId", res.data.records[i].iscId);
                            $("input[name='token']").val(res.data.records[i].token);
                        }
                        //备份地址  暂时去掉
                        // if (res.data.records[i].iscApiKey == "ShengYunConfig") {  
                        //     $("input[name='ShengYunConfig']").val(res.data.records[i].iscUrl).attr("data-iscId", res.data.records[i].iscId);
                        // }
                    }
                    form.render();
                }
            } else {
                layer.msg(res.message);
                $("#footer-btn").hide();
            }
            form.render();
        },
        error: function (xml, textstatus, thrown) {
            layer.close(loadingicon);
            extension.errorLogin();
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
        }
    };

    form.on('submit(modifyinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var paramList = new Array();
        $(".inputinfo").each(function () {              //一个类名就是请求参数的一个结构体
            var infotype = $(this).attr("name");
            var iscRetentionTime = "";
            var iscUrl = "";
            var infodata = {};
            var iscId = $(this).attr("data-iscId");
            var infodata = {
                "iscId": iscId,
                "iscRetentionTime": "",
                "iscUrl": "",
                "iscApiKey": infotype
            }
            if (infotype == "SystemLogConfig" || infotype == "XingZhuanLogConfig" || infotype == "OtherLogConfig") {
                infodata.iscRetentionTime = $(this).val();
                infodata.iscUrl = "";
            } else if (infotype == "XingZhuanConfig") {
                infodata.iscRetentionTime = "";
                infodata.iscUrl = $(this).val();
                infodata["clientId"] = data.field.clientId;
                infodata["clientSecret"] = data.field.clientSecret;
                infodata["timeOut"] = data.field.timeOut;
                infodata["isActive"] = data.field.isActive;
            } else if (infotype == "ShengYunConfig") {
                infodata.iscRetentionTime = "";
                infodata.iscUrl = $(this).val();
                infodata["token"] = data.field.token;
            }

            paramList.push(infodata);
        })
        urlrelated.requestBody.data = {
            "paramList": paramList
        };
        var loadingicon1 = layer.load(1, {
            shade: 0.3
        })
        $.ajax({
            url: urlrelated.editSystemConfig,
            type: "post",
            async: true,
            timeout: 120000,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingicon1);
                if (res.status == 200) {
                    layer.msg(res.message);
                } else {
                    layer.msg("修改失败，请刷新后再试");
                }
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingicon1);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // // 初始化按天的日期范围--同步规则
    // laydate.render({
    //     elem: '#isrAppointedTime'
    //     , trigger: "click"
    //     , type: "time"
    //     , format: 'HH:mm:ss'
    //     , theme: '#2F4056'  //设置主题颜色
    //     , done: function (value) {

    //     }
    // });
    // // 初始化按天的日期范围--异常同步规则
    // laydate.render({
    //     elem: '#isrFailingTime'
    //     , trigger: "click"
    //     , type: "time"
    //     , format: 'HH:mm:ss'
    //     , theme: '#2F4056'  //设置主题颜色
    //     , done: function (value) {

    //     }
    // });


});