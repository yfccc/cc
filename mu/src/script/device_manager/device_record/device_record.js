layui.use(['urlrelated', 'laydate', 'table', 'form', 'extension', 'upload'], function () {
    var laydate = layui.laydate
        , urlrelated = layui.urlrelated
        , table = layui.table
        , $ = layui.$
        , beginDate = ""
        , endDate = ""
        , layer = layui.layer
        , form = layui.form
        , upload = layui.upload
        , extension = layui.extension
        , dropDownList = extension.getDropDownList()
        , userInfo = extension.getUserInfo()
        , pagepower = extension.getPagePower("设备管理");
    $("body", parent.document).find('#sub-title').html("设备管理");
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    form.render();
    var devicehome = ""
        , devicegenre = "";
    //设备厂商
    devicehome += '<option value="" selected>请选择</option>';
    $.each(dropDownList.sbcsList, function (i, e) {
        devicehome += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='deviceManufacturerCode']").html(devicehome);
    //设备类型
    devicegenre += '<option value="" selected>请选择</option>';
    $.each(dropDownList.sbxhList, function (i, e) {
        devicegenre += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
    });
    $("select[name='deviceTypeid']").html(devicegenre);
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

    urlrelated.requestBody.data = {
        "deviceManufacturerCode": "",
        "deviceTypeid": "",
        "deviceModeCode": "",
        "deviceTitle": "",
        "deviceSn": "",
        "deviceMac": "",
        "deviceIp": "",
        "createTimeStart": "",
        "createTimeEnd": "",
        "userJGDM": userInfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
    };
    table.render({
        elem: '#device_record_tab'
        , url: urlrelated.getDevicePageList
        , toolbar: "#BD"
        , method: 'post'
        , contentType: "application/json;charset=UTF-8"
        , limits: [10, 20, 30]
        , defaultToolbar: ['filter']
        , even: true
        , cols: [[
            { field: 'deviceManufacturer', minWidth: 170, title: '设备厂商' }
            , { field: 'deviceTypeName', minWidth: 172, title: '设备类型' }
            , { field: 'deviceModeCode', minWidth: 172, title: '设备型号' }
            , { field: 'deviceTitle', minWidth: 172, title: '设备标签' }
            , { field: 'deviceSn', minWidth: 160, title: '序列号(SN)码' }
            , { field: 'deviceMac', minWidth: 150, title: 'MAC地址' }
            , { field: 'deviceIp', minWidth: 110, title: 'IP地址' }
            , { field: 'createTime', minWidth: 170, title: '绑定时间' }
            , {
                field: 'deviceIsConnected', minWidth: 170, title: '接入状态', templet: function (d) {
                    var statusStr = "";
                    if (d.deviceIsConnected == "1") {
                        statusStr = "已接入";
                    } else if (d.deviceIsConnected == "2") {
                        statusStr = "拒绝接入";
                    } else if (d.deviceIsConnected == "3") {
                        statusStr = "试运行";
                    } else if (d.deviceIsConnected == "4") {
                        statusStr = "等待接入";
                    }
                    return statusStr;
                }
            }
            , { field: 'devicePlaceName', minWidth: 170, title: '采集场地', hide: true }
            , { field: 'deviceLongitude', minWidth: 150, title: '经度', hide: true }
            , { field: 'deviceLatitude', minWidth: 150, title: '纬度', hide: true }
            , {
                field: 'deviceBindingStatus', minWidth: 110, title: '绑定状态', templet: function (d) {
                    var statusStr = "";
                    if (d.deviceBindingStatus == "2") {
                        statusStr = "已绑定";
                    } else {
                        statusStr = "未绑定";
                    }
                    return statusStr;
                }
            }
            , { minWidth: 190, align: 'center', toolbar: '#barDemo', fixed: 'right', title: '操作' }
        ]]
        , where: urlrelated.requestBody
        , loading: true
        , page: true
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
                "data": res.data.data //解析数据列表
            };
        }
    });

    // 监听查询事件
    form.on("submit(device_re_filter)", function (obj) {
        //将开始结束时间写入参数
        obj.field["createTimeStart"] = beginDate;
        obj.field["createTimeEnd"] = endDate;

        table.reload('device_record_tab', {
            where: {
                data: obj.field
            }, page: {
                curr: 1 //重新从第 1 页开始
            }
        })
    });

    $("#reset_btn").on('click', function () {
        beginDate = "";
        endDate = "";
        $("#device_record_form")[0].reset();
        form.render();
    })

    table.on('tool(yushuaidemo)', function (obj) {
        var Pdata = obj.data;//当前点击这行的数据
        var layEvent = obj.event;
        if (layEvent === 'edit') {
            location.href = '/html/device_manager/device_record/see_edit_BD.html?layEvent=' + layEvent + '&deviceId=' + Pdata.deviceId;
        } else if (layEvent === 'see') {
            location.href = '/html/device_manager/device_record/see_edit_BD.html?layEvent=see&deviceId=' + Pdata.deviceId
        } else if (layEvent === 'del') {
            // 点击删除的时候
            urlrelated.requestBody.data = {
                "deviceId": Pdata.deviceId
            };
            layer.confirm("确定要删除吗？", {
                resize: false,
                icon: 3,
                title: '提示',
                btn: ["确定", "取消"]
            }, function () {
                var loadingicon = layer.load(1, {
                    shade: 0.3
                })
                var deviceDelAjaj = $.ajax({
                    url: urlrelated.delDevice,
                    type: "post",
                    dataType: "json",
                    timeout: 120000,
                    data: JSON.stringify(urlrelated.requestBody),
                    contentType: "application/json",
                    success: function (datasss) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data = {
                            "deviceManufacturerCode": "",
                            "deviceTypeid": "",
                            "deviceModeCode": "",
                            "deviceTitle": "",
                            "deviceSn": "",
                            "deviceMac": "",
                            "deviceIp": "",
                            "createTimeStart": "",
                            "createTimeEnd": "",
                            "userJGDM": userInfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                        };
                        if (datasss.status == 200) {
                            layer.msg(datasss.message);
                            table.reload('device_record_tab', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                }
                            });
                        }
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data = {
                            "deviceManufacturerCode": "",
                            "deviceTypeid": "",
                            "deviceModeCode": "",
                            "deviceTitle": "",
                            "deviceSn": "",
                            "deviceMac": "",
                            "deviceIp": "",
                            "createTimeStart": "",
                            "createTimeEnd": "",
                            "userJGDM": userInfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                        };
                        // if (textStatus == "timeout") {
                        //     textStatus == "timeout" && deviceDelAjaj.abort();
                        //     layer.msg("请求超时");
                        // } else {
                        //     extension.errorLogin();
                        // }
                    }, complete: function (XMLHttpRequest, textStatus) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data.deviceId = "";
                    }
                })
            }), function () {
                layer.closeAll()
            }
        } else if (layEvent === 'Untied') {
            urlrelated.requestBody.data = {
                "deviceId": Pdata.deviceId,
                "deviceBindingStatus": 1
            };
            layer.confirm("确定要解绑吗？", {
                resize: false,
                icon: 3,
                title: '提示',
                btn: ["确定", "取消"]
            }, function () {
                var loadingicon = layer.load(1, {
                    shade: 0.3
                })
                var deviceUntiedAjax = $.ajax({
                    url: urlrelated.updateDeviceBindingStatus,
                    type: "post",
                    dataType: "json",
                    timeout: 120000,
                    data: JSON.stringify(urlrelated.requestBody),
                    contentType: "application/json",
                    success: function (datasss) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data = {
                            "deviceManufacturerCode": "",
                            "deviceTypeid": "",
                            "deviceModeCode": "",
                            "deviceTitle": "",
                            "deviceSn": "",
                            "deviceMac": "",
                            "deviceIp": "",
                            "createTimeStart": "",
                            "createTimeEnd": "",
                            "userJGDM": userInfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                        };
                        if (datasss.status == 200) {
                            layer.msg(datasss.message);
                            table.reload('device_record_tab', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                }
                            });
                        }
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data = {
                            "deviceManufacturerCode": "",
                            "deviceTypeid": "",
                            "deviceModeCode": "",
                            "deviceTitle": "",
                            "deviceSn": "",
                            "deviceMac": "",
                            "deviceIp": "",
                            "createTimeStart": "",
                            "createTimeEnd": "",
                            "userJGDM": userInfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                        };
                        extension.errorMessage(errorThrown);
                    }, complete: function (XMLHttpRequest, textStatus) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data.deviceId = "";
                    }
                })
            }), function () {
                layer.closeAll()
            }
        } else if (layEvent === 'Binding') {
            urlrelated.requestBody.data = {
                "deviceId": Pdata.deviceId,
                "deviceBindingStatus": 2
            };
            layer.confirm("确定要绑定吗？", {
                resize: false,
                icon: 3,
                title: '提示',
                btn: ["确定", "取消"]
            }, function () {
                var loadingicon = layer.load(1, {
                    shade: 0.3
                })
                $.ajax({
                    url: urlrelated.updateDeviceBindingStatus,
                    type: "post",
                    dataType: "json",
                    timeout: 120000,
                    data: JSON.stringify(urlrelated.requestBody),
                    contentType: "application/json",
                    success: function (datasss) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data = {
                            "deviceManufacturerCode": "",
                            "deviceTypeid": "",
                            "deviceModeCode": "",
                            "deviceTitle": "",
                            "deviceSn": "",
                            "deviceMac": "",
                            "deviceIp": "",
                            "createTimeStart": "",
                            "createTimeEnd": "",
                            "userJGDM": userInfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                        };
                        if (datasss.status == 200) {
                            layer.msg(datasss.message);
                            table.reload('device_record_tab', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                }
                            });
                        }
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data = {
                            "deviceManufacturerCode": "",
                            "deviceTypeid": "",
                            "deviceModeCode": "",
                            "deviceTitle": "",
                            "deviceSn": "",
                            "deviceMac": "",
                            "deviceIp": "",
                            "createTimeStart": "",
                            "createTimeEnd": "",
                            "userJGDM": userInfo.userJGDM,
                            "queryType": pagepower.queryType,
                            "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
                        };
                        extension.errorMessage(errorThrown);
                    }, complete: function (XMLHttpRequest, textStatus) {
                        layer.close(loadingicon);
                        urlrelated.requestBody.data.deviceId = "";
                    }
                })
            }), function () {
                layer.closeAll()
            }
        }
    });


    // 点击绑定 
    table.on("toolbar(yushuaidemo)", function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'BD':
                location.href = '/html/device_manager/device_record/see_edit_BD.html?layEvent=add';
                break;
        }
    });
    upload.render({ //允许上传的文件后缀
        elem: '#importfile',
        url: urlrelated.importDeviceData + '?userPoliceId=' + userInfo.policeId + '&userId=' + userInfo.userId+ '&queryType=' + userInfo.querytypeItem+ '&jgxxGajgjgdm=' + userInfo.userJGDM+ '&orgListQueryTypeEq4=' + pagepower.notifiedBodyStr,
        accept: 'file',
        // multiple: true,
        field: 'files',
        headers: { token: localStorage.token },
        data: urlrelated.requestBody,
        exts: 'xls|excel|xlsx',
        auto: true,
        done: function (res) {
            urlrelated.requestBody.data = {
                "deviceManufacturerCode": "",
                "deviceTypeid": "",
                "deviceModeCode": "",
                "deviceTitle": "",
                "deviceSn": "",
                "deviceMac": "",
                "deviceIp": "",
                "createTimeStart": "",
                "createTimeEnd": "",
                "userJGDM": userInfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBodyStr : ""
            };
            if (res.status == 200) {
                layer.msg(res.message);
                layer.open({
                    title: '导入设备信息',
                    type: 2,
                    move: false,
                    area: ['400px', '250px'],
                    resize: false,
                    content: ['/html/device_manager/device_record/device_record_import.html', "no"],
                    btn: ['确定'],
                    yes: function (index, layero) {
                        // var body = layer.getChildFrame('body', index);
                        // body.find("#import_submit").click();
                        layer.close(index);
                        return
                    },
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        iframeWin.changeData(res.data);
                        // layer.iframeAuto(index);
                    },
                    end: function(){
                        table.reload('device_record_tab', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                        });
                        $("#importfile").hide().show();
                    }
                });
            } else {
                layer.msg(res.message);
            }
        }, error: function () {
            urlrelated.requestBody.data = {
                "name": "",
                "userJGDM": userInfo.userJGDM,
                "queryType": pagepower.queryType,
                "notifiedBody": pagepower.queryType == 4 ? pagepower.notifiedBody : []
            };
            ex.errorLogin();
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