var imList = [];

layui.use(["layer", "extension", "urlrelated"], function () {
    var layer = layui.layer,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        args = extension.getRequestParams(location.search);
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
    var lefrHtml = "",
        rightHtml = "";
    var added_labels;
    if (args.hasOwnProperty('rybq') && args.rybq != "") {
        added_labels = [];
        var rybqarr = args.rybq.split(',');

        $(rybqarr).each(function (i, item) {
            var dic = item.split('_');
            added_labels.push(dic[0]);
        });
    }
    var addLableList = added_labels || [];
    var len = 0;
    var loadingicon = layer.load(1, {
        shade: 0.3
    })
    $.ajax({
        url: urlrelated.getMarkList,
        type: "post",
        dataType: "json",
        timeout: 120000,
        async: true,
        data: JSON.stringify(urlrelated.requestBody),
        contentType: "application/json",
        success: function (datasss) {
            if (datasss.status == "200") {
                var data = datasss.data;
                if (addLableList.length == 0 || addLableList == null) {
                    $(data).each(function (i, item) {
                        lefrHtml += '<li><span class="imid" imid=' + item.imId + '>' + item.imName + '</span><span  class="add">+添加</span></li>'
                    })
                } else {
                    $(data).each(function (ii, item) {
                        var f = false;
                        $(addLableList).each(function (i, itemm) {
                            if (item.imId == itemm) {
                                f = true;
                                return false;
                            }
                        })
                        if (f) {
                            rightHtml += ' <li><span class="rigth_item" imId=' + item.imId + '>' + item.imName + '</span><span  class="del">删除</span></li> '
                        } else {
                            lefrHtml += '<li><span class="imid" imid=' + item.imId + '>' + item.imName + '</span><span  class="add">+添加</span></li>'
                        }
                    })
                }
                len = addLableList.length;
                $(".left").html('<li class="title">选择标签</li>' + lefrHtml)
                $(".right").html('<li class="title  clear"><span class="imid">已选（' + len + '），最多可添加5条</span>' + (len > 0 ? '<span class="label_clear" style="color:#0079FE;cursor: pointer;">清空</span>' : '<span class="label_clear" style="display:none;color:#0079FE;cursor: pointer;">清空</span>') + '</li>' + rightHtml)
                layer.close(loadingicon);
            } else {
                layer.close(loadingicon);
                layer.msg(datasss.message);
            }
        },
        error: function (oo) {
            layer.close(loadingicon);
        }
    });

    //$(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');

    $(document).on("click", ".add", function () {
        var name = $(this).prev().text();
        var imId = $(this).prev().attr("imid");
        if (len == 5) {
            len = 5;
            layer.msg("最多只能添加5个标签");
            return false;
        } else {
            len++;
            $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
            len > 0 && $(".label_clear").show();
            $(this).parents("li").remove();
            $(".right").append(' <li><span class="rigth_item" imId=' + imId + '>' + name + '</span><span class="del">删除</span></li>');
            imList.push({
                "imId": imId,
                "imName": name
            })
        }
    });

    $(document).on("click", ".label_clear", function () {
        var lis = $(".right").find("li");
        len = 0
        imList = [];
        $(".label_clear").hide();
        $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
        $(lis).each(function (i, item) {
            if ($(item).hasClass("title")) {

            } else {
                var itemName = $(item).children().eq(0).text()
                imId = $(item).children().eq(0).attr("imId");
                $(item).remove()
                $(".left").append(' <li><span class="imid" imId=' + imId + '>' + itemName + '</span><span  class="add">+添加</span>');

            }
        })
    })

    $(document).on("click", ".del", function () {
        var name = $(this).prev().text();
        var imids = $(this).prev().attr("imId");
        $(this).parents("li").remove();
        $(".left").append(' <li><span class="imid" imId=' + imids + '>' + name + '</span><span  class="add">+添加</span>');
        if (len == 0) {
            len = 0;
            imList = [];
            return false
        } else {
            len--;
            len <= 0 && $(".label_clear").hide();
            $(".clear").find("span:first").html('已选（' + len + '），最多可添加5条');
            var n = -1;
            for (var i = 0; i < imList.length; i++) {
                if (imList[i].imId == imids) {
                    n = i;
                    break;
                }
            }
            n > -1 && imList.splice(n, 1);
        }

    })
});

function sethtml() {
    var imLists = [];
    var rigth_item = $(".right").find(".rigth_item")
    $(rigth_item).each(function (ii, item) {
        var imId = $(item).attr("imId"),
            imName = $(item).text();
        imLists.push({
            imId: imId,
            imName: imName
        })
    })
    var rableHtml = "";
    $(imLists).each(function (i, item) {
        rableHtml += '<div class="people_lable_item"><span  class="imId"  imId=' + item.imId + '>' + item.imName + '</span><span class="layui-icon layui-icon-close"></span></div>'
    });
    return rableHtml;
}