layui.use(['form', 'layer', 'extension', 'urlrelated'], function () {
    var form = layui.form,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        layer = layui.layer;
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    //获取参数
    var args = extension.getRequestParams(location.search);
    urlrelated.requestBody.data = {
        "CJSBBH": args.RYBH
    };
    //结果填写到页面
    function setVal(arr) {
        //原始信息
        $("#original_name").text(arr[0].xm || "-");
        $("#original_type").text(arr[0].cyzjCyzjdm || "-");
        $("#original_number").text(arr[0].cyzjCyzjdm == "无证件" ? "-" : arr[0].cyzjZjhm || "-");
        $("#original_gender").text(arr[0].xbdm || "-");
        $("#original_birthday").text(arr[0].xcsrq || "-");
        $("#original_nationality").text(arr[0].gjdm || "-");
        $("#original_nation").text(arr[0].mzdm || "-");
        $("#original_address").text(arr[0].hjdzDzmc || "-");
        $("#original_authority").text(arr[0].qfjgmc || "-");
        $("#original_imageCard").attr("src", (arr[0].zpdz == "" || arr[0].zpdz == null) ? "/img/card-img.png" : "data:image/jpeg;base64," + arr[0].zpdz);
        //对比信息
        $("#present_name").text(arr[1].sfxxcjXm || "-");
        $("#present_type").text(arr[1].sfxxcjCyzjCyzjdm || "-");
        $("#present_number").text(arr[1].sfxxcjCyzjCyzjdm == "无证件" ? "-" : arr[1].sfxxcjCyzjZjhm || "-");
        $("#present_gender").text(arr[1].sfxxcjXbdm || "-");
        $("#present_birthday").text(arr[1].csrq || "-");
        $("#present_nationality").text(arr[1].sfxxcjGjdm || "-");
        $("#present_nation").text(arr[1].sfxxcjMzdm || "-");
        $("#present_address").text(arr[1].sfxxcjHjdzDzmc || "-");
        $("#present_authority").text(arr[1].sfxxcjQfjg || "-");
        $("#present_imageCard").attr("src", (arr[1].sfxxcjZpdz == "" || arr[1].sfxxcjZpdz == null) ? "/img/card-img.png" : "data:image/jpeg;base64," + arr[1].sfxxcjZpdz);
        //元素id与数据对应数组
        var earr = ["present_name", "present_type", "present_number", "present_gender", "present_birthday", "present_nationality", "present_nation", "present_address", "present_authority"],
            orgarr = ["xm", "cyzjCyzjdm", "cyzjZjhm", "xbdm", "csrq", "gjdm", "mzdm", "hjdzDzmc", "qfjgmc"],
            nowarr = ["sfxxcjXm", "sfxxcjCyzjCyzjdm", "sfxxcjCyzjZjhm", "sfxxcjXbdm", "sfxxcjCsrq", "sfxxcjGjdm", "sfxxcjMzdm", "sfxxcjHjdzDzmc", "sfxxcjQfjg"];
        //比对值是否相同 修改样式
        $.each(earr, function (i, e) {
            if ($.trim(arr[0][orgarr[i]]) == $.trim(arr[1][nowarr[i]])) {
                //信息相同
            } else {
                if (e == "present_number") {
                    $.trim($("#present_number").text()) != $.trim($("#original_number").text()) && $("#present_number").prev().addClass("change");
                }
                else if (e == "present_birthday") { //出生日期特殊处理
                    $.trim($("#present_birthday").text()) != $.trim($("#original_birthday").text()) && $("#present_birthday").prev().addClass("change");
                }
                else {
                    $("#" + e).prev().addClass("change");
                }
            }
        });
    }
    var loadingicon = layer.load(1, {
        shade: 0.3
    })
    $.ajax({
        url: urlrelated.identifyCompare,
        type: "post",
        async: true,
        data: JSON.stringify(urlrelated.requestBody),
        cache: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (res) {
            if (res.status === 200) {
                setVal(res.data.data);
                layer.close(loadingicon);
            } else {
                layer.close(loadingicon);
                layer.msg("获取对比信息失败！");
                setTimeout(function () {
                    //关闭弹出框
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                }, 1000);

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loadingicon);
            extension.errorMessage(errorThrown);
        }
    })

    //鼠标滑过显示文本信息
    $(".layui-elip").hover(function () {
        if ($(this).width() < $(this)[0].scrollWidth) {
            var text = $(this).text();
            $(this).attr("title", text);
        }
    });
});