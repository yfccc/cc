layui.use(['element', 'laydate', 'table', 'form', 'urlrelated', 'extension'], function () {
    var laydate = layui.laydate,
        d = layui.device(),
        urlrelated = layui.urlrelated,
        table = layui.table,
        extension = layui.extension,
        $ = layui.$,
        beginDate = "",
        endDate = "",
        layer = layui.layer,
        form = layui.form,
        dropDownList = extension.getDropDownList(),
        userInfo = extension.getUserInfo(),
        pagepower = extension.getPagePower("人员信息管理");
    $("body", parent.document).find('#sub-title').html('专题库>人员管理');
    var args = extension.getRequestParams(location.search);
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    //日期范围
    var curDateTime = new Date();
    laydate.render({
        elem: '#test-laydate-range-date',
        range: '~',
        max: 'curDateTime',
        trigger: "click",
        theme: '#2F4056' //设置主题颜色
        ,
        done: function (value) {
            if (typeof value === "string" && value != "") {
                var arr = value.split('~');
                beginDate = arr[0];
                endDate = arr[1];
            } else {
                beginDate = "";
                endDate = "";
            }
            // if (isIE89()) {
            //     if (value !== "") {
            //         $(".qssj").css("display", "none")
            //     }
            //     if (value == "") {
            //         $(".qssj").css("display", "block")
            //     }
            // }
        }
    });

    var cardGenreOption = "",
        nationalityOption = "",
        dataSourceOption = "",
        imNameList = "",
        genderOption = "",
        personClassification = "",
        ethnicOption = "",
        isNameList = "",
        devicehome = "";
    //证件类型
    cardGenreOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.zjlxList, function (i, e) {
        cardGenreOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='ZJLXDM']").html(cardGenreOption);
    //数据源
    dataSourceOption += '<option value="" selected>请选择</option>';
    dataSourceOption += '<option value=""></option>'
    $.each(dropDownList.platformList, function (i, e) {
        dataSourceOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='platform']").html(dataSourceOption);
    //性别
    genderOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.xbList, function (i, e) {
        genderOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='XBDM']").html(genderOption);
    //人员分类
    personClassification += '<option value="" selected>请选择</option>';
    $.each(dropDownList.ryflList, function (i, e) {
        personClassification += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='RYFL']").html(personClassification);
    //民族
    ethnicOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.mzList, function (i, e) {
        ethnicOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='MZDM']").html(ethnicOption);
    //国籍
    nationalityOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.gjList, function (i, e) {
        nationalityOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='GJDM']").html(nationalityOption);
    //专题库
    isNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.isNameList, function (i, e) {
        if (e != null && typeof e != 'undefined')
            isNameList += '<option value="' + e.isName + '">' + e.isName + '</option>';
    });
    $("select[name='isName']").html(isNameList);
    //人员标签
    imNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.imNameList, function (i, e) {
        imNameList += '<option value="' + e.imName + '">' + e.imName + '</option>';
    });
    $("select[name='imName']").html(imNameList);
    //设备厂商
    devicehome += '<option value="" selected>请选择</option>';
    $.each(dropDownList.sbcsList, function (i, e) {
        devicehome += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='SBCS']").html(devicehome);
    form.render('select');

    urlrelated.requestBody.data = {
        "XM": "",
        "XBDM": "",
        "ZJLXDM": "",
        "ZJHM": "",
        "CZSSJ": "",
        "RYFL": "",
        "CZESJ": "",
        "ZTK": args.isId,
        "GJDM": "",
        "MZDM": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
    };
    //表格
    table.render({
        elem: '#project_person_manage_tab',
        url: urlrelated.getPersonInfoListBySpecial,
        toolbar: '#head_opt',
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        limits: [10, 20, 30],
        defaultToolbar: ['filter'],
        even: true,
        cols: [
            [{
                type: 'checkbox'
            }, {
                field: 'cjsj',
                width: 169,
                title: '采集时间'
            }, {
                field: 'xm',
                width: 120,
                title: '姓名'
            }, {
                field: 'ryfl',
                width: 172,
                title: '人员分类'
            }, {
                field: 'xbdm',
                minWidth: 160,
                title: '性别'
            }, {
                field: 'gj',
                minWidth: 147,
                title: '国籍'
            }, {
                field: 'mz',
                width: 110,
                title: '民族'
            }, {
                field: 'zjbz',
                width: 110,
                title: '证件标志',
                templet: function (row) {
                    if (row.zjbz == null) {
                        return "";
                    } else if (row.zjbz == "有证") {
                        return '<span style="color:green;">' + row.zjbz + '</span>';
                    } else {
                        return '<span style="color:red;">' + row.zjbz + '</span>';
                    }
                },
                hide: true
            }, {
                field: 'zjlx',
                width: 125,
                title: '证件类型'
            }, {
                field: 'zjhm',
                width: 181,
                title: '证件号'
            }, {
                field: 'csrq',
                width: 107,
                title: '出生日期',
                hide: true
            }, {
                field: 'tel',
                width: 124,
                title: '手机号',
                hide: true
            }, {
                field: 'hjdz',
                width: 250,
                title: '户籍地址',
                hide: true
            }, {
                field: 'CJRXM',
                width: 100,
                title: '采集人'
            }
                , {
                field: 'CJJG',
                width: 180,
                title: '采集机构'
            }
                , {
                field: 'SBCS',
                width: 180,
                title: '设备厂商'
            }
                , {
                field: 'platform',
                width: 120,
                title: '数据来源'
            }
                , {
                field: 'JRQY',
                width: 180,
                title: '接入企业'
            }, {
                field: 'hmxx',
                minWidth: 250,
                title: '虹膜信息'
            }, {
                toolbar: '#row_opt',
                align: 'center',
                fixed: 'right',
                width: 120,
                title: '操作'
            }]
        ],
        where: urlrelated.requestBody,
        loading: true,
        page: true,
        response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        },
        parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            if (res.status != 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": "暂无数据", //解析提示文本
                    "count": 0, //解析数据长度
                    "data": [] //解析数据列表
                }
            }
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.count, //解析数据长度
                "data": res.data.records //解析数据列表
            };
        },
        done: function () {
            var $table = $("#box_height").find(".layui-table-box");
            var height = parseInt($table.find(".layui-table-body").css("height"));
            $table.css("height", height + 38 + "px");
        }
    });

    table.on('tool(project_person_manage_tab_filter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        switch (layEvent) {
            case "see":
                location.href = "/html/information_manager/person/personinfo_see.html?type=" + layEvent + "&personid=" + data.rybh + "&parentpage=project_person_manage&isId=" + args.isId;
                break;
            case "del":
                layer.confirm('是否确定删除?', {
                    resize: false,
                    icon: 3,
                    title: '删除确认'
                },
                    function (index) {
                        var loadingicon = layer.load(1, {
                            shade: 0.3
                        })
                        var personMarkIdarr = [data.personMarkId];
                        //调用删除接口
                        urlrelated.requestBody.data = {
                            "userId": userInfo.userId,
                            "isId": args.isId,
                            "personSpecialIds": personMarkIdarr
                        };
                        $.ajax({
                            url: urlrelated.deletePersonSpecial,
                            type: "post",
                            dataType: "json",
                            timeout: 120000,
                            async: true,
                            data: JSON.stringify(urlrelated.requestBody),
                            contentType: "application/json",
                            success: function (res) {
                                layer.close(loadingicon);
                                if (res.status === 200) {
                                    top.layer.msg("删除成功！");
                                    urlrelated.requestBody.data = {
                                        "XM": "",
                                        "XBDM": "",
                                        "ZJLXDM": "",
                                        "ZJHM": "",
                                        "CZSSJ": "",
                                        "RYFL": "",
                                        "CZESJ": "",
                                        "ZTK": args.isId,
                                        "GJDM": "",
                                        "MZDM": "",
                                        "userJGDM": userInfo.userJGDM,
                                        "queryType": pagepower.queryType,
                                        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
                                    };
                                    table.reload('project_person_manage_tab', {
                                        page: {
                                            curr: 1 //重新从第 1 页开始
                                        }
                                    });
                                } else {
                                    layer.msg("删除失败！");
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                layer.close(loadingicon);
                                extension.errorMessage(errorThrown);
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                                layer.close(loadingicon);
                                urlrelated.requestBody.data = {
                                    "XM": "",
                                    "XBDM": "",
                                    "ZJLXDM": "",
                                    "ZJHM": "",
                                    "CZSSJ": "",
                                    "RYFL": "",
                                    "CZESJ": "",
                                    "ZTK": args.isId,
                                    "GJDM": "",
                                    "MZDM": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
                                };
                            }
                        });
                        layer.close(index);
                    });
                break;
        }
    });

    table.on('toolbar(project_person_manage_tab_filter)', function (obj) {
        var layEvent = obj.event;
        switch (layEvent) {
            case "opt_add":
                location.href = "./add_project_library_person.html?isId=" + args.isId;
                break;
            case "opt_del":
                //获取选中行
                var checkStatus = table.checkStatus(obj.config.id);
                var data = checkStatus.data;
                if (data.length <= 0) {
                    layer.msg("请选中要删除的行");
                } else {
                    layer.confirm('是否确定删除?', {
                        resize: false,
                        icon: 3,
                        title: '删除确认'
                    },
                        function (index) {
                            var loadingicon = layer.load(1, {
                                shade: 0.3
                            })
                            var personMarkIdarr = [];
                            $.each(data, function (i, e) {
                                personMarkIdarr.push(e.personMarkId);
                            });
                            //调用删除接口
                            urlrelated.requestBody.data = {
                                "userId": userInfo.userId,
                                "isId": args.isId,
                                "personSpecialIds": personMarkIdarr
                            };
                            $.ajax({
                                url: urlrelated.deletePersonSpecial,
                                type: "post",
                                dataType: "json",
                                timeout: 120000,
                                async: true,
                                data: JSON.stringify(urlrelated.requestBody),
                                contentType: "application/json",
                                success: function (res) {
                                    layer.close(loadingicon);
                                    if (res.status === 200) {
                                        top.layer.msg("删除成功！");
                                        urlrelated.requestBody.data = {
                                            "XM": "",
                                            "XBDM": "",
                                            "ZJLXDM": "",
                                            "ZJHM": "",
                                            "CZSSJ": "",
                                            "RYFL": "",
                                            "CZESJ": "",
                                            "ZTK": args.isId,
                                            "GJDM": "",
                                            "MZDM": "",
                                            "userJGDM": userInfo.userJGDM,
                                            "queryType": pagepower.queryType,
                                            "notifiedBody": pagepower.notifiedBody
                                        };
                                        table.reload('project_person_manage_tab', {
                                            page: {
                                                curr: 1 //重新从第 1 页开始
                                            }
                                        });
                                    } else {
                                        layer.msg("删除失败！");
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    layer.close(loadingicon);
                                    extension.errorMessage(errorThrown);
                                }
                            });
                            layer.close(index);
                        });
                }
                break;
        }
    });

    //查询
    form.on('submit(project_personman_filter)', function (obj) {
        //将开始结束时间写入参数
        obj.field["CZSSJ"] = beginDate;
        obj.field["CZESJ"] = endDate;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        table.reload('project_person_manage_tab', {
            where: {
                data: obj.field
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        })
    })

    //重置
    $("#project_personman_reset_btn").on('click', function () {
        beginDate = "";
        endDate = "";
        $("#project_personman_form")[0].reset();
        form.render();
    })

    // 左侧样式设置
    //   最开始小的左面menu显示
    $("#left_menu_big").removeClass("show");
    $("#left_menu_somre").addClass("show");
    $("#left_menu_big").addClass("none");
    $("#left_menu_somre").removeClass("none");

    function resize() {
        var width = $(window).width();
        //按钮自适应，解决调动
        var formWidth = $("#formDiv").width();
        $("#subDIV").css("margin-left", formWidth * 0.5 - 95);

        if (width < 1200) {
            $(".layui-form-label").css("width", 70);
            $(".layui-inline").css("margin-right", 0)
        } else {
            $(".layui-form-label").css("width", 100);
            $(".layui-inline").css("margin-right", 10)
        }
        //       下面的table
        if ($("#left_menu_big").is(".show")) {
            var widths = $("#left_menu_big").width();
            var bodwidths = $("body").width();
            var bodwidthss = parseInt(bodwidths - widths) - 60;

            $("#bottom_table").width(bodwidthss);
            $("#bottom_table").css({
                "margin-left": 303
            })
        }

        if ($("#left_menu_somre").is(".show")) {
            var width = $("#left_menu_somre").width();
            /*alert(width)*/
            var bodwidth = $("body").width();
            var bodwidth = parseInt(bodwidth - width) - 43;

            $("#bottom_table").width(bodwidth);
            $("#bottom_table").css({
                "margin-left": 55
            })
        }
    }

    resize();
    $(window).resize(function () {
        resize()
    });

    $("#go_back").on("click", function () {
        if (d.ie && d.ie < 10) {
            parent.$(".letMenuA").each(function () {
                if ($(this).attr("modelid") == "47") {
                    parent.$("iframe").attr("src", $(this).attr("thisHref"));
                }
            })
        } else {
            $(this).attr("href", "./project_library.html");
            $(this).click();
        }
    })

    $("#left_menu_btn_big").click(function () {
        $("#left_menu_big").removeClass("show");
        $("#left_menu_somre").addClass("show");
        $("#left_menu_big").addClass("none");
        $("#left_menu_somre").removeClass("none");
        if ($("#left_menu_somre")) {
            var width = $("#left_menu_somre").width();
            var bodwidth = $("body").width();
            var bodwidth = parseInt(bodwidth - width) - 43;
            $("#bottom_table").width(bodwidth);
            $("#bottom_table").css({
                "margin-left": 55
            })
        }
    });
    $("#left_menu_btn_somre").click(function () {
        $("#bcjr_zjhm").val("");
        $("#left_menu_big").addClass("show");
        $("#left_menu_somre").removeClass("show");
        $("#left_menu_big").removeClass("none");
        $("#left_menu_somre").addClass("none");
        if ($("#left_menu_big")) {
            var widths = $("#left_menu_big").width();
            var bodwidths = $("body").width();
            var bodwidthss = parseInt(bodwidths - widths) - 63;
            $("#bottom_table").width(bodwidthss);
            $("#bottom_table").css({
                "margin-left": 298

            })
        }
    });

    //    弹窗大小
    var iris_width, iris_height;
    var wiodeWidth = $(window).width();
    if (wiodeWidth < 1130) {
        iris_width = 1020 + "px", iris_height = 670 + "px"
    } else {
        iris_width = 1255 + "px", iris_height = 730 + "px"
    }

    $("#test_add_person").on("click", function () {
        layer.open({
            title: '新增专题库人员',
            type: 2,
            move: false,
            area: [iris_width, iris_height],
            resize: false,
            content: ['/html/information_manager/project_library/add_project_library_person.html', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                alert("新增专题库人员");
            },
            btn2: function (index, layero) {
                //按钮【按钮一】的回调
                alert("退出新增专题库人员");
            },
            success: function (layero, index) {
                // var iframeWin = window[layero.find('iframe')[0]['name']];
                // var  objbiaoqian =  iframeWin.document.getElementById("Biometrics")
                // $(objbiaoqian).height(169)
                // //erorr提示框宽度
                // var  tishi =  iframeWin.document.getElementById("tishi")
                // $(tishi).width(480)
                // var  Biometrics =  iframeWin.document.getElementById("Biometrics")
                // $(Biometrics).css("margin-top",0)
            }
        });
    });
});