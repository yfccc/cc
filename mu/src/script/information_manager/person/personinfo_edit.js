layui.use(["form", "laydate", "layer", "extension", "urlrelated"], function () {
    var form = layui.form,
        layer = layui.layer,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        laydate = layui.laydate
        , dropDownList = extension.getDropDownList()
        , userInfo = extension.getUserInfo()
        , args = extension.getRequestParams(location.search);
    $("body", parent.document).find('#sub-title').html('人员信息管理>编辑');
    form.render();
    var nationalityOption = ""
        , genderOption = ""
        , personClassification = ""
        , ethnicOption = "";
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
    //性别
    genderOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.xbList, function (i, e) {
        genderOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#bcjr_xb").html(genderOption);
    //人员分类
    personClassification += '<option value="" selected>请选择</option>';
    $.each(dropDownList.ryflList, function (i, e) {
        personClassification += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#ryfl").html(personClassification);
    //民族
    ethnicOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.mzList, function (i, e) {
        ethnicOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#bcjr_mz").html(ethnicOption);
    //国籍
    nationalityOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.gjList, function (i, e) {
        nationalityOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#bcjr_gj").html(nationalityOption);
    form.render('select');
    getPersonDetail();
    // laydate渲染
    var curDateTime = new Date();
    laydate.render({
        elem: '#birthday' //,type: 'date' //默认，可不填
        , btns: ['clear', 'confirm'] //显示清除和确认
        , trigger: 'click' //采用click弹出
        , max: 'curDateTime'
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value) {
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
    laydate.render({
        elem: '#YXQX'
        , range: '~'
        , max: 'curDateTime'
        , trigger: "click"
        , theme: '#2F4056'  //设置主题颜色
        , change: function (value, date, enddat) {

        }
        , done: function (value) {

            // if(isIE89()){
            //     if(value !== ""){
            //         $(".qssj").css("display","none")
            //     }
            //     if(value == ""){
            //         $(".qssj").css("display","block")
            //     }
            // }
        }
    });
    if (args.hasOwnProperty('RYBQ')) {
        //从人员标签链接过来
        $("#cancel_person").attr("href", "./person.html?RYBQ=" + args.RYBQ);
    }
    if (args.hasOwnProperty('parentpage')) {
        //人员管理连接过来的， 给返回url重新复制
        $("#cancel_person").attr("href", "/html/information_manager/project_library/project_person_manage.html");
    }
    function labelclick() {
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
        layer.open({
            title: '选择标签',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/information_manager/person/select_person_label.html?rybq=' + rybq, "no"],
            btn: ["确定", "取消"],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var labelHtml = iframeWin.sethtml() + '<div class="people_lable_item add_lable" style="width:32px;">+</div>';
                $(".personlabel").html(labelHtml);
                $(".personlabel span.layui-icon").on("click", function () {
                    $(this).parent().remove();
                });
                //再次绑定点击事件
                $(".add_lable").on("click", labelclick);
                layer.close(index);
            },
            success: function (layero, index) {

            }
        });
    };
    $(".add_lable").on("click", labelclick);

    var setval = function (data) {
        if (data != null) {
            $("#XM").val(data.XM);
            $("#ZJLX").text(data.ZJLX);
            data.ZJLX == "无证件" ? $("#ZJHM").text("-") : $("#ZJHM").text(data.ZJHM);
            $("#SJHM").val(data.lXDH);
            $("#QTLXDH").val(data.QTLXDH);
            $("#HJDZ").val(data.HJDZ);
            $("#QFJGMC").val(data.QFJGMC);
            if (data.ZJYXQX.indexOf("长期") > -1) {
                $("#YXQX").attr("disabled", true);
            }
            $("#YXQX").val(data.ZJYXQX);
            $("#BZ").val(data.CJBZ);
            $("#bcjr_xb").val(data.XBDM);
            $("#bcjr_gj").val(data.GJDM);
            $("#bcjr_mz").val(data.MZDM);
            $("#birthday").val(data.CSRQ);
            $("#ryfl").val(data.RYFL);
            $("#bcjr_bh").text(data.CJBH);
            $("#bcjr_cjr").text(data.CJR);
            $("#bcjr_cjd").text(data.CJDD);
            $("#bcjr_cjsj").text(data.CJSJ);
            $("#bcjr_xgyy").val(data.XGYY);
            $("#XJZDZ").val(data.XJZDZ);
            $("#ZJBZ").text(data.ZJBZ);
            $("#ZJBZ").text() == "有证" && $("#ZJBZ").css("color", "green");
            $("#ZJBZ").text() == "无证" && $("#ZJBZ").css("color", "red");
            $("#SFZTXID").attr("src", data.SFZTX || "/img/card-img.png");
            //人员标签根据返回数据拼接
            if (data.Mark != null && data.Mark != "") {
                var rybqarr = data.Mark.split(',');
                var rableHtml = "";
                $(rybqarr).each(function (i, item) {
                    var dic = item.split('_');
                    rableHtml += '<div class="people_lable_item"><span  class="imId"  imId=' + dic[0] + '>' + dic[1] + '</span><span class="layui-icon layui-icon-close"></span></div>'
                });
                var labelHtml = rableHtml + '<div class="people_lable_item add_lable" style="width:32px;">+</div>';
                $(".personlabel").html(labelHtml);
                //绑定事件
                $(".personlabel span.layui-icon").on("click", function () {
                    $(this).parent().remove();
                });
                $(".add_lable").on("click", labelclick);
            }
            form.render();
        }
    }
    function getPersonDetail() {
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        //获取人员详细信息
        urlrelated.requestBody.data = {
            "RYBH": args.personid
        };
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
                    setval(res.data);
                } else {
                    top.layer.msg("获取详情失败！请重试！");
                    location.href = "./person.html";
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(loadingicon);
                extension.errorMessage(errorThrown);
            }
        });
    }
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
        data.field["RYBH"] = args.personid;
        urlrelated.requestBody.data = data.field;

        $.ajax({
            url: urlrelated.editPersonInfoDetail,
            type: "post",
            dataType: "json",
            timeout: 120000,
            async: true,
            data: JSON.stringify(urlrelated.requestBody),
            contentType: "application/json",
            success: function (res) {
                layer.close(loadingicon);
                if (res.status === 200) {
                    top.layer.msg("修改成功！");
                    location.href = args.hasOwnProperty('RYBQ') ? "./person.html?RYBQ=" + args.RYBQ : "./person.html";
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
    form.verify({
        phonecustomize: function (value, item) {
            var pattern = /^1[3456789]\d{9}$/;
            if (value != "" && !pattern.test(value)) {
                return '请输入正确的手机号';
            }
        }
    })

    //鼠标滑过显示文本信息
    $(".textoverflow").hover(function () {
        if ($(this).width() < $(this)[0].scrollWidth) {
            var text = $(this).text();
            $(this).attr("title", text);
        }
    });
});