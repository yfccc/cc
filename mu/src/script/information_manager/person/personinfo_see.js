layui.use(["form", "laydate", "layer", "extension", "urlrelated"], function () {
    var form = layui.form,
        layer = layui.layer,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        laydate = layui.laydate;
    $("body", parent.document).find('#sub-title').html('人员信息管理>查看');
    form.render();
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
    form.on('submit(editinfo)', function (data) {
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        var rybq = "";
        //获取选中的人员标签
        $(".personlabel").children().each(function (i, e) {
            if (!$(e).hasClass("add_lable")) {
                var spanEle = $(e).children().first();
                var imid = $(spanEle).attr("imid");
                var imname = $(spanEle).text();
                rybq += imid + "_" + imname + ",";
            }
        });
        rybq = rybq.substring(0, rybq.length - 1);
        data.field["RYBQ"] = rybq;

        urlrelated.requestBoby.data = data.field;

        $.ajax({
            url: urlrelated.editPersonInfoDetail,
            type: "post",
            dataType: "json",
            timeout: 120000,
            async: true,
            data: JSON.stringify(urlrelated.requestBoby),
            contentType: "application/json",
            success: function (res) {
                layer.close(loadingicon);
                if (res.status === 200) {
                    top.layer.msg("修改成功！");
                    location.href = "./person.html";
                } else {
                    layer.msg("修改失败！");
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(loadingicon);
                extension.errorMessage(errorThrown);
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //获取参数
    var args = extension.getRequestParams(location.search);
    // laydate渲染
    laydate.render({
        elem: '#birthday' //,type: 'date' //默认，可不填
        , btns: ['clear', 'confirm'] //显示清除和确认
        , trigger: 'click' //采用click弹出
        // , max: curDateTime
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value, date, endDate) {
            //时间空间里面
            // if (isIE89()) {
            //     if (value !== "") {
            //         $(".dateSpan").css("display", "none")
            //     }
            //     if (value == "") {
            //         $(".dateSpan").css("display", "block")
            //     }
            // }
        }
    });

    $(".add_lable").on("click", function () {
        layer.open({
            title: '选择标签',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/gather/add_lable.html', "no"],
            btn: ["确定", "取消"],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var labelHtml = iframeWin.sethtml() + '<div class="people_lable_item add_lable">+</div>';
                $(".personlabel").html(labelHtml);
                $(".personlabel span.layui-icon").on("click", function () {
                    $(this).parent().remove();
                });
                layer.close(index);
            },
            success: function (layero, index) {

            }
        });
    });

    //年范围选择器
    laydate.render({
        elem: '#birthday'
        , type: 'date' //时间选择器类型：'year'(年)  'month'(年月)  'date'(//默认，可不填)  'time'(时间)  'datetime'(日期时间)
        , range: '~' //或 range: '~' 来自定义分割字符
        , trigger: "click"
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value, date, endDate) {
            // if(value !== ""){
            //     $(".youxiaqi").css("display","none")
            // }
            // if(value == ""){
            //     $(".youxiaqi").css("display","none")
            // }
        }
    });

    if (args.type == "see") {
        $("#addsign").hide();
        form.render();
    }
    if (args.hasOwnProperty('RYBQ')) {
        //从人员标签链接过来
        $("#cancel_person").attr("href", "./person.html?RYBQ=" + args.RYBQ);
    }
    if (args.hasOwnProperty('parentpage')) {
        //专题库人员管理链接过来的， 给返回url重新复制
        $("#cancel_person").attr("href", "/html/information_manager/project_library/project_person_manage.html?isId=" + args.isId);
    }
    //获取人员详细信息
    urlrelated.requestBody.data = {
        "RYBH": args.personid
    };
    var loadingicon = layer.load(1, {
        shade: 0.3
    })
    $.ajax({
        url: urlrelated.getPersonInfoDetail,
        type: "post",
        async: true,
        data: JSON.stringify(urlrelated.requestBody),
        cache: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        timeout: 120000,
        success: function (res) {
            layer.close(loadingicon);
            if (res.status === 200) {
                result = JSON.parse(JSON.stringify(res.data));
                $("#SFZTXId").attr("src", res.data.SFZTX || "/img/card-img.png");
                //人员标签
                if (res.data.Mark != null && res.data.Mark != "") {
                    var rybqarr = res.data.Mark.split(',');
                    var rablestr = "";
                    $(rybqarr).each(function (i, item) {
                        var dic = item.split('_');
                        rablestr += dic[1] + ",";
                    });
                    rablestr = rablestr.substring(0, rablestr.length - 1);
                    $("#RYBQ").text(rablestr || "-");
                } else {
                    $("#RYBQ").text("-");
                }
                RenderDataVal($("body"), "", result);
                RenderDataText($("body"), "", result);
                $("#ZJBZ").text() == "有证" && $("#ZJBZ").css("color", "green");
                $("#ZJBZ").text() == "无证" && $("#ZJBZ").css("color", "red");
            } else {
                top.layer.msg("获取详情失败！请重试！");
                location.href = "./person.html";
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loadingicon);
            extension.errorMessage(errorThrown);
        }
    })
});

//鼠标滑过显示文本信息
$(".textoverflow").hover(function () {
    if ($(this).width() < $(this)[0].scrollWidth) {
        var text = $(this).text();
        $(this).attr("title", text);
    }
});

function RenderDataVal(body, idpre, result) {
    $.each(result, function (item, val) {
        if ($("#" + idpre + item).hasClass("select")) {
            var select = 'dd[lay-value=' + val + ']';
            $("#" + idpre + item).next("div.layui-form-select").find('dl').find(select).click();
        } else {
            body.find("#" + idpre + item).val(val || "-");//给弹出层页面赋值，id为对应弹出层表单id
        }
    });
}
function RenderDataText(body, idpre, result) {
    $.each(result, function (item, val) {
        if (!$("#" + idpre + item).hasClass("select")) {
            body.find("#" + idpre + item).text(val || "-");//给弹出层页面赋值，id为对应弹出层表单id
            if (item == "ZJHM") {
                if (result["ZJLX"] == "无证件") {
                    body.find("#" + idpre + item).text("-");
                }
            }
        }
    });
}

function GetRequest(url) {
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
