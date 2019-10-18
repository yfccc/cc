layui.use(["layer", "form", "extension", "urlrelated"], function () {
    var laydate = layui.laydate,
        extension = layui.extension,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        index = parent.layer.getFrameIndex(window.name),
        urlrelated = layui.urlrelated;
    form.render();
    var urldata = extension.getRequestParams(location.search);
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
    form.verify({
        IPV4: function (value, item) {
            var pattern = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
            if (value != "" && !pattern.test(value)) {
                return '请输入标准IPV4地址格式';
            }
        }
    })
    form.on('submit(modifyinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        urlrelated.requestBody.data = {
            "ip": data.field.ip,
            "sid": urldata.id
        };
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.insertIpById,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                //console.log(res);
                layer.close(loadingIndex);
                if (res.status == 200) {
                    top.layer.msg("保存成功");
                    parent.layer.close(index);
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                extension.errorInOpen();
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});