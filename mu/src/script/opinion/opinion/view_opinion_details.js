layui.use(["urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        $ = layui.$,
        layer = layui.layer,
        extension = layui.extension,
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
    var urldata = extension.getRequestParams(location.search);
    $("body", parent.document).find('#sub-title').html('意见管理>查看');
    urlrelated.requestBody.data = {
        "adviceId": urldata.id
    }

    function getInfo() {
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.adviceDetail,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                //console.log(res);
                if (res.status == 200) {
                    $("#sign_title").html(res.data.data[0].type);
                    $("#sign_person").html(res.data.data[0].adviceOperater);
                    $("#sign_date").html(res.data.data[0].adviceTime);
                    $("#sign_content").html(res.data.data[0].adviceContent);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        })
    }
    getInfo();

});