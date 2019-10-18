layui.use(['table', 'form', "urlrelated", "extension"], function () {
    var laydate = layui.laydate
        , element = layui.element
        , table = layui.table
        , $ = layui.$
        , layer = layui.layer
        , urlrelated = layui.urlrelated
        , extension = layui.extension
        , form = layui.form
        , loginuserinfo = extension.getUserInfo();          //获取用户登录信息
    form.render();
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false
        }
    })
    //获取权限信息
    var powerControl = $("#querytype").val();
    $("body", parent.document).find('#sub-title').html('驱动管理');

    // console.log(powerControl);

    // 请求初始数据
    urlrelated.requestBody.data = {};
    //获取驱动管理列表
    table.render({
        elem: '#drive-table-page'
        , toolbar: "#table-hreader"
        , url: urlrelated.getDriveManage
        , method: 'post'
        , even: true
        , contentType: "application/json;charset=UTF-8"  //推荐写这个
        , where: urlrelated.requestBody
        , defaultToolbar: ['filter']
        , limits: [10, 20, 30]
        , cols: [[
            { title: 'No.', type: 'numbers' }
            , { field: 'driveName', minWidth: '180', title: '驱动名称' }
            , { field: 'driveManufacturer', title: '厂商名称' }
            , { field: 'driveManufacturerCode', minWidth: '180', title: '厂商代码' }
            , { field: 'deviceTypeName', title: '设备类型' }
            , { field: 'deviceModeCode', title: '设备型号' }
            , { field: 'driveVerson', title: '最新版本' }
            , { field: 'driveRemark', title: '备注' }
            , { field: 'cz', minWidth: "180", align: 'center', fixed: 'right', toolbar: "#table-toolbar", title: '操作' }
        ]]
        , loading: true
        , page: true
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
                "data": res.data.driveList //解析数据列表
            };
        }
    });

    table.on("tool(yushuaidemo)", function (obj) {
        var layEvent = obj.event;
        if (layEvent == 'edit') {
            window.location.href = './add_drive.html?layevent=edit&driveId=' + obj.data.driveId;
        } else if (layEvent == 'download') {
            //console.log(obj);
            var url = urlrelated.downloadUrlDrive + obj.data.driveUrl;
            autoDownloadUrl(url);
        } else if (layEvent == 'update') {
            //console.log(obj);
            var data = obj.data;
            layer.open({
                title: '<span style="font-weight: 650;font-size: 16px;">驱动更新</span>',
                type: 2,
                move: false,
                area: [extension.getDialogSize().width, extension.getDialogSize().height],
                resize: false,
                content: ['/html/device_manager/drive/update_drive.html', "no"],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    // body.find("#change_role_submit").click();
                    var driveVerson = body.find("#driveVerson").val();
                    var driveUrl = body.find("#driveUrl").data("url");
                    if (driveVerson == "" || driveVerson == undefined || driveVerson == null) {
                        layer.msg("请输入版本号", {
                            icon: 5
                        });
                        body.find("#driveVerson").parent().css("border", "1px solid #FF5722");
                        setTimeout(function () {
                            body.find("#driveVerson").parent().css("border", "none");
                        }, 3000);
                        return
                    }
                    var VER = /^\d+(\.\d+)+$/; // 长度为30位 数字、英文的组合；
                    var number = /^[1-9]\d*$/; // 长度为30位 数字、英文的组合；
                    if (VER.test(driveVerson) === true || number.test(driveVerson) === true) {
                    } else {
                        return;
                    }
                    if (driveUrl == "" || driveUrl == undefined || driveUrl == null) {
                        layer.msg("请上传文件");
                        return
                    }

                    urlrelated.requestBody.data = {
                        "driveId": data.driveId,
                        "driveName": data.driveName,
                        "driveManufacturer": data.driveManufacturer,
                        "driveManufacturerCode": data.driveManufacturerCode,
                        "deviceTypeid": data.deviceTypeid,
                        "deviceTypeName": data.deviceTypeName,
                        "deviceModeCode": data.deviceModeCode,
                        "driveVerson": driveVerson,
                        "driveUrl": driveUrl,
                        "userId": loginuserinfo.userId,
                        "userPoliceId": loginuserinfo.policeId,
                        "jgxxJgid": loginuserinfo.JGID,
                        "driveRemark": data.driveRemark
                    }
                    var loadingIndex = layer.load(1, {
                        shade: 0.3
                    });
                    $.ajax({
                        url: urlrelated.editDriveManage,
                        type: "post",
                        dataType: "json",
                        async: true,
                        cache: false,
                        timeout: 120000,
                        data: JSON.stringify(urlrelated.requestBody),
                        contentType: 'application/json',
                        success: function (res) {
                            layer.close(loadingIndex);
                            if (res.status == 200) {
                                layer.msg("驱动更新成功");
                                layer.close(index);
                                table.reload('drive-table-page');
                            } else {
                                layer.msg(res.message);
                            }
                        },
                        error: function (xml, textstatus, thrown) {
                            layer.close(loadingIndex);
                            //只要进error就跳转到登录页面
                            extension.errorLogin();
                        },
                        complete: function (xml, status) {
                            layer.close(loadingIndex);
                            if (status == 'timeout') {
                                extension.timeOut();
                            }
                        }
                    })
                    // layer.close(index);
                },
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.find("#driveVerson").val(data.driveVerson);
                    body.find("#driveUrl").attr("data-url", data.driveUrl);
                    var num = data.driveUrl.lastIndexOf('/') + 1;
                    var name = data.driveUrl.substring(num);
                    body.find("#driveUrl").text(name);
                },
                end: function () {
                    downloadDrive();
                }
            });
        }
    });
    function downloadDrive() {
        jQuery.support.cors = true;
        $.ajax({
            url: urlrelated.getNewDrive,
            type: "post",
            data: JSON.stringify(urlrelated.requestBody),
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                if (res.status == 200) {
                    var urldata = res.data
                    for (var i = 0; i < urldata.length; i++) {
                        if (urldata[i].deviceTypeid == "05") {
                            if (urldata[i].driveUrl != "" && urldata[i].driveUrl != null & urldata[i].driveUrl != undefined) {
                                parent.$("#irisdownload").attr("href", urlrelated.downloadUrlDrive + urldata[i].driveUrl);
                                var QDurl = parent.$("#irisdownload").attr("href");
                                localStorage.setItem("QDurl", QDurl);
                            } else {
                                parent.$("#irisdownload").on("click", function () {
                                    layer.msg("未找到最新的虹膜识别驱动仪");
                                    return;
                                })
                            }
                        }
                        if (urldata[i].deviceTypeid == "03") {
                            if (urldata[i].driveUrl != "" && urldata[i].driveUrl != null & urldata[i].driveUrl != undefined) {
                                parent.$("#iddownload").attr("href", urlrelated.downloadUrlDrive + urldata[i].driveUrl);
                                var SFZurl = parent.$("#iddownload").attr("href");
                                localStorage.setItem("SFZurl", SFZurl);
                            } else {
                                parent.$("#iddownload").on("click", function () {
                                    layer.msg("未找到最新的身份证读卡器驱动");
                                    return;
                                })
                            }
                        }
                    }
                } else {
                    parent.$("#irisdownload").attr("href", "javascript:");
                    if (parent.$("#irisdownload").attr("href") == "javascript:") {
                        parent.$("#irisdownload").on("click", function () {
                            layer.msg("未找到最新的虹膜识别驱动仪");
                            return;
                        })
                    }
                    parent.$("#iddownload").attr("href", "javascript:");
                    if (parent.$("#iddownload").attr("href") == "javascript:") {
                        parent.$("#iddownload").on("click", function () {
                            layer.msg("未找到最新的身份证读卡器驱动");
                            return;
                        })
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var status = XMLHttpRequest.status
                if (textStatus == "error" && status == "401") {
                    extension.errorLogin()
                    return false
                }
                if (textStatus == "error" && status != "401") {
                    extension.error()
                }
            }
        });
    }

    //  新增 
    table.on("toolbar(yushuaidemo)", function (obj) {
        var layEvent = obj.event;
        if (layEvent == 'add') {
            window.location.href = './add_drive.html?layevent=add';
        }
    })

    function autoDownloadUrl(url) {
        // 创建隐藏的可下载链接
        var downloadLink = document.createElement('a');
        downloadLink.style.display = 'none';
        downloadLink.href = url;
        // 触发点击
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // 然后移除
        document.body.removeChild(downloadLink);
    };
});