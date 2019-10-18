layui.use(['element', 'laydate', 'table', 'form', 'urlrelated', 'extension'], function () {
    var laydate = layui.laydate
        , element = layui.element
        , urlrelated = layui.urlrelated
        , table = layui.table
        , $ = layui.$
        , extension = layui.extension
        , beginDate = ""
        , endDate = ""
        , layer = layui.layer
        , form = layui.form
        , args = extension.getRequestParams(location.search)
        , dropDownList = extension.getDropDownList()
        , userInfo = extension.getUserInfo()
        , pagepower = extension.getPagePower("人员信息管理");
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
    $("body", parent.document).find('#sub-title').html('人员信息管理');
    urlrelated.requestBody.data = {
        "XM": "",
        "XBDM": "",
        "ZJLXDM": "",
        "ZJHM": "",
        "CZSSJ": "",
        "RYFL": "",
        "RYBQ": "",
        "CZESJ": "",
        "ZTK": "",
        "GJDM": "",
        "MZDM": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

    };
    if (args.hasOwnProperty('RYBQ')) {
        urlrelated.requestBody.data.RYBQ = args.RYBQ;
        $("#jumpback").show();
        //禁用人员标签选项
        $("#rybqdiv").css("display", "none");
    }
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"))

    var cardGenreOption = ""
        , nationalityOption = ""
        , imNameList = ""
        , genderOption = ""
        , personClassification = ""
        , ethnicOption = ""
        , isNameList = ""
        , uploadStatus = ""
        , dataSourceOption = ""
        , devicehome = "";
    //证件类型
    cardGenreOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.zjlxList, function (i, e) {
        cardGenreOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='ZJLXDM']").html(cardGenreOption);
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
            isNameList += '<option value="' + e.isId + '">' + e.isName + '</option>';
    });
    $("select[name='ZTK']").html(isNameList);
    //人员标签
    imNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.imNameList, function (i, e) {
        imNameList += '<option value="' + e.imId + '">' + e.imName + '</option>';
    });
    $("select[name='RYBQ']").html(imNameList);
    //上传状态
    uploadStatus += '<option value="" selected>请选择</option>';
    $.each(dropDownList.xzztList, function (i, e) {
        uploadStatus += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='uploadStatus']").html(uploadStatus);
    //数据源
    dataSourceOption += '<option value="" selected>请选择</option>';
    dataSourceOption += '<option value=""></option>'
    $.each(dropDownList.platformList, function (i, e) {
        dataSourceOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='platform']").html(dataSourceOption);
    //设备厂商
    devicehome += '<option value="" selected>请选择</option>';
    $.each(dropDownList.sbcsList, function (i, e) {
        devicehome += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='SBCS']").html(devicehome);
    form.render('select');



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
    laydate.render({
        elem: '#test-laydate-range-date'
        , range: '~'
        , trigger: "click"
        , max: curDateTime
        , theme: '#2F4056'  //设置主题颜色
        , done: function (value) {
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

    $.extend(urlrelated.requestBody, {
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
    });
    table.render({
        elem: '#person_tab'

        , url: urlrelated.getPersonInfoList
        , method: 'post'
        , contentType: "application/json;charset=UTF-8"
        , where: urlrelated.requestBody
        , toolbar: '#bar_head'
        , limits: [10, 20, 30]
        , defaultToolbar: ['filter']
        , even: true
        , cols: [[
            { type: 'checkbox' }
            , { field: 'CJSJ', width: 180, title: '采集时间' }
            , { field: 'XM', width: 120, title: '姓名' }
            , { field: 'RYFL', width: 180, title: '人员分类' }
            , { field: 'RYBQ', width: 180, title: '人员标签' }
            , { field: 'ZTK', width: 180, title: '专题库' }
            , { field: 'XBDM', width: 170, title: '性别' }
            , { field: 'GJ', width: 120, title: '国籍' }
            , { field: 'MZ', width: 110, title: '民族' }
            , {
                field: 'ZJBZ', width: 110, title: '证件标志', templet: function (row) {
                    if (row.ZJBZ === null) {
                        return "";
                    } else if (row.ZJBZ === "有证") {
                        return '<span style="color:green;">' + row.ZJBZ + '</span>'
                    } else {
                        return '<span style="color:red;">' + row.ZJBZ + '</span>'
                    }
                }
            }
            , { field: 'ZJLX', width: 120, title: '证件类型' }
            , {
                field: 'ZJHM', width: 180, title: '证件号',
                templet: function (row) {
                    if (row.ZJLX == "无证件") {
                        return "-";
                    } else {
                        return row.ZJHM;
                    }
                }
            }
            , { field: 'CJRXM', width: 100, title: '采集人' }
            , { field: 'CJJG', width: 180, title: '采集机构' }
            , { field: 'SBCS', width: 180, title: '设备厂商' }
            , { field: 'platform', width: 120, title: '数据来源' }
            , { field: 'JRQY', width: 180, title: '接入企业' }
            , { field: 'HMXX', width: 124, title: '虹膜信息', hide: true }
            , {
                field: 'uploadStatue', width: 120, title: '上传状态', templet: function (row) {
                    if (row.uploadStatue === null) {
                        return "";
                    } else if (row.uploadStatue === "已上传") {
                        return '<span style="color:green;">' + row.uploadStatue + '</span>'
                    } else if (row.uploadStatue === "未上传") {
                        return '<span>' + row.uploadStatue + '</span>'
                    } else if (row.uploadStatue === "上传失败") {
                        return '<span style="color:red;">' + row.uploadStatue + '</span>'
                    } else {
                        return row.uploadStatue;
                    }
                }
            }
            , { field: 'uploadResult', width: 120, title: '上传结果', hide: true }
            , { field: 'uploadDate', width: 180, title: '上传时间', hide: true }
            , { minWidth: 180, align: 'center', fixed: 'right', toolbar: '#barDemo', title: '操作' }
        ]]
        , page: true
        , loading: true
        , response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        }
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
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
        }
    });

    form.on("submit(person_filter)", function (obj) {
        //将开始结束时间写入参数
        obj.field["CZSSJ"] = beginDate;
        obj.field["CZESJ"] = endDate;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        if (args.hasOwnProperty('RYBQ')) {
            obj.field["RYBQ"] = args.RYBQ
        }

        //赋值给requestbody 导出用
        $.extend(urlrelated.requestBody.data, obj.field);
        table.reload('person_tab', {
            where: {
                data: urlrelated.requestBody.data
            }, page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });

    //重置
    $("#person_reset_btn").on('click', function () {
        $("#person_form")[0].reset();
        beginDate = "";
        endDate = "";
        form.render();
    })

    // 监听行内按钮点击事件
    table.on('tool(person_tab_filter)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent == "del") {
            layer.confirm('是否确定删除?', { resize: false, icon: 3, title: '删除确认' },
                function (index) {
                    layer.close(index);
                    var loadingicon = layer.load(1, {
                        shade: 0.3
                    })
                    var urlstr;
                    //向服务端发送删除指令
                    if (args.hasOwnProperty('RYBQ')) {
                        //如果是人员标签转过来的，则更改删除调用的接口
                        urlstr = urlrelated.deletePersonLabel;
                        urlrelated.requestBody.data = {
                            "userId": userInfo.userId,
                            "imId": args.RYBQ,
                            "rybh": data.RYBH
                        }
                    } else {
                        urlstr = urlrelated.deletePersonInfo;
                        urlrelated.requestBody.data = {
                            "userId": userInfo.userId,
                            "RYBH": data.RYBH
                        };
                    }
                    $.ajax({
                        url: urlstr,
                        type: "post",
                        async: true,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        contentType: "application/json;charset=UTF-8",  //推荐写这个
                        dataType: "json",
                        success: function (res) {
                            layer.close(loadingicon);
                            if (res.status === 200) {
                                urlrelated.requestBody.data = {
                                    "XM": "",
                                    "XBDM": "",
                                    "ZJLXDM": "",
                                    "ZJHM": "",
                                    "CZSSJ": "",
                                    "RYFL": "",
                                    "RYBQ": "",
                                    "CZESJ": "",
                                    "ZTK": "",
                                    "GJDM": "",
                                    "MZDM": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

                                };
                                if (args.hasOwnProperty('RYBQ')) {
                                    urlrelated.requestBody.data.RYBQ = args.RYBQ;
                                }
                                table.reload('person_tab', {
                                    page: {
                                        curr: 1 //重新从第 1 页开始
                                    }
                                });
                                layer.msg(res.message);
                            } else {
                                layer.msg("删除失败！");
                            }
                        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(errorThrown);
                        }, complete: function (XMLHttpRequest, textStatus) {
                            layer.close(loadingicon);
                            urlrelated.requestBody.data.RYBH = "";
                            urlrelated.requestBody.data = {
                                "XM": "",
                                "XBDM": "",
                                "ZJLXDM": "",
                                "ZJHM": "",
                                "CZSSJ": "",
                                "RYFL": "",
                                "RYBQ": "",
                                "CZESJ": "",
                                "ZTK": "",
                                "GJDM": "",
                                "MZDM": "",
                                "userJGDM": userInfo.userJGDM,
                                "queryType": pagepower.queryType,
                                "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

                            };
                            if (args.hasOwnProperty('RYBQ')) {
                                urlrelated.requestBody.data.RYBQ = args.RYBQ;
                            }
                        }
                    });
                });
        } else if (layEvent == "edit") {
            location.href = "./personinfo_edit.html?type=" + layEvent + "&personid=" + data.RYBH + (args.hasOwnProperty('RYBQ') ? "&RYBQ=" + args.RYBQ : "");
        } else {
            location.href = "./personinfo_see.html?type=" + layEvent + "&personid=" + data.RYBH + (args.hasOwnProperty('RYBQ') ? "&RYBQ=" + args.RYBQ : "");
        }
    });

    //监听头部按钮
    table.on('toolbar(person_tab_filter)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        var data = checkStatus.data;
        switch (obj.event) {
            case 'updateToLibrary':
                var loadingicon = layer.load(1, {
                    shade: 0.3
                });
                // if (userInfo.userJGDM == "0") {
                //     layer.close(loadingicon);
                //     layer.msg("超级管理员暂不支持上传部级库");
                //     return;
                // }
                if (data.length > 0) {
                    var data = checkStatus.data;
                    var rybhs = [];
                    $.each(data, function (i, e) {
                        rybhs.push(e.RYBH);
                    })
                    urlrelated.requestBody.data = {
                        "userId": userInfo.userId,
                        "RYBH": rybhs
                    };
                    $.ajax({
                        url: urlrelated.uploadPersonInfo,
                        type: "post",
                        async: true,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        contentType: "application/json;charset=UTF-8",
                        dataType: "json",
                        success: function (res) {
                            layer.close(loadingicon);
                            if (res.status === 200) {
                                layer.msg(res.message);
                                urlrelated.requestBody.data = {
                                    "XM": "",
                                    "XBDM": "",
                                    "ZJLXDM": "",
                                    "ZJHM": "",
                                    "CZSSJ": "",
                                    "RYFL": "",
                                    "RYBQ": "",
                                    "CZESJ": "",
                                    "ZTK": "",
                                    "GJDM": "",
                                    "MZDM": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

                                };
                                if (args.hasOwnProperty('RYBQ')) {
                                    urlrelated.requestBody.data.RYBQ = args.RYBQ;
                                }
                                table.reload('person_tab', {
                                    page: {
                                        curr: 1 //重新从第 1 页开始
                                    }
                                });
                            } else {
                                urlrelated.requestBody.data = {
                                    "XM": "",
                                    "XBDM": "",
                                    "ZJLXDM": "",
                                    "ZJHM": "",
                                    "CZSSJ": "",
                                    "RYFL": "",
                                    "RYBQ": "",
                                    "CZESJ": "",
                                    "ZTK": "",
                                    "GJDM": "",
                                    "MZDM": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

                                };
                                if (args.hasOwnProperty('RYBQ')) {
                                    urlrelated.requestBody.data.RYBQ = args.RYBQ;
                                }
                                layer.msg(res.message);
                            }
                        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(errorThrown);
                        }
                    });
                } else {
                    layer.close(loadingicon);
                    layer.msg("请选中要上传的项！");
                }
                break;
            case 'all_updateToLibrary':
                var loadingicon = layer.load(1, {
                    shade: 0.3
                });
                // if (userInfo.userJGDM == "0") {
                //     layer.close(loadingicon);
                //     layer.msg("超级管理员暂不支持上传部级库");
                //     return;
                // }
                var tab_cache = table.cache['person_tab'];
                if (tab_cache.length > 0) {
                    var rybhs = [];
                    $.each(tab_cache, function (i, e) {
                        rybhs.push(e.RYBH);
                    })
                    urlrelated.requestBody.data = {
                        "userJGDM": userInfo.userJGDM,
                        "queryType": pagepower.queryType,
                        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : [],
                        "userId": userInfo.userId,
                        "RYBH": rybhs
                    };
                    $.ajax({
                        url: urlrelated.uploadPersonInfo,
                        type: "post",
                        async: true,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        contentType: "application/json;charset=UTF-8",
                        dataType: "json",
                        success: function (res) {
                            layer.close(loadingicon);
                            if (res.status === 200) {
                                layer.msg("全部上传至部级库成功！");
                                urlrelated.requestBody.data = {
                                    "XM": "",
                                    "XBDM": "",
                                    "ZJLXDM": "",
                                    "ZJHM": "",
                                    "CZSSJ": "",
                                    "RYFL": "",
                                    "RYBQ": "",
                                    "CZESJ": "",
                                    "ZTK": "",
                                    "GJDM": "",
                                    "MZDM": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

                                };
                                if (args.hasOwnProperty('RYBQ')) {
                                    urlrelated.requestBody.data.RYBQ = args.RYBQ;
                                }
                                table.reload('person_tab', {
                                    page: {
                                        curr: 1 //重新从第 1 页开始
                                    }
                                });
                            } else {
                                layer.msg("上传至部级库失败！");
                                urlrelated.requestBody.data = {
                                    "XM": "",
                                    "XBDM": "",
                                    "ZJLXDM": "",
                                    "ZJHM": "",
                                    "CZSSJ": "",
                                    "RYFL": "",
                                    "RYBQ": "",
                                    "CZESJ": "",
                                    "ZTK": "",
                                    "GJDM": "",
                                    "MZDM": "",
                                    "userJGDM": userInfo.userJGDM,
                                    "queryType": pagepower.queryType,
                                    "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []

                                };
                                if (args.hasOwnProperty('RYBQ')) {
                                    urlrelated.requestBody.data.RYBQ = args.RYBQ;
                                }
                            }
                        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(errorThrown);
                        }
                    });
                } else {
                    layer.close(loadingicon);
                    layer.msg("没有可操作数据！");
                }
                break;
        }
    });

    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    //Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
    // Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
    function Format(datetime, fmt) {

        if (datetime == null || datetime == "") {
            return "-";
        }

        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1,                 //月份
            "d+": datetime.getDate(),                    //日
            "h+": datetime.getHours(),                   //小时
            "m+": datetime.getMinutes(),                 //分
            "s+": datetime.getSeconds(),                 //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
});