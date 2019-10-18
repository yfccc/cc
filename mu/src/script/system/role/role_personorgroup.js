layui.use(['form', 'layer'], function () {
    var form = layui.form,
        index = parent.layer.getFrameIndex(window.name);
    layer = layui.layer;
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
    // 方法 
    var active = {
        close: function () {
            // 关闭当前窗口
            parent.layer.close(index);
        }
    };

    //   点击页面的关闭按钮
    $('#choose_cancel').on('click', function () {
        active.close();
    });
});