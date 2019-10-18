layui.use(['table', 'form', 'layedit', "urlrelated", "extension", "layer"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    var layedit = layui.layedit;
    //建立编辑器 改到了先赋值在建立
    var richtext;
    // var richtext = layedit.build('demo', {
    //     height: 300, //设置编辑器高度
    //     hideTool: ['image', 'face']
    // }); 
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
    $("#choiceobj").hide();
    form.render();

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
    var urldata = active["GetRequest"](window.location.search);
    var chooseTree;
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
            content: ['/html/system/institutions/select_institutions.html?tree_type=more', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var org = iframeWin.getSelectOrg();
                // console.log(org);
                if (org == "" || org.length == 0) {
                    layer.msg("请至少勾选一个机构");
                    return;
                }
                chooseTree = org;
                var treeinfo = "";
                for (var i = 0; i < chooseTree.length; i++) {
                    var orglistobj = {
                        jgxxJgid: chooseTree[i].jgId,
                        jgxxGajgjgmc: chooseTree[i].title,
                        jgxxGajgjgdm: chooseTree[i].treeId
                    };
                    orgList.push(orglistobj);
                    treeinfo += chooseTree[i].title + ",";
                }
                treeinfo = treeinfo.substring(0, treeinfo.lastIndexOf(','));
                $("#prev_org").val(treeinfo);
                // radioval = -1;
                // jgxxGajgjgmc = "全部"
                layer.close(index);
            },
            success: function (layero, index) { }
        });
    });

    //鼠标滑过显示文本信息
    $("#select_org").on('mouseenter', function () {
        var obj = $(this).find("#prev_org");
        if (obj.val() != 0 && obj.val() != '') {
            var value = obj.val();
            $(this).attr("title", value);
        }
    });
    var radioval = "all";
    var jgxxGajgjgmc = "全部";
    var orgList = new Array();
    var isRelease = false;
    form.on('radio(receiveobj)', function (data) {
        //console.log(data.value); //被点击的radio的value值
        if (data.value == "assign") {
            $("#choiceobj").show();
            $("#prev_org").attr({
                "required": true,
                "lay-verify": "orgtree"
            });
        } else if (data.value == "all") {
            $("#choiceobj").hide();
            $("#prev_org").attr({
                "required": true,
                "lay-verify": ""
            });
            var orglistobj = {
                "jgxxJgid": -1,
                "jgxxGajgjgmc": "全部",
                "jgxxGajgjgdm": "0"
            };
            orgList.push(orglistobj);
        }
        radioval = data.value;
    });
    var markNewOrEditUrl = "";
    if (urldata.type == "new") {
        $("#title_info").text("新增公告");
        markNewOrEditUrl = urlrelated.noticeAdd;
        $("body", parent.document).find('#sub-title').html('公告管理>新增');
        //先赋值再建立编辑器
        richtext = layedit.build('demo', {
            height: 300, //设置编辑器高度
            hideTool: ['image', 'face']
        });
    } else if (urldata.type == "edit") {
        $("#title_info").text("编辑公告");
        markNewOrEditUrl = urlrelated.noticeEdit;
        $("body", parent.document).find('#sub-title').html('公告管理>编辑');

        var id = urldata.id;

        urlrelated.requestBody.data = {
            "noticeId": id
        }
        var loadingEdit = layer.load(1, {
            shade: 0.3
        })
        $.ajax({
            url: urlrelated.noticeDetails,
            type: "post",
            data: JSON.stringify(urlrelated.requestBody),
            timeout: 120000,
            cache: false,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (result) {
                if (result.status == 200) {
                    // layedit.setContent(richtext, result.data.noticeContent, false);
                    $("#demo").val(result.data.noticeContent);
                    $("#noticeTitle").val(result.data.noticeTitle);
                    var jgmc = "";
                    if (result.data.organizationList.length == 1 && result.data.organizationList[0].jgxxJgid == "-1") {
                        radioval == "all";
                    } else {
                        radioval = "assign";
                        $("input[name=noticeTarget][value=assign]").next().click();
                        $("#choiceobj").show();
                        $("#prev_org").attr({
                            "required": true,
                            "lay-verify": "orgtree"
                        });
                        orgList = result.data.organizationList;
                        for (var i = 0; i < result.data.organizationList.length; i++) {
                            jgmc += result.data.organizationList[i].jgxxGajgjgmc + ",";
                        }
                        jgmc = jgmc.substring(0, jgmc.lastIndexOf(','));
                        form.render('radio');
                    }
                    $("#prev_org").val(jgmc);
                    //先赋值再建立编辑器
                    richtext = layedit.build('demo', {
                        height: 300, //设置编辑器高度
                        hideTool: ['image', 'face']
                    });
                } else {
                    layer.msg(result.message);
                }
                layer.close(loadingEdit);
            },
            error: function (tt) {
                layer.close(loadingEdit);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            },
            complete: function (xml, status) {
                layer.close(loadingEdit);
            }
        });
    }

    var nowtext = "";
    var title = "";
    //重置
    $("#resetRichText").on("click", function () {
        //console.log(layedit.getContent(richtext));
        layedit.setContent(richtext, "", false);
        $("input[name=noticeTarget][value=all]").next().click();
        $("#noticeTitle").val('');
        $("#prev_org").val('');
        form.render('radio');
        orgList = new Array();
    });
    //保存/新增
    $("#saveRichText").on("click", function () {
        if (collectInfo()) {
            var loadingIndex = layer.load(1, {
                shade: 0.3
            });
            if (radioval == "all") {
                jgxxGajgjgmc = "全部";
                orgList = new Array();
                var orglist = {
                    "jgxxJgid": "-1",
                    "jgxxGajgjgmc": "全部",
                    "jgxxGajgjgdm": "0"
                }
                orgList.push(orglist);
            }
            if (nowtext.length > 768) {
                layer.msg("公告内容最多500个字符");
                return
            }
            //判断当前登录用户是不是admin
            var isAdmin = false;
            if (loginuserinfo.userName == "admin") {
                isAdmin = true;
            }
            //console.log(nowtext);
            urlrelated.requestBody.data = {
                "noticeTitle": title, //标题
                "noticeTarget": "", //接收对象
                "organizationList": orgList,
                "noticeContent": nowtext, //公告内容
                "noticeType": "1", //分类   目前就一个系统公告
                "noticeStatus": "2", //发布状态  1置顶 2未发布 3已发布
                "userId": loginuserinfo.userId, //用户名
                "userPoliceId": loginuserinfo.policeId, //用户警号
                "jgxxJgid": loginuserinfo.JGID, //对应机构编号
                "jgxxGajgjgdm": loginuserinfo.userJGDM, //机构代码
                "admin": isAdmin
            }
            if (urldata.type == "edit") {
                urlrelated.requestBody.data['noticeId'] = urldata.id;
            }
            var msg = "保存成功";
            //如果点击的是发布按钮 需要把状态改成3
            if (isRelease) {
                urlrelated.requestBody.data["noticeStatus"] = "3";
                isRelease = false;
                msg = "发布成功";
            }
            $.ajax({
                url: markNewOrEditUrl,
                type: "post",
                data: JSON.stringify(urlrelated.requestBody),
                timeout: 120000,
                cache: false,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (resultData) {
                    layer.close(loadingIndex);
                    if (resultData.status == 200) {
                        top.layer.msg(msg);
                        window.location.href = "/html/opinion/sign/sign.html"
                    } else {
                        layer.msg(resultData.message);
                        return;
                    }
                },
                error: function (tt) {
                    layer.close(loadingIndex);
                    //只要进error就跳转到登录页面
                    extension.errorLogin();
                },
                complete: function (xml, status) {
                    layer.close(loadingIndex);
                }
            });
            
        }
    });
    //发布也调用新增 只是改变参数值
    $("#releaseRichText").on("click", function () {
        isRelease = true;
        $("#saveRichText").click();
    })
    form.verify({
        orgtree: function (value, item) {
            //console.log(value,item);
            if (value == null || value == "") {
                $("#select_org").css("border", "1px solid #FF5722");
                setTimeout(function () {
                    $("#select_org").css("border", "none");
                }, 3000);
                return '请选择组织机构'
            }
        },
        content: function (value) {
            layedit.sync(richtext);
            var length = layedit.getText(richtext).length;
            if (length > 500) {
                layedit.setContent(richtext, layedit.getContent(richtext).substr(0, 500), false);
                return '当前公告内容超出最大字数(500个)'
            }
        }
    });

    function collectInfo() {
        var isContinue = true;
        nowtext = layedit.getContent(richtext);
        title = $("#noticeTitle").val();
        var length = layedit.getText(richtext).length;
        if (length > 500) {
            layer.msg("公告内容最多500个字符");
            isContinue = false;
            return
        }
        if (title == "") {
            layer.msg("请输入公告标题");
            isContinue = false;
            return
        }
        if (radioval != "all") {
            if ($("#prev_org").val() == "") {
                layer.msg("请选择接收对象");
                isContinue = false;
                return
            }
        }
        if (length == 0) {
            layer.msg("请输入公告内容");
            return
        }
        return isContinue
    }
    ////公告内容提示
    // var iframeWin = $("iframe[id='LAY_layedit_1']")[0];
    // $(iframeWin.contentWindow.document).find("body").focus(function(){
    //     var htmlinfo = $(iframeWin.contentWindow.document).find("body").html();
    //     if(htmlinfo == "请输入公告内容，最多500个字符"){
    //         $(iframeWin.contentWindow.document).find("body").html("");
    //     }
    // })
    // $(iframeWin.contentWindow.document).find("body").blur(function(){
    //     var htmlinfo = $(iframeWin.contentWindow.document).find("body").html();
    //     if(htmlinfo == ""){
    //         $(iframeWin.contentWindow.document).find("body").html("请输入公告内容，最多500个字符");
    //     }
    // })

});