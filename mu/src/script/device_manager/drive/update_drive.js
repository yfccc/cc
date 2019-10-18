layui.use(['upload', 'form', "urlrelated", "extension"], function () {
    var $ = layui.jquery,
        upload = layui.upload,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        form = layui.form;
    form.render();
    //拖拽上传
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
    var driveUrl = "";
    var loadingIndex;
    upload.render({
        elem: '#test10',
        url: urlrelated.uploadDrivce + '?driveVerson=1.0&driveCode=21321',
        accept: "file",
        acceptMime: "zip",
        headers: { token: localStorage.token },
        exts: 'zip',
        dataType: "json",
        before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            loadingIndex = top.layer.load(1, {
                shade: 0.3
            });
        },
        done: function (res) {
            // debugger
            top.layer.close(loadingIndex);
            layer.msg(res.status + "---" + res.message + "---" + res.data);
            driveUrl = res.data;
            $("#driveUrl").attr("data-url", res.data);
            driveUrl = res.data;
            var num = res.data.lastIndexOf('/') + 1;
            var name = res.data.substring(num);
            $("#driveUrl").text(name);
            //console.log(res)
        },
        error: function () {
            top.layer.close(loadingIndex);
            extension.errorInOpen();
        }
    });

    var VER = /^\d+(\.\d+)+$/; // 长度为30位 数字、英文的组合；
    var number = /^[1-9]\d*$/; // 长度为30位 数字、英文的组合；
    // 验证
    form.verify({
        revision: function (value) {
            if (VER.test(value) === true || number.test(value) === true) {
            } else {
                isallowchange = false;
                return "版本号格式错误";
            }
        }
    });

});
