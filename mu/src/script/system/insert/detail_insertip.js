layui.use(["layer", "form", "extension", "urlrelated"], function () {
    var laydate = layui.laydate
        , extension = layui.extension
        , table = layui.table
        , $ = layui.$
        , layer = layui.layer
        , form = layui.form
        , index = parent.layer.getFrameIndex(window.name)
        , loginuserinfo = extension.getUserInfo()                //获取用户登录信息
        , urlrelated = layui.urlrelated;
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
    var urldata = extension.getRequestParams(location.search);
    urlrelated.requestBody.data = {
        "sid": urldata.id
    }
    var loadingIndex = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        url: urlrelated.detailInsertIpById,
        type: "post",
        async: true,
        data: JSON.stringify(urlrelated.requestBody),
        cache: false,
        timeout: 120000,
        contentType: "application/json;charset=UTF-8",  //推荐写这个
        dataType: "json",
        success: function (result) {
            //  页面数据请求
            layer.close(loadingIndex);
            var data = result.data;
            var html = "";
            datalen = data.length;
            if (datalen == 0) {
                // layer.msg("当前用户还没有添加IP");
                html = "<span style='display:inline-block;line-height: 245px;'>当前用户还没有添加IP</span>";
                $("#noneinfo").prepend(html);
                return false;
            }
            //  弹出的结构生成
            for (var i = 0; i < datalen; i++) {
                // console.log(data[i].status)
                html += '<li class="showipli"  style="float: left;width: 100%;text-align: center;line-height: 40px;border-bottom:1px solid #E6E6E6">' +
                    '<span style="float: left;margin-left: 20px;font-size: 20px;font-weight: bold">IP:</span>' +
                    '<span style="float: left;font-size:20px" class="ips">' + data[i].ip + '</span>' +
                    '<a class="ipdel" style="color:#1E9FFF;float:right;margin-right:30px;" href="javascript:" lay-event="del">删除</a>' +
                    '</li>'
            }
            $("#detailip").html(html);
            $(".ipdel").on('click', function () {
                var ip = $(this).prev().text();
                var thisParentLi = $(this).parent();
                urlrelated.requestBody.data = {
                    "sid": urldata.id,
                    "ip": ip
                }
                var loadingIndex1 = layer.load(1, {
                    shade: 0.3
                });
                $.ajax({
                    url: urlrelated.deleteIpById,
                    type: "post",
                    async: true,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    timeout: 120000,
                    contentType: "application/json;charset=UTF-8",  //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        layer.close(loadingIndex1);
                        if (res.status == 200) {
                            layer.msg("删除成功");
                            $(thisParentLi).remove();
                            var length = $("#detailip li").length;
                            if (length == 0) {
                                html = "<span style='display:inline-block;line-height: 245px;'>当前用户还没有添加IP</span>";
                                $("#noneinfo").prepend(html);
                            }
                        } else {
                            layer.msg(res.message);
                        }
                    },
                    error: function (tt) {
                        layer.close(loadingIndex1);
                        //只要进error就跳转到登录页面
                        extension.errorInOpen();
                    }
                });
            })
        },
        error: function (tt) {
            layer.close(loadingIndex);
            //只要进error就跳转到登录页面
            extension.errorInOpen();
        }
    });
});
