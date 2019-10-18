layui.use(["urlrelated", "layer"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        $ = layui.$,
        layer = layui.layer,
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
    $("body", parent.document).find('#sub-title').html('公告管理>查看');
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
    var urldata = active["GetRequest"](window.location.search);

    urlrelated.requestBody.data = {
        "noticeId": urldata.id
    }
    var loadingIndex = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        url: urlrelated.noticeDetails,
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
                $("#sign_title").text(res.data.noticeTitle);
                $("#sign_date").text(res.data.noticeDtStr);
                $("#sign_content").html(res.data.noticeContent);
            } else {

                layer.msg(res.message);
            }
        },
        error: function (tt) {
            layer.close(loadingIndex);
            //只要进error就跳转到登录页面
            extension.errorLogin();
        }
    });

});