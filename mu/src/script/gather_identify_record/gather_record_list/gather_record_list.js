layui.use(['element', 'laydate', 'table', 'form', 'urlrelated', 'extension'], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        table = layui.table,
        $ = layui.$,
        beginDate = "",
        endDate = "",
        extension = layui.extension,
        layer = layui.layer,
        form = layui.form,
        dropDownList = extension.getDropDownList(),
        userInfo = extension.getUserInfo(),
        pagepower = extension.getPagePower("采集记录");
    form.render();
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    location.hash = document.URL;
    $("#querytype").val(localStorage.getItem("querytypeItem"))

    // 循环生成结构
    function eachData(list, data) {
        var html = '<option value="">请选择</option>';
        $.each(data, function (i, item) {
            if (item.codeIndex != null && typeof item.codeIndex != "undefined" && item.codeIndex != "") {
                html += '<option value="' + item.codeIndex + '">' + item.codeName + '</option>'
            } else {
                html += '<option value="' + item.codeName + '">' + item.codeName + '</option>'
            }
        });
        list.html(html);

    }
    // 循环出上面的检索项的下拉选项
    eachData($("#bcjr_zjlx"), dropDownList.zjlxList);
    eachData($("#bcjr_xb"), dropDownList.xbList);
    eachData($("#bcjr_ryfl"), dropDownList.ryflList);
    eachData($("#bcjr_mz"), dropDownList.mzList);
    eachData($("#bcjr_gj"), dropDownList.gjList);
    eachData($("#sjly"), dropDownList.platformList);
    eachData($("#cjjg"), dropDownList.cjjgList);
    eachData($("#cylx"), dropDownList.cylxList);
    var imNameList = '<option value="" selected>请选择</option>';
    $.each(dropDownList.imNameList, function (i, e) {
        imNameList += '<option value="' + e.imName + '">' + e.imName + '</option>';
    });
    $("#yrbq").html(imNameList);
    form.render("select")
    //禁用启用日历确定按钮
    var disabledbtn = function (flag) {
        if (flag) {
            $(".laydate-footer-btns .laydate-btns-confirm").addClass("laydisabled");
            $(".laydate-footer-btns .laydate-btns-confirm").removeAttr("lay-type");
        } else {
            $(".laydate-footer-btns .laydate-btns-confirm").removeClass("laydisabled");
            $(".laydate-footer-btns .laydate-btns-confirm").attr("lay-type", 'confirm');
        }
    }
    var curDateTime = new Date();
    //日期范围
    var timeRange = laydate.render({
        elem: '#test-laydate-range-date',
        range: '~',
        max: 'curDateTime',
        trigger: "click",
        theme: '#2F4056' //设置主题颜色
        ,
        change: function (value, date, enddat) {
            timeRange.showBottom = false;
            if (date > enddat) {
                timeRange.hint("开始日期不能大于结束日期");
                disabledbtn(true);

            } else if (date.year != enddat.year || date.month != enddat.month) {
                timeRange.hint("开始结束日期的月份必须相同");
                disabledbtn(true);
            } else {
                disabledbtn(false);
            }
            laydate.render
        },
        done: function (value) {
            if (typeof value === "string" && value != "") {
                var arr = value.split('~');
                beginDate = arr[0];
                endDate = arr[1];
            } else {
                beginDate = "";
                endDate = "";
            }
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

    //组织机构点击
    $("#select_org").on("click", function () {
        localStorage.setItem("currentOrgCodeTree", userInfo.userJGDM);
        localStorage.setItem("chirdOrgCodeTree", "-1");
        localStorage.setItem("queryTypeTree", userInfo.querytypeItem);
        localStorage.setItem("orgListQueryTypeEq4Tree", userInfo.models);
        layer.open({
            title: '选择机构',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/institutions/select_institutions.html?tree_type=single', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //获取选中的组织机构
                var org = iframeWin.getSelectOrg();
                $("#jgxxGajgjgdm").val(org[0].treeId);
                $("#jgxxGajgjgname").val(org[0].title);
                layer.close(index);
            },
            btn2: function (index, layero) {

            },
            success: function (layero, index) {

            }
        });
    });

    //表格
    function tablerender(requestData) {
        table.render({
            elem: '#gather_record_tab',
            url: urlrelated.gatherRecord,
            method: 'post',
            contentType: "application/json;charset=UTF-8",
            where: requestData,
            limits: [10, 20, 30],
            toolbar: "#download",
            defaultToolbar: ['filter'],
            even: true,
            cols: [
                [{
                    field: 'cjsj',
                    minWidth: 180,
                    title: '采集时间'
                }, {
                    field: 'jgxxGajgjgmc',
                    minWidth: 190,
                    title: '组织机构名称'
                }, {
                    field: 'sfxxcjXm',
                    minWidth: 100,
                    title: '姓名'
                }, {
                    field: 'xb',
                    minWidth: 80,
                    title: '性别'
                }, {
                    field: 'csrq',
                    minWidth: 150,
                    title: '出生日期',
                    hide: true
                }, {
                    field: 'gj',
                    minWidth: 110,
                    title: '国籍'
                }, {
                    field: 'mz',
                    minWidth: 60,
                    title: '民族'
                }, {
                    field: 'zjdm',
                    minWidth: 110,
                    title: '证件类型'
                }, {
                    field: 'sfxxcjCyzjZjhm',
                    minWidth: 210,
                    title: '证件号',
                    templet: function (row) {
                        if (row.zjdm == "无证件") {
                            return "-";
                        } else {
                            return row.sfxxcjCyzjZjhm;
                        }
                    }
                }, {
                    field: 'ryfl',
                    minWidth: 110,
                    title: '人员分类'
                }, {
                    field: 'hmcjCjbh',
                    minWidth: 280,
                    title: '采集编号'
                }, {
                    field: 'sfxxcjLxdh1',
                    minWidth: 150,
                    title: '手机号',
                    hide: true
                }, {
                    field: 'userRealname',
                    minWidth: 140,
                    title: '操作人'
                }, {
                    field: 'sjly',
                    minWidth: 110,
                    title: '数据来源'
                }, {
                    field: 'deviceSn',
                    minWidth: 150,
                    title: '设备SN码'
                }, {
                    field: 'deviceManufacturer',
                    minWidth: 170,
                    title: '设备厂商名称'
                }, {
                    field: 'hmcjCjcdmc',
                    minWidth: 150,
                    title: '采集场地类型',
                    hide: true
                }, {
                    field: 'hmcjCjsbwzXzb',
                    minWidth: 170,
                    title: '坐标（经度，纬度）',
                    templet: function (row) {
                        var xz = row.hmcjCjsbwzXzb || "-";
                        var yz = row.hmcjCjsbwzYzb || "-";
                        return xz + "," + yz;
                    },
                    hide: true
                }, {
                    field: 'cjjg',
                    minWidth: 150,
                    title: '采集结果',
                    templet: function (row) {
                        if (row.cjjg == null) {
                            return "";
                        } else if (row.cjjg == "采集成功") {
                            return '<span style="color:green;">' + row.cjjg + '</span>';
                        } else {
                            return '<span style="color:red;">' + row.cjjg + '</span>';
                        }
                    }
                }, {
                    field: 'hmcjPpjgbms',
                    minWidth: 150,
                    title: '采集结果描述',
                    hide: true
                }, {
                    field: 'imName',
                    minWidth: 260,
                    title: '人员标签'
                }, {
                    field: 'cylx',
                    minWidth: 150,
                    title: '存疑类型',
                    templet: function (row) {
                        if (row.cylx == null) {
                            return "";
                        } else if (row.cylx == "正常") {
                            return '<span style="color:green;">' + row.cylx + '</span>';
                        } else {
                            return '<span style="color:red;">' + row.cylx + '</span>';
                        }
                    }
                }]
            ],
            done: function (res, curr, count) {

            },
            loading: true,
            response: {
                statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
            },
            page: true,
            parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                if (res.status != 200) {
                    return {
                        "code": res.status, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": 0, //解析数据长度
                        "data": [] //解析数据列表
                    }
                }
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.data.count, //解析数据长度
                    "data": res.data.data //解析数据列表
                };
            }
        });
    }

    urlrelated.requestBody.data = {
        "sjsjStart": "",
        "sjsjEnd": "",
        "sfxxcjCyzjCyzjdm": "",
        "sfxxcjCyzjZjhm": "",
        "sfxxcjXm": "",
        "sfxxcjXbdm": "",
        "sfxxcjRyfl": "",
        "sfxxcjGjdm": "",
        "sfxxcjMzdm": "",
        "hmcjDlyhXm": "",
        "hmcjCjbh": "",
        "hmcjPpjgbbz": "",
        "deviceSn": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
    };

    tablerender(urlrelated.requestBody);

    //重置表单
    $("#gather_record_btn_reset").on('click', function () {
        $("#gather_record_form")[0].reset();
        beginDate = "";
        endDate = "";
        $("#cards").val("");
        form.render();
    });

    // 点击查询
    form.on("submit(gather_record_filter)", function (obj) {
        //获取左边栏的身份证号
        var idcards = $("#cards").val();
        //var idarrs = idcards.split('\n');
        obj.field["sfxxcjCyzjZjhm"] = idcards;
        //将开始结束时间写入参数
        obj.field["sjsjStart"] = beginDate;
        obj.field["sjsjEnd"] = endDate;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        //赋值给requestbody 导出用
        $.extend(urlrelated.requestBody.data, obj.field);
        table.reload('gather_record_tab', {
            where: {
                data: urlrelated.requestBody.data
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });

    table.on('toolbar(gather_record_tab_filter)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === "download") {
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            if (obj.config.page.count > 0) {
                var fieldstr = "";
                //拼接字段
                var colarr = obj.config.cols[0] || [];
                $.each(colarr, function (index, item) {
                    fieldstr += item.hide ? "" : item.field + ",";
                });
                if (fieldstr != "") {
                    fieldstr = fieldstr.substring(0, fieldstr.length - 1);
                    var urlstr = urlrelated.exportGatherRecords + "/" + fieldstr;
                    var gatherRecordAjax = $.ajax({
                        url: urlstr,
                        type: "post",
                        async: true,
                        timeout: 120000,
                        data: JSON.stringify(urlrelated.requestBody),
                        contentType: "application/json",
                        success: function (res) {
                            layer.close(loadingicon);
                            var c = gatherRecordAjax;
                            if (res.status === 200) {
                                var $a = $("<a></a>");
                                $a.attr("download", "");
                                $a.attr("href", urlrelated.downloadUrlPre + res.data.fileName);
                                $("body").append($a);
                                $a[0].click();
                                $a.remove();
                            } else {
                                layer.msg(res.message);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(errorThrown);
                        },
                        complete: function (xhr, status) {
                            layer.close(loadingicon);
                            // if (status == 'timeout') {
                            //     gatherRecordAjax.abort();
                            // }
                        }
                    });
                } else {
                    layer.close(loadingicon);
                    layer.msg("请选中要导出的列");
                }
            } else {
                layer.close(loadingicon);
                layer.msg("暂无数据");
            }
        }
    });

    // 左侧样式设置
    function resize() {
        var width = $(window).width();
        //按钮自适应，解决调动
        var formWidth = $("#formDiv").width();
        $("#subDIV").css("margin-left", formWidth * 0.5 - 95);
        //下面的table
        if ($("#big").is(":visible")) {
            // var tableWidth = $("#bottom_content").width() * 0.805;
            // $("#bottom_table").css("width", tableWidth)
            var tableWidth = $("#bottom_content").width() - 313;
            $("#bottom_table").css("width", tableWidth + "px");
        }
        if ($("#smor").is(":visible")) {
            var tableWidth = $("#bottom_content").width() - 63;
            $("#bottom_table").css("width", tableWidth + "px");
        }
    }

    $(window).resize(function () {
        resize();
    });
    $(".left-menu-p-big").addClass("none");
    resize();

    $("#left_menu_big").click(function () {
        $(this).parents(".left-menu").addClass("none");
        $(".left-menu-p-smor").removeClass("none");
        $(".left-menu-p-smor").addClass("show");
        var tableWidth = $("#bottom_content").width() - 63;
        $("#bottom_table").css("width", tableWidth + "px");
        $("#bottom_table").css("left", 52 + "px");
    });


    $("#left_menu_somre").click(function () {
        var tableWidth = $("#bottom_content").width() - 313;
        $("#bottom_table").css("width", tableWidth + "px");
        $("#bottom_table").css("left", 302 + "px");
        $(this).parents(".left-menu").addClass("none");
        $(".left-menu-p-big").removeClass("none");
        $(".left-menu-p-big").addClass("show");
    })
});