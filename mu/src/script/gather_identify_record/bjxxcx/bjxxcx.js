layui.use(['laydate', 'table', 'urlrelated', 'extension', 'form'], function () {
    var laydate = layui.laydate
        , urlrelated = layui.urlrelated
        , layer = layui.layer
        , form = layui.form
        , extension = layui.extension
        , beginDate = ""
        , endDate = ""
        , table = layui.table
        , dropDownList = extension.getDropDownList()
        , userInfo = extension.getUserInfo()
        , pagepower = extension.getPagePower("报警记录");
    $("#querytype").val(localStorage.getItem("querytypeItem"))
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
    var cardGenreOption = ""
        , nationalityOption = ""
        , dataSourceOption = ""
        , imNameList = ""
        , genderOption = ""
        , personClassification = ""
        , ethnicOption = ""
        , isNameList = ""
        , bjlx = "";
    //证件类型
    cardGenreOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.zjlxList, function (i, e) {
        cardGenreOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='bjxxCyzjCyzjdm']").html(cardGenreOption);
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
    $("select[name='bjxxXbdm']").html(genderOption);
    //人员分类
    personClassification += '<option value="" selected>请选择</option>';
    $.each(dropDownList.ryflList, function (i, e) {
        personClassification += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='bjxxRyfl']").html(personClassification);
    //民族
    ethnicOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.mzList, function (i, e) {
        ethnicOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='bjxxMzdm']").html(ethnicOption);
    //国籍
    nationalityOption += '<option value="" selected>请选择</option>';
    $.each(dropDownList.gjList, function (i, e) {
        nationalityOption += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='bjxxGjdm']").html(nationalityOption);
    //专题库
    isNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.isNameList, function (i, e) {
        if (e != null && typeof e != 'undefined')
            isNameList += '<option value="' + e.isName + '">' + e.isName + '</option>';
    });
    $("select[name='bjxxBjyyDmbcms']").html(isNameList);
    //人员标签
    imNameList += '<option value="" selected>请选择</option>';
    $.each(dropDownList.imNameList, function (i, e) {
        imNameList += '<option value="' + e.imName + '">' + e.imName + '</option>';
    });
    $("select[name='bjxxBqkms']").html(imNameList);
    //报警类型
    bjlx += '<option value="" selected>请选择</option>';
    $.each(dropDownList.bjlxList, function (i, e) {
        bjlx += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("#bjlx").html(bjlx);
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

    urlrelated.requestBody.data = {
        "sjsjStart": "",
        "sjsjEnd": "",
        "bjxxXm": "",
        "bjxxXbdm": "",
        "isName": "",
        "bjxxCyzjCyzjdm": "",
        "bjxxCyzjZjhm": "",
        "bjxxRyfl": "",
        "bjxxMzdm": "",
        "bjxxGjdm": "",
        "hmcjCjbh": "",
        "bjxxDlyhXm": "",
        "deviceSn": "",
        "platform": "",
        "bjxxBjyydm": "",
        "imName": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
    };
    table.render({
        elem: '#alarm_tab'
        , defaultToolbar: ['filter']
        , url: urlrelated.irisrecordalarmRecord
        , method: 'post'
        , contentType: "application/json;charset=UTF-8"
        , where: urlrelated.requestBody
        , toolbar: "#download"
        , data: []
        , limits: [10, 20, 30]
        , even: true
        , cols: [[
            { field: 'bjsj', width: 180, title: '报警时间' }
            , { field: 'jgxxGajgjgmc', minWidth: 190, title: '组织机构名称' }
            , { field: 'bjxxXm', width: 110, title: '姓名' }
            , { field: 'xb', minWidth: 80, title: '性别' }
            , { field: 'csrq', minWidth: 110, title: '出生日期', hide: true }
            , { field: 'gj', width: 80, title: '国籍' }
            , { field: 'mz', minWidth: 80, title: '民族' }
            , { field: 'zjdm', width: 110, title: '证件类型' }
            , {
                field: 'bjxxCyzjZjhm', width: 170, title: '证件号',
                templet: function (row) {
                    if (row.zjdm == "无证件") {
                        return "-";
                    } else {
                        return row.bjxxCyzjZjhm;
                    }
                }
            }
            , { field: 'ryfl', width: 110, title: '人员分类' }
            , { field: 'bjlx', width: 110, title: '报警类型' }
            , { field: 'bjxxBjyyDmbcms', minWidth: 136, title: '专题库' }
            , { field: 'hmcjCjbh', width: 110, title: '采集编号' }
            , { field: 'bjxxSjhm1', minWidth: 110, title: '手机号', hide: true }
            , { field: 'userRealname', width: 140, title: '操作人' }
            , { field: 'sjly', width: 110, title: '数据来源' }
            , { field: 'deviceSn', width: 110, title: '设备SN码' }
            , { field: 'deviceManufacturer', minWidth: 170, title: '设备厂商名称' }
            , { field: 'cjcd', width: 110, title: '发生地点', hide: true }
            , {
                field: 'bjxxJwd', width: 170, title: '坐标（经度，纬度）', templet: function (row) {
                    var xz = row.bjxxJd || "-";
                    var yz = row.bjxxWd || "-";
                    return xz + "," + yz;
                }, hide: true
            }
            , { field: 'bjxxBqkms', width: 105, title: '人员标签' }
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

    form.on("submit(bjxxcx_filter)", function (obj) {
        //将开始结束时间写入参数
        obj.field["sjsjStart"] = beginDate;
        obj.field["sjsjEnd"] = endDate;
        //去除空格
        for (var key in obj.field) {
            obj.field[key] = $.trim(obj.field[key]);
        }
        //赋值给requestbody 导出用
        $.extend(urlrelated.requestBody.data, obj.field);
        table.reload('alarm_tab', {
            where: {
                data: urlrelated.requestBody.data
            }, page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false;
    });

    table.on('toolbar(bjxx_tab)', function (obj) {
        var layEvent = obj.event;
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
                    var urlstr = urlrelated.exportAlarmRecord + "/" + fieldstr;
                    $.ajax({
                        url: urlstr,
                        type: "post",
                        async: true,
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
                        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
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

    $("#bjxxcx_reset").on('click', function () {
        $("#bjxxcx_form")[0].reset();
        beginDate = "";
        endDate = "";
        form.render();
    })

    function resize() {
        var width = $(window).width();
        //按钮自适应，解决调动
        var formWidth = $("#formDiv").width();
        //$("#subDIV").css("margin-left", formWidth * 0.5 - 95)
    }

    resize();
    $(window).resize(function () {
        resize()

    })
});
