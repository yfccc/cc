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
                    if (res.data.state == "DONE") {
                        element.progress("progress_analysis", "100%");
                        var allNum = Number(res.data.succNum) + Number(res.data.failNum);
                        $("#importInfo").html("导入完成：共计" + allNum + "条，其中成功" + res.data.succNum + "条，失败" + res.data.failNum + "条");
                        clearInterval(progressval);
                        // if(res.data.success == false){
                            $("#errormsg").html(res.data.message);
                        // }
                    } else {
                        element.progress("progress_analysis", res.data.percent);
                    }
                    // layer.msg("保存成功");
                    // parent.layer.close(index);
                    // if (res.data.percent == "100%") {
                    //     clearInterval(progressval);
                    //     $("#errormsg").html(res.data.message);
                    // }
                    if (res.data.state == "ERROR") {
                        layer.msg(res.message);
                        clearInterval(progressval);
                        $("#errormsg").html(res.data.message);
                    }
                } else {
                    clearInterval(progressval);
                    layer.msg(res.message);
                }
            },
            error: function (tt) {
                clearInterval(progressval);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        })
    }, 1000);
    //鼠标滑过显示文本信息
    $(document).on("hover", ".textoverflow", function () {
        if ($(this).width() < $(this)[0].scrollWidth) {
            var text = $(this).text();
            $(this).attr("title", text);
        }
    })
})
var fileinfo = "";
function changeData(data) {
    fileinfo = data[0];
}