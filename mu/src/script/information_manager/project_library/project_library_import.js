layui.use(['element', 'laydate', 'form', 'urlrelated', 'extension'], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        element = layui.element,
        extension = layui.extension,
        index = parent.layer.getFrameIndex(window.name),
        userInfo = extension.getUserInfo();
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
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    form.render();
    var progressval = setInterval(function (i, p) {
        urlrelated.requestBody.data = {
            "key": fileinfo
        }
        $.ajax({
            url: urlrelated.getDevicDataExportState,
            type: "post",
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                //console.log(res);
                if (res.status == 200) {
                    layer.close(loadingIndex);
                    top.layer.msg("保存成功");
                    parent.layer.close(index);
                } else {
                    top.layer.msg(res.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        })
    }, 1000);

    //监听复选框事件
    form.on('checkbox(creat)', function (data) {
        // console.log(data.elem); //得到checkbox原始DOM对象
        // console.log(data.elem.checked); //是否被选中，true或者false
        // console.log(data.value); //复选框value值，也可以通过data.elem.value得到
        // console.log(data.othis); //得到美化后的DOM对象
        if (data.elem.checked) {
            $("#projectname").show();
            $("#ztkname").attr({
                "required": true,
                "lay-verify": "required"
            });
        } else {
            $("#projectname").hide();
            $("#ztkname").attr("required", false);
            $("#ztkname").removeAttr("lay-verify");
        }
    });

    //监听提交
    form.on('submit(importinfo)', function (data) {
        // console.log(data);
        console.log(data);
        // var loadingIndex = layer.load(1, {
        //     shade: 0.3
        // });
        // $.ajax({
        //     url: urlrelated.adviceAdd,
        //     type: "post",
        //     async: true,
        //     data: JSON.stringify(urlrelated.requestBody),
        //     cache: false,
        //     timeout: 120000,
        //     contentType: "application/json;charset=UTF-8", //推荐写这个
        //     dataType: "json",
        //     success: function (res) {
        //         //console.log(res);
        //         if (res.status == 200) {
        //             layer.close(loadingIndex);
        //             top.layer.msg("保存成功");
        //             parent.layer.close(index);
        //         } else {
        //             top.layer.msg(res.message);
        //         }
        //     },
        //     error: function (tt) {
        //         layer.close(loadingIndex);
        //         //只要进error就跳转到登录页面
        //         extension.errorLogin();
        //     }
        // })
        return false;
    });

})
var fileinfo = "";
function changeData(data) {
    fileinfo = data[0];
}