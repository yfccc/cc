layui.use(['table', 'form', "urlrelated", "extension"], function () {
    var requestUrl = "";
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        dropDownList = extension.getDropDownList() //获取下拉框信息
        ,
        loginuserinfo = extension.getUserInfo() //获取用户登录信息
        ,
        edituseridcard = "",
        editusername = ""
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

    // var pagepower = extension.getPagePower("用户管理");
    // urlrelated.requestBody.data = {
    //     "userJGDM": loginuserinfo.userJGDM,
    //     "queryType": pagepower.queryType,
    //     "orgListQueryTypeEq4": pagepower.notifiedBody
    // }
    // $.ajax({
    //     url: requestUrl,
    //     type: "post",
    //     async: true,
    //     timeout: 120000,
    //     data: JSON.stringify(urlrelated.requestBody),
    //     cache: false,
    //     contentType: "application/json;charset=UTF-8", //推荐写这个
    //     dataType: "json",
    //     success: function (res) {
    //         //console.log(res);

    //     },
    //     error: function (xml, textstatus, thrown) {
    //         layer.close(loadingicon);
    //         extension.errorMessage(thrown);
    //     }
    // });
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
    eachData($("select[name='userGender']"), dropDownList.xbList); //性别
    eachData($("select[name='userPlaceCode']"), dropDownList.cjcdList); //地点
    //生成角色下拉框
    var pagepower = extension.getPagePower("角色管理");
    if (localStorage.getItem("rolelist") == undefined || localStorage.getItem("rolelist") == null) {
        urlrelated.requestBody.data = {
            "rmName": "",
            "queryType": pagepower.queryType,
            "notifiedBody": pagepower.notifiedBody
        }
        urlrelated.requestBody["page"] = 1;
        urlrelated.requestBody["limit"] = 10000;
        var rolelist = new Array();
        // var loadingiconrole = layer.load(1, {
        //     shade: 0.3
        // })
        jQuery.support.cors = true;
        $.ajax({
            url: urlrelated.getRoleList,
            type: "post",
            async: false,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (res) {
                // layer.close(loadingiconrole);
                if (res.status === 200) {
                    rolelist = res.data.roleList;
                    localStorage.setItem('rolelist', JSON.stringify(rolelist));
                    var rolehtml = '<option value="">请选择</option>';
                    $.each(rolelist, function (i, item) {
                        if (item.rmId != null && typeof item.rmId != "undefined" && item.rmId != "") {
                            rolehtml += '<option value="' + item.rmId + '">' + item.rmName + '</option>'
                        } else {
                            rolehtml += '<option value="' + item.rmName + '">' + item.rmName + '</option>'
                        }
                    });
                    $("select[name='roleId']").html(rolehtml);
                    form.render("select");
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // layer.close(loadingiconrole);
                extension.errorMessage(errorThrown);
            }
        });
    } else {
        var rolehtml = '<option value="">请选择</option>';
        var localRole = JSON.parse(localStorage.getItem("rolelist"));
        $.each(localRole, function (i, item) {
            if (item.rmId != null && typeof item.rmId != "undefined" && item.rmId != "") {
                rolehtml += '<option value="' + item.rmId + '">' + item.rmName + '</option>'
            } else {
                rolehtml += '<option value="' + item.rmName + '">' + item.rmName + '</option>'
            }
        });
        $("select[name='roleId']").html(rolehtml);
        form.render("select");
    }

    form.render("select");

    var active = {
        GetRequest: function (url) {
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    };
    var urldata = active["GetRequest"](window.location.search); //获取url数据
    //验证
    var reg18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; //18位身份证号
    var reg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/; //15位身份证号
    var stm_name = /^[a-zA-Z\u4e00-\u9fa5]{0,50}$/; //50位字母、中文
    var account = /^[0-9a-zA-Z]{0,20}$/; //20位数字、字母、汉字的组合
    var password = /^[0-9a-zA-Z]{8,16}$/; // 长度为8-16位 数字、英文的组合；
    var policeid = /^[0-9a-zA-Z]+$/; // 长度为8-16位 数字、英文的组合；
    // 验证
    form.verify({
        reqCard: function (value) {
            var user_id = value;
            if (reg18.test(user_id) === false && reg15.test(user_id) === false) {
                return "身份证号输入错误";
            }
            if (urldata.type == "edit") {
                if (edituseridcard == value) {
                    return
                }
            }
            urlrelated.requestBody.data = {
                "userIdcard": value
            }
            var isrepeat = true;
            var loadingicon = layer.load(1, {
                shade: 0.3
            })
            jQuery.support.cors = true;
            $.ajax({
                url: urlrelated.getIdcardIfRegister,
                type: "post",
                async: false,
                timeout: 120000,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingicon);
                    if (res.status == 200) {
                        if (res.data.ifRegister) {
                            isrepeat = false;
                        }
                    } else {
                        layer.msg(res.message);
                    }
                },
                error: function (xml, textstatus, thrown) {
                    layer.close(loadingicon);
                    extension.errorMessage(thrown);
                }
            });
            if (isrepeat == false) {
                return "此身份证号码已经注册"
            }

        },
        password: function (value) {
            if (value != "" && value != null) {
                if (password.test(value) === false) {
                    return "仅支持8-16位的数字或英文字母";
                }
            }
        },
        policeid: function (value) {
            if (value != "" && value != null) {
                if (policeid.test(value) === false) {
                    return "仅支持10位的数字或英文字母";
                }
            }
        },
        account: function (value) {
            if (value != "" && value != null) {
                if (account.test(value) === false) {
                    return "仅支持20位英文字母、数字";
                }
                if (editusername != value) {
                    urlrelated.requestBody.data = {
                        "userName": value
                    }
                    var isrepeat = true;
                    var loadingicon = layer.load(1, {
                        shade: 0.3
                    })
                    jQuery.support.cors = true;
                    $.ajax({
                        url: urlrelated.getUserNameIfRegister,
                        type: "post",
                        async: false,
                        timeout: 120000,
                        data: JSON.stringify(urlrelated.requestBody),
                        cache: false,
                        contentType: "application/json;charset=UTF-8", //推荐写这个
                        dataType: "json",
                        success: function (res) {
                            layer.close(loadingicon);
                            if (res.status == 200) {
                                if (res.data.ifRegister) {
                                    isrepeat = false;
                                }
                            } else {
                                layer.msg(res.message);
                            }
                        },
                        error: function (xml, textstatus, thrown) {
                            layer.close(loadingicon);
                            extension.errorMessage(thrown);
                        }
                    });
                    if (isrepeat == false) {
                        return "此用户名已经注册"
                    }
                }
            }
        },
        confirmPwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            //console.log($("#userPassword").val());
            if (value != $("#userPassword").val()) {
                return '两次密码输入不一致';
            }
        },
        orgtree: function (value, item) {
            //console.log(value,item);
            if (value == null || value == "") {
                $("#jgxxgajgjgmc").parent().css("border", "1px solid #FF5722");
                setTimeout(function () {
                    $("#jgxxgajgjgmc").parent().css("border", "none");
                }, 3000);
                return '请选择组织机构'
            }
        },
        phonecustomize: function (value, item) {
            var pattern = /^1[3456789]\d{9}$/;
            if (value != "" && value != undefined && value != null) {
                if (pattern.test(value) === false) {
                    return '请输入正确的手机号';
                }
            }

        }
    });
    var userPlaceName = "";
    form.on('select(userPlaceCode)', function (data) {
        userPlaceName = data.elem[data.elem.selectedIndex].text;
    })
    form.on('submit(modifyinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        delete urlrelated.requestBody["page"];
        delete urlrelated.requestBody["limit"];
        var request = data.field;
        if (urldata.type == "edit") {
            request['userId'] = urldata.id;
            request['userEmail'] = "zhangs@qq.com";
            request.userPassword = $("#psdinfo").val();
        }
        request["userPlaceName"] = userPlaceName;
        request["jgxxGajgjgdm"] = selectTreeOrg[0].treeId;
        request["jgxxJgid"] = selectTreeOrg[0].jgId;

        //当前登录用户的
        request["userPoliceId2"] = loginuserinfo.policeId;
        request["jgxxJgid2"] = loginuserinfo.JGID;
        request["jgxxGajgjgdm2"] = loginuserinfo.userJGDM;
        //编辑没有修改密码的功能，不需要再加密
        if (urldata.type == "edit") {
            urlrelated.requestBody.data = request;
            $.ajax({
                url: requestUrl,
                type: "post",
                async: true,
                timeout: 120000,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    //console.log(res);
                    layer.close(loadingicon);
                    if (res.status == 200) {
                        top.layer.msg("保存成功");
                        location.href = "/html/system/user/user.html";
                    } else {
                        top.layer.msg(res.message);
                    }
                },
                error: function (xml, textstatus, thrown) {
                    layer.close(loadingicon);
                    extension.errorMessage(thrown);
                }
            });
        } else {
            urlrelated.requestBody.data = {
                "param": request.userPassword
            }
            jQuery.support.cors = true;
            $.ajax({
                url: urlrelated.logDesUrl,
                type: "post",
                timeout: 120000,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                // dataType: "json",
                success: function (res) {
                    //console.log(res);
                    if (res.status == 200) {
                        request.userPassword = res.data.result;
                        urlrelated.requestBody.data = request;
                        $.ajax({
                            url: requestUrl,
                            type: "post",
                            async: true,
                            timeout: 120000,
                            data: JSON.stringify(urlrelated.requestBody),
                            cache: false,
                            contentType: "application/json;charset=UTF-8", //推荐写这个
                            dataType: "json",
                            success: function (res) {
                                //console.log(res);
                                layer.close(loadingicon);
                                if (res.status == 200) {
                                    top.layer.msg("保存成功");
                                    location.href = "/html/system/user/user.html";
                                } else {
                                    top.layer.msg(res.message);
                                }
                            },
                            error: function (xml, textstatus, thrown) {
                                layer.close(loadingicon);
                                extension.errorMessage(thrown);
                            }
                        });
                    } else {
                        top.layer.msg(res.message);
                    }
                },
                error: function (xml, textstatus, thrown) {
                    layer.close(loadingicon);
                    extension.errorMessage(thrown);
                }
            });
        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    var selectTreeOrg;
    $("#select_org").on("click", function () {
        localStorage.setItem("currentOrgCodeTree", loginuserinfo.userJGDM);
        localStorage.setItem("chirdOrgCodeTree", "-1");
        localStorage.setItem("queryTypeTree", loginuserinfo.querytypeItem);
        localStorage.setItem("orgListQueryTypeEq4Tree", loginuserinfo.models);
        layer.open({
            title: '选择机构',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/institutions/select_institutions.html#type="aa"', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                selectTreeOrg = iframeWin.getSelectOrg();
                //console.log(selectTreeOrg);
                $("#jgxxgajgjgmc").val(selectTreeOrg[0].title);
                layer.close(index);
            },
            success: function (layero, index) { }
        });
    });
    if (urldata.type == "new") {
        $(".hiddenforedit").show();
        $("#userPassword").attr("lay-verify", "required|password");
        $("#confirmPwd").attr("lay-verify", "required|confirmPwd");
        $("#title_info").text("用户新增");
        requestUrl = urlrelated.addUSer;
        $("body", parent.document).find('#sub-title').html('用户管理>新增');
    } else if (urldata.type == "edit") {
        var loadingicon = layer.load(1, {
            shade: 0.3
        })
        // $(".hiddenforedit").hide();
        $(".hiddenforedit input").removeAttr("lay-verify");
        $("#title_info").text("用户编辑");
        $("#userName").attr("disabled", true);
        requestUrl = urlrelated.editUser;
        $("body", parent.document).find('#sub-title').html('用户管理>编辑');
        var userid = urldata.id;

        urlrelated.requestBody.data = {
            "userId": userid
        }

        $.ajax({
            url: urlrelated.getUserDetailById,
            type: "post",
            async: true,
            timeout: 120000,
            data: JSON.stringify(urlrelated.requestBody),
            cache: false,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                //console.log(res);
                layer.close(loadingicon);
                if (res.status == 200) {
                    editusername = res.data.userName;
                    edituseridcard = res.data.userIdcard;
                    $("#psdinfo").val(res.data.userPassword);
                    RenderDataVal($("body"), "", res.data);
                    selectTreeOrg = [{
                        treeId: res.data.jgxxGajgjgdm,
                        jgId: res.data.jgxxJgid,
                        title: res.data.jgxxGajgjgmc
                    }];
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingicon);
                extension.errorMessage(thrown);
            }
        })
    }
});

function RenderDataVal(body, idpre, result) {
    $.each(result, function (item, val) {
        if ($("#" + idpre + item).hasClass("select")) {
            var select = 'dd[lay-value=' + val + ']';
            $("#" + idpre + item).next("div.layui-form-select").find('dl').find(select).click();
        } else {
            body.find("#" + idpre + item).val(val); //给弹出层页面赋值，id为对应弹出层表单id
        }
        //设置单选框选中状态
        if ($("input[name=" + item + "]").length != 0) {
            if (val == null) {
                val = 1
            }
            if (item != "userPassword") {
                $("input[name=" + item + "][value=" + val + "]").next().click();
            }
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