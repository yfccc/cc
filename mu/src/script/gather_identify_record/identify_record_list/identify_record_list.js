layui.use(['laydate', 'table', 'element', 'form', 'urlrelated', 'extension'], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        element = layui.element,
        layer = layui.layer,
        form = layui.form,
        extension = layui.extension,
        beginDate = "",
        endDate = "",
        xbdb = [],
        table = layui.table,
        userInfo = extension.getUserInfo(),
        dropDownList = extension.getDropDownList(),
        tabId = 0,
        pagepower = extension.getPagePower("核查记录");
        
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
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    var tab0QueryBody, tab1QueryBody;
    var cardGenreOption = "",
        nationalityOption = "",
        dataSourceOption = "",
        genderOption = "",
        personClassification = "",
        ethnicOption = "",
        identifyResult = "",
        checkResult = "",
        imNameList = "";
    xbdb = dropDownList.xbList;
    //证件类型
    cardGenreOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.zjlxList, function (i, e) {
        cardGenreOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='sfxxcjCyzjCyzjdm']").html(cardGenreOption);
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
    $("select[name='sfxxcjXbdm']").html(genderOption);
    //人员分类
    personClassification += '<option value="" selected>请选择</option>';
    $.each(dropDownList.ryflList, function (i, e) {
        personClassification += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='sfxxcjRyfl']").html(personClassification);
    //民族
    ethnicOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.mzList, function (i, e) {
        ethnicOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='sfxxcjMzdm']").html(ethnicOption);
    //国籍
    nationalityOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.gjList, function (i, e) {
        nationalityOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='sfxxcjGjdm']").html(nationalityOption);
    //识别结果
    identifyResult += '<option value="" selected>请选择</option>';
    $.each(dropDownList.sbjgList, function (i, e) {
        identifyResult += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#identify_result").html(identifyResult);
    //核验结果
    checkResult += '<option value="" selected>请选择</option>';
    $.each(dropDownList.hyjgList, function (i, e) {
        checkResult += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#check_result").html(checkResult);
    //人员标签
    imNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.imNameList, function (i, e) {
        imNameList += '<option value="' + e.imName + '">' + e.imName + '</option>';
    });
    $("select[name='imName']").html(imNameList);
    form.render("select");

    //重置
    $("#check_btn_reset,#verify_btn_reset").on('click', function () {
        var resetstr = $(this).data("reset");
        if (resetstr == "verify") {
            $("#verify_form")[0].reset();
        } else if (resetstr == "check") {
            $("#check_form")[0].reset();
        }
        beginDate = "";
        endDate = "";
        form.render();
    });

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var curDateTime = year;
    if (month > 9)
        curDateTime = curDateTime + "-" + month;
    else
        curDateTime = curDateTime + "-0" + month;
    if (date > 9)
        curDateTime = curDateTime + "-" + date;
    else
        curDateTime = curDateTime + "-0" + date;

    //日期范围
    var timeRange = laydate.render({
        elem: '#infoverify_date',
        range: '~',
        trigger: "click",
        max: 0,
        theme: '#2F4056', //设置主题颜色
        done: function (value, date, enddat) {
            if (typeof value === "string" && value != "") {
                var arr = value.split('~');
                beginDate = arr[0];
                endDate = arr[1];
            } else {
                beginDate = "";
                endDate = "";
            }
            //  if(isIE89()){
            //      if(value !== ""){
            //          $(".dateSpan").css("display","none")
            //      }
            //      if(value == ""){
            //          $(".dateSpan").css("display","block")
            //      }
            //  }
        }
    });
    var timeRange1 = laydate.render({
        elem: '#infocheck_date',
        range: '~',
        trigger: "click",
        max: 'd',
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
            //         $(".dateSpan").css("display", "none")
            //     }
            //     if (value == "") {
            //         $(".dateSpan").css("display", "block")
            //     }
            // }
        }
    });

    //组织机构点击 查验
    $("#select_org_check").on("click", function () {
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
                $("#jgxxGajgjgdm_check").val(org[0].treeId);
                $("#jgxxGajgjgname_check").val(org[0].title);
                layer.close(index);
            },
            btn2: function (index, layero) {

            },
            success: function (layero, index) {

            }
        });
    });

    //组织机构点击 核验
    $("#select_org_verify").on("click", function () {
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
                $("#jgxxGajgjgdm_verify").val(org[0].treeId);
                $("#jgxxGajgjgname_verify").val(org[0].title);
                layer.close(index);
            },
            btn2: function (index, layero) {

            },
            success: function (layero, index) {

            }
        });
    });

    urlrelated.requestBody.data = {
        "sjsjStart": "",
        "sjsjEnd": "",
        "sfxxcjCyzjCyzjdm": "",
        "sfxxcjCyzjZjhm": "",
        "sfxxcjXm": "",
        "sfxxcjXbdm": "",
        "sfxxcjRyfl": "",
        "imName": "",
        "sfxxcjGjdm": "",
        "sfxxcjMzdm": "",
        "hmcjDlyhXm": "",
        "hmcjCjbh": "",
        "deviceSn": "",
        "hmsbPpjgbdm": "",
        "platform": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
    };
    function addCYTable(tab_id, requestData) {
        //tabId 代表当前tab页 tab_id 代表点击的那个tab页
        tabId == 0 ? tab0QueryBody = urlrelated.requestBody.data : tab1QueryBody = urlrelated.requestBody.data;

        tabId = tab_id;
        switch (tab_id) {
            case 0:
                urlrelated.requestBody.data = tab0QueryBody || {
                    "sjsjStart": "",
                    "sjsjEnd": "",
                    "sfxxcjCyzjCyzjdm": "",
                    "sfxxcjCyzjZjhm": "",
                    "sfxxcjXm": "",
                    "sfxxcjXbdm": "",
                    "sfxxcjRyfl": "",
                    "imName": "",
                    "sfxxcjGjdm": "",
                    "sfxxcjMzdm": "",
                    "hmcjDlyhXm": "",
                    "hmcjCjbh": "",
                    "deviceSn": "",
                    "hmsbPpjgbdm": "",
                    "platform": "",
                    "userJGDM": userInfo.userJGDM,
                    "queryType": pagepower.queryType,
                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                };
                table.render({
                    elem: '#identify_tab',
                    defaultToolbar: ['filter'],
                    url: urlrelated.idenifyRecord,
                    method: 'post',
                    toolbar: "#download",
                    contentType: "application/json;charset=UTF-8",
                    where: requestData,
                    limits: [10, 20, 30],
                    even: true,
                    cols: [
                        [{
                            field: 'cjsj',
                            width: 180,
                            title: '查验时间'
                        }, {
                            field: 'jgxxGajgjgmc',
                            minWidth: 190,
                            title: '组织机构名称'
                        }, {
                            field: 'sfxxcjXm',
                            width: 120,
                            title: '姓名'
                        }, {
                            field: 'xb',
                            width: 80,
                            title: '性别'
                        }, {
                            field: 'csrq',
                            width: 110,
                            title: '出生日期',
                            hide: true
                        }, {
                            field: 'gj',
                            width: 80,
                            title: '国籍'
                        }, {
                            field: 'mz',
                            minWidth: 80,
                            title: '民族'
                        }, {
                            field: 'zjdm',
                            width: 125,
                            title: '证件类型'
                        }, {
                            field: 'sfxxcjCyzjZjhm',
                            width: 180,
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
                            minWidth: 180,
                            title: '人员分类'
                        }, {
                            field: 'hmcjCjbh',
                            width: 260,
                            title: '采集编号'
                        }, {
                            field: 'sfxxcjLxdh1',
                            minWidth: 120,
                            title: '手机号',
                            hide: true
                        }, {
                            field: 'userRealname',
                            width: 140,
                            title: '操作人'
                        }, {
                            field: 'sjly',
                            minWidth: 110,
                            title: '数据来源'
                        }, {
                            field: 'deviceSn',
                            width: 110,
                            title: '设备SN码'
                        }, {
                            field: 'deviceManufacturer',
                            minWidth: 170,
                            title: '设备厂商名称'
                        }, {
                            field: 'hmcjCjcdmc',
                            width: 80,
                            title: '采集场地类型',
                            hide: true
                        }, {
                            field: 'hmcjCjsbwzXzb',
                            width: 170,
                            title: '坐标（经度，纬度）',
                            templet: function (row) {
                                var xz = row.hmcjCjsbwzXzb || "-";
                                var yz = row.hmcjCjsbwzYzb || "-";
                                return xz + "," + yz;
                            },
                            hide: true
                        }, {
                            field: 'isName',
                            width: 80,
                            title: '专题库',
                            hide: true
                        }, {
                            field: 'sbjg',
                            width: 120,
                            title: '识别结果',
                            templet: function (row) {
                                if (row.sbjg === null) {
                                    return "";
                                } else if (row.sbjg === "比中") {
                                    return '<span style="color:green;">' + row.sbjg + '</span>'
                                } else {
                                    return '<span style="color:red;">' + row.sbjg + '</span>'
                                }
                            }
                        }, {
                            field: 'imName',
                            width: 120,
                            title: '人员标签'
                        }

                        ]
                    ],
                    loading: true,
                    page: true,
                    response: {
                        statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                    },
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
                break;
            case 1:

                urlrelated.requestBody.data = tab1QueryBody || {
                    "sjsjStart": "",
                    "sjsjEnd": "",
                    "sfxxcjCyzjCyzjdm": "",
                    "sfxxcjCyzjZjhm": "",
                    "sfxxcjXm": "",
                    "sfxxcjXbdm": "",
                    "sfxxcjRyfl": "",
                    "imName": "",
                    "sfxxcjGjdm": "",
                    "sfxxcjMzdm": "",
                    "hmcjDlyhXm": "",
                    "hmcjCjbh": "",
                    "deviceSn": "",
                    "hmsbPpjgbdm": "",
                    "platform": "",
                    "userJGDM": userInfo.userJGDM,
                    "queryType": pagepower.queryType,
                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                };
                table.render({
                    elem: '#identify_tab',
                    defaultToolbar: ['filter'],
                    url: urlrelated.idenifyVerification,
                    method: 'post',
                    toolbar: "#download",
                    contentType: "application/json;charset=UTF-8",
                    where: requestData,
                    limits: [10, 20, 30],
                    cols: [
                        [{
                            field: 'cjsj',
                            width: 180,
                            title: '核验时间'
                        }, {
                            field: 'jgxxGajgjgmc',
                            minWidth: 190,
                            title: '组织机构名称'
                        }, {
                            field: 'sfxxcjXm',
                            width: 120,
                            title: '姓名'
                        }, {
                            field: 'xb',
                            width: 80,
                            title: '性别'
                        }, {
                            field: 'csrq',
                            width: 110,
                            title: '出生日期',
                            hide: true
                        }, {
                            field: 'gj',
                            width: 80,
                            title: '国籍'
                        }, {
                            field: 'mz',
                            width: 80,
                            title: '民族'
                        }, {
                            field: 'zjdm',
                            width: 100,
                            title: '证件类型'
                        }, {
                            field: 'sfxxcjCyzjZjhm',
                            width: 230,
                            title: '证件号',
                            templet: function (row) {
                                if (row.zjdm == "无证件") {
                                    return "-";
                                } else {
                                    return row.sfxxcjCyzjZjhm;
                                }
                            }
                        }, {
                            field: 'hyjg',
                            width: 120,
                            title: '核验结果',
                            templet: function (row) {
                                if (row.hyjg === null) {
                                    return "";
                                } else if (row.hyjg === "比中") {
                                    return '<span style="color:green;">' + row.hyjg + '</span>'
                                } else {
                                    return '<span style="color:red;">' + row.hyjg + '</span>'
                                }
                            }
                        }, {
                            field: 'sfxxcjZjbz',
                            width: 120,
                            title: '证件标志',
                            templet: function (row) {
                                if (row.sfxxcjZjbz === null) {
                                    return "";
                                } else if (row.sfxxcjZjbz === "无证件") {
                                    return '<span style="color:red;">' + row.sfxxcjZjbz + '</span>';
                                } else {
                                    return '<span style="color:green;">' + row.sfxxcjZjbz + '</span>';
                                }
                            },
                            hide: true
                        }, {
                            field: 'ryfl',
                            width: 100,
                            title: '人员分类'
                        }, {
                            field: 'hmcjCjbh',
                            width: 180,
                            title: '采集编号'
                        }, {
                            field: 'sfxxcjLxdh1',
                            width: 110,
                            title: '手机号',
                            hide: true
                        }, {
                            field: 'userRealname',
                            width: 140,
                            title: '操作人'
                        }, {
                            field: 'sjly',
                            width: 110,
                            title: '数据来源'
                        }, {
                            field: 'deviceSn',
                            width: 110,
                            title: '设备SN码'
                        }, {
                            field: 'deviceManufacturer',
                            minWidth: 170,
                            title: '设备厂商名称'
                        }, {
                            field: 'hmcjCjcdmc',
                            width: 80,
                            title: '核验点',
                            hide: true
                        }, {
                            field: 'hmcjCjsbwzXzb',
                            width: 170,
                            title: '坐标（经度，纬度）',
                            templet: function (row) {
                                var xz = row.hmcjCjsbwzXzb || "-";
                                var yz = row.hmcjCjsbwzYzb || "-";
                                return xz + "," + yz;
                            },
                            hide: true
                        }, {
                            field: 'isName',
                            width: 80,
                            title: '专题库',
                            hide: true
                        }, {
                            field: 'imName',
                            width: 120,
                            title: '人员标签'
                        }, {
                            toolbar: '#row_opt',
                            align: 'center',
                            fixed: 'right',
                            title: '操作'
                        }

                        ]
                    ],
                    page: true,
                    loading: true,
                    response: {
                        statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                    },
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
                break;
        }
    }

    table.on('tool(identify_tab_filter)', function (obj) {
        var $a = $(obj.tr[1]).find("a");
        $a.blur();
        if (obj.event === "compare") {
            var loadingicon = layer.load(1, {
                shade: 0.3
            });
            //查询该人员是否被删除
            urlrelated.requestBody.data = {
                "CJSBBH": obj.data.cjsbbh
            };
            $.ajax({
                url: urlrelated.idenfityCompare,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function (res) {
                    if (res.status === 200) {
                        layer.close(loadingicon);
                        if (res.data == 1) {
                            layer.open({
                                title: ['信息对比', 'color:rgb(121, 121, 121);'],
                                type: 2,
                                move: false,
                                area: ['800px', '550px'],
                                resize: false,
                                content: ['/html/gather_identify_record/identify_record_list/identify_record_list_contrast.html?RYBH=' + obj.data.cjsbbh, "no"],
                                btn: ['关闭'],
                                yes: function (index, layero) {
                                    layer.close(index);
                                }
                            });
                        } else {
                            layer.msg("该人员已删除！");
                        }
                    } else {
                        layer.close(loadingicon);
                        layer.msg(res.message || "获取对比信息失败！");
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
                },
                complete: function (XMLHttpRequest, textStatus) {
                    urlrelated.requestBody.data = tab1QueryBody || {
                        "sjsjStart": "",
                        "sjsjEnd": "",
                        "sfxxcjCyzjCyzjdm": "",
                        "sfxxcjCyzjZjhm": "",
                        "sfxxcjXm": "",
                        "sfxxcjXbdm": "",
                        "sfxxcjRyfl": "",
                        "imName": "",
                        "sfxxcjGjdm": "",
                        "sfxxcjMzdm": "",
                        "hmcjDlyhXm": "",
                        "hmcjCjbh": "",
                        "deviceSn": "",
                        "hmsbPpjgbdm": "",
                        "platform": "",
                        "userJGDM": userInfo.userJGDM,
                        "queryType": pagepower.queryType,
                        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                    };
                }
            });


        }
    });

    table.on('toolbar(identify_tab_filter)', function (obj) {
        var layEvent = obj.event;
        var urlstr;
        if (tabId == 0) {
            urlstr = urlrelated.exportIdenifyRecord;
        } else if (tabId == 1) {
            urlstr = urlrelated.exportIdenifyRecord1;
        }
        if (layEvent === "export") {
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
                    urlstr = urlstr + "/" + fieldstr;
                    $.ajax({
                        url: urlstr,
                        type: "post",
                        async: true,
                        timeout: 120000,
                        data: JSON.stringify(urlrelated.requestBody),
                        contentType: "application/json",
                        success: function (res) {
                            layer.close(loadingicon);
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

    //默认渲染第一个面板表格
    addCYTable(0, urlrelated.requestBody);

    element.on('tab(identify_tab_filter)', function (data) {
        addCYTable(data.index, urlrelated.requestBody);
    });

    form.on('submit(identify_submit)', function (obj) {
        //将开始结束时间写入参数
        obj.field["sjsjStart"] = beginDate;
        obj.field["sjsjEnd"] = endDate;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        //赋值给requestbody 导出用
        $.extend(urlrelated.requestBody.data, obj.field);
        table.reload('identify_tab', {
            where: {
                data: urlrelated.requestBody.data
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });
});

function RenderDataVal(body, idpre, result) {
    $.each(result, function (item, val) {
        if ($("#" + idpre + item).hasClass("select")) {
            var select = 'dd[lay-value=' + val + ']';
            $("#" + idpre + item).next("div.layui-form-select").find('dl').find(select).click();
        } else {
            body.find("#" + idpre + item).val(val); //给弹出层页面赋值，id为对应弹出层表单id
        }
    });
}

function RenderDataText(body, idpre, result) {
    $.each(result, function (item, val) {
        if (!$("#" + idpre + item).hasClass("select")) {
            body.find("#" + idpre + item).text(val); //给弹出层页面赋值，id为对应弹出层表单id
        }
    });
}

function ContrastData(body, orgresult, preresult) {
    $.each(orgresult, function (itemorg, valorg) {
        $.each(preresult, function (itempre, valpre) {
            if (itemorg == itempre && valorg != valpre) {
                body.find("#present_" + itempre).prev().addClass("change");
            }
        });
    });
}