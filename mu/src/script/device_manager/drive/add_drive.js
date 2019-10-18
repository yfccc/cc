layui.use(['upload', 'form', "urlrelated", "extension"], function () {
    var $ = layui.jquery
        , upload = layui.upload
        , form = layui.form
        , layer = layui.layer
        , urlrelated = layui.urlrelated
        , extension = layui.extension
        , driveUrl = ""
        , params = extension.getRequestParams(location.search)
        , dropDownList = extension.getDropDownList()        //获取下拉框信息
        , loginuserinfo = extension.getUserInfo();      //获取用户登录信息
    form.render();
    var ischoosefile = false;           //判断是否上传成功文件
    var ischoosefilebefore = false;     //判断是否点击了上传文件
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
    // 循环生成下拉框结构
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
    eachData($("select[name='driveManufacturerCode']"), dropDownList.sbcsList);    //设备厂商
    eachData($("select[name='deviceTypeid']"), dropDownList.sbxhList);    //设备类型

    form.render("select");

    if (params.layevent == "add") {
        // $("#drivetitle").text("驱动新增");
        $("body", parent.document).find('#sub-title').html('驱动管理>新增');
    } else if (params.layevent == "edit") {
        // $("#drivetitle").text("驱动编辑");
        var driveId = params.driveId;
        $("body", parent.document).find('#sub-title').html('驱动管理>编辑');
        ischoosefilebefore = true;
        ischoosefile = true;

        urlrelated.requestBody.data = {
            "driveId": driveId
        }

        var loadingIndex = layer.load(1, {
            shade: 0.3
        });

        $.ajax({
            url: urlrelated.getDriveManageById,
            type: "post",
            // async: true,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",  //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                if (res.status == 200) {
                    $("#driveCode").val(res.data.driveCode);
                    $("#driveName").val(res.data.driveName);
                    $("#deviceModeCode").val(res.data.deviceModeCode);
                    $("#driveVerson").val(res.data.driveVerson);
                    $("#driveRemark").val(res.data.driveRemark);
                    var select1 = 'dd[lay-value=' + res.data.driveManufacturerCode + ']';
                    $('#driveManufacturer').siblings("div.layui-form-select").find('dl').find(select1).click();
                    var select2 = 'dd[lay-value=' + res.data.deviceTypeid + ']';
                    $('#deviceType').siblings("div.layui-form-select").find('dl').find(select2).click();
                    $("#driveUrl").attr("data-url", res.data.driveUrl);
                    var num = res.data.driveUrl.lastIndexOf('/') + 1;
                    var name = res.data.driveUrl.substring(num);
                    $("#fileinfo").text(name);
                    driveUrl = res.data.driveUrl
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

    }
    var VER = /^\d+(\.\d+)+$/; // 长度为30位 数字、英文的组合；
    var number = /^[1-9]\d*$/; // 长度为30位 数字、英文的组合；
    // 验证
    form.verify({
        revision: function (value) {
            if (VER.test(value) === true || number.test(value) === true) {
            } else {
                return "版本号格式错误";
            }
        }
    });
    var loadingIndexU;
    upload.render({
        elem: '#test10'
        , url: urlrelated.uploadDrivce + '?driveVerson=1.0&driveCode=21321'
        , accept: "file"
        , acceptMime: "zip"
        , exts: 'zip'
        , dataType: 'json'
        // , auto: false
        // , bindAction: "#startUpload"
        // , choose: function (obj) {
        //     var fileval = $(".layui-upload-file").val();
        //     fileval = fileval.replace(/\\/g, "\/");
        //     var num = fileval.lastIndexOf("/");
        //     var filename = fileval.substr(num + 1);
        //     $("#fileinfo").text(filename);
        // }
        , before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            loadingIndexU = layer.load(1, {
                shade: 0.3
            }); //上传loading
            ischoosefilebefore = true;
        }
        , done: function (res) {
            layer.close(loadingIndexU); //关闭loading
            layer.msg(res.status + "---" + res.message + "---" + res.data);
            ischoosefile = true;
            driveUrl = res.data;
            var num = res.data.lastIndexOf('/') + 1;
            var name = res.data.substring(num);
            $("#fileinfo").text(name);
            //console.log(res)
        }
        , error: function (index, upload) {
            layer.close(loadingIndexU); //关闭loading
            ischoosefilebefore = false;
            layer.msg("上传过程中出现问题");
        }
    });

    form.on("submit", function (data) {
        // var userId = localStorage.getItem("userId"), userJH = localStorage.getItem("userJH");
        var data = data.field;

        if (!driveUrl) {
            if (ischoosefile) {
                layer.msg("请选择驱动");
                return;
            }
        }
        if (ischoosefilebefore == false) {
            layer.msg("请选择驱动");
            return;
        }
        var deviceTypeName = $("#deviceType option:selected").text();
        var driveManufacturer = $("#driveManufacturer option:selected").text();

        urlrelated.requestBody.data = {
            "driveName": data.driveName,
            "driveCode": data.driveCode,
            "driveManufacturer": driveManufacturer,
            "driveManufacturerCode": data.driveManufacturerCode,
            "deviceTypeid": data.deviceTypeid,
            "deviceTypeName": deviceTypeName,
            "deviceModeCode": data.deviceModeCode,
            "driveVerson": data.driveVerson,
            "driveUrl": driveUrl,
            "userId": loginuserinfo.userId,
            "userPoliceId": loginuserinfo.policeId,
            "jgxxJgid": loginuserinfo.JGID,
            "driveRemark": data.driveRemark
        }
        if (params.layevent == "add") {
            var requestUrl = urlrelated.addDriveManage;
        } else if (params.layevent == "edit") {
            urlrelated.requestBody.data["driveId"] = params.driveId;
            var requestUrl = urlrelated.editDriveManage;
        }
        if (ischoosefile == false) {
            return;
        }
        var loadingIndex1 = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: requestUrl,
            type: "post",
            dataType: "json",
            // async: true,
            timeout: 120000,
            data: JSON.stringify(urlrelated.requestBody),
            contentType: "application/json",
            success: function (res) {
                //console.log(datasss)
                layer.close(loadingIndex1);
                if (res.status == 200) {
                    top.layer.msg("保存成功");
                    downloadDrive();
                    window.location.href = "./drive.html";
                } else {
                    top.layer.msg(res.message);
                }
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingIndex1);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            },
            complete: function (xml, status) {
                layer.close(loadingIndex1);
                if (status == 'timeout') {
                    extension.timeOut();
                }
            }
        })

    })
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
});