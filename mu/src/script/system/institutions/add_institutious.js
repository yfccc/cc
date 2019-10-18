layui.use(['form', 'layer', 'extension', 'urlrelated'], function () {
    var urlrelated = layui.urlrelated
        , extension = layui.extension
        , $ = layui.$
        , layer = layui.layer
        , form = layui.form
        , loginuserinfo = extension.getUserInfo();      //获取用户登录信息
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
    //函数对象
    function GetRequest(url) {
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
    //表单验证
    form.verify({
        longitude: function (value, item) {
            var pattern = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
            if (value != "" && !pattern.test(value)) {
                return '经度整数部分为0-179,小数部分为0到6位!';
            }
        }
        , latitude: function (value, item) {
            var pattern = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
            if (value != "" && !pattern.test(value)) {
                return '纬度整数部分为0-89,小数部分为0到6位!';
            }
        }
        , orgtree: function (value, item) {
            //console.log(value,item);
            if (value == null || value == "") {
                $("#prev_org").parent().css("border", "1px solid #FF5722");
                setTimeout(function () {
                    $("#prev_org").parent().css("border", "none");
                }, 3000);
                return '请选择组织机构'
            }
        }
    })
    //判断当前登录用户所属角色是不是超级管理员
    var loginrole = loginuserinfo.rolesName;
    var urldata = GetRequest(location.search);

    if (loginrole == "超级管理员" || urldata.layEvent == "edit") {
        $(".mustlogo").hide();
        $("#prev_org").removeAttr("required lay-verify");
    } else {
        $(".mustlogo").show();
        $("#prev_org").attr({ "required": true, "lay-verify": "orgtree" });
    }
    //获取数据
    function Post(url, datas_json_str, callback, layEvent) {
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: url,
            type: "post",
            async: true,
            data: datas_json_str,
            cache: false,
            timeout: 120000,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                //console.log("add_institutious_res",res);
                if (typeof callback === "function") {
                    callback(res, layEvent);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        });
    }
    //页面数据填写 编辑时
    function SetElementValue(obj, layEvent) {
        //console.log("反填", obj);
        if (typeof obj === 'undefined') {
            layer.msg("结果为空");
        } else {
            //根据layEvent的 判断是新增还是 编辑
            if (layEvent === "edit") { //编辑
                $("#prev_org_id").val(obj.data.jgxxFjjgid);
                $("#org_id").val(obj.data.jgxxJgid);
                $("#prev_org").val(obj.data.orgParentName);
                $("#org_name").val(obj.data.jgxxGajgjgmc);
                $("#org_coding").val(obj.data.jgxxGajgjgdm);
                $("#org_desc").val(obj.data.jgxxGajgjgmcms);
                $("#jgxxDz").val(obj.data.jgxxDz);
                $("#jgxxJd").val(obj.data.jgxxJd);
                $("#jgxxWd").val(obj.data.jgxxWd);
                $("#org_coding").prop('disabled', true);
                // $("#instTitle").html("编辑机构");
                $("body", parent.document).find('#sub-title').html('组织机构>编辑');
                //修改提交按钮的 data
                $("#submit_add_institutious").attr("data-event", "edit");
            } else if (layEvent === "add_next_org") { //增加下级节点
                //当前id为parentid 当前节点为父节点
                $("#prev_org_id").val(obj.data.jgxxGajgjgdm);
                $("#prev_org").val(obj.data.jgxxGajgjgmc);
                // $("#instTitle").html("添加下级机构");
                $("body", parent.document).find('#sub-title').html('组织机构>添加下级机构');
                //修改提交按钮的 data
                $("#submit_add_institutious").attr("data-event", "add_next_org");
            } else if (layEvent === "add") { //新增
                // $("#instTitle").html("新增机构");
                $("body", parent.document).find('#sub-title').html('组织机构>新增');
                //修改提交按钮的 data
                $("#submit_add_institutious").attr("data-event", "add");
            }
        }
    }
    form.verify({
        orgtree: function (value, item) {
            //console.log(value,item);
            if (value == null || value == "") {
                $("#prev_org").parent().css("border", "1px solid #FF5722");
                setTimeout(function () {
                    $("#prev_org").parent().css("border", "none");
                }, 3000);
                return '请选择组织机构'
            }
        }
    });
    //监听点击
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
            content: ['/html/system/institutions/select_institutions.html?tree_type=single', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //获取选中的组织机构
                var org = iframeWin.getSelectOrg();
                $("#prev_org_id").val(org[0].treeId);
                $("#prev_org").val(org[0].title);
                layer.close(index);
            },
            btn2: function (index, layero) {

            },
            success: function (layero, index) {
                //填写上级组织机构
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var search_org_doc = iframeWin.document.getElementById("search_org");
                $(search_org_doc).val("测试反填数据");
                //iframeWin.layui.initTree('single');
            }
        });
    });

    //监听提交
    form.on('submit(form_add_institutious)', function (data) {
        // console.log(data);
        var url = "";
        var layEvent = extension.getRequestParams(location.search).layEvent;
        data.field["userId"] = loginuserinfo.userId;
        if (data.field.jgxxFjjgid == data.field.jgxxGajgjgdm) {
            layer.msg('机构代码已存在');
            return false;
        }
        if (layEvent === "edit") { //编辑
            url = urlrelated.editOrganization;
        } else if (layEvent === "add_next_org") { // 增加下级节点
            url = urlrelated.insertOrganization;
        } else if (layEvent === "add") { //新增
            url = urlrelated.insertOrganization;
        }

        urlrelated.requestBody.data = data.field;
        Post(url, JSON.stringify(urlrelated.requestBody), Form_CallBack, layEvent);
        return false;
    });

    function Form_CallBack(obj, layEvent) {
        //console.log(obj);
        if (typeof obj === "undefined") {
            layer.msg(obj.message);
            return;
        } else if (obj.status != 200) {
            layer.msg(obj.message);
            return;
        }
        switch (layEvent) {
            case "edit":
                layer.msg("修改成功！");
                break;
            case "add_next_org":
                layer.msg("增加下级节点成功！");
                break;
            case "add":
                layer.msg("添加成功！");
                break;
        }
        setTimeout(function () { location.href = "./institutions.html"; }, 1000);
    }

    //初始化页面
    var args = GetRequest(location.search);
    //console.log(args);
    if (typeof (args) != typeof (undefined)) {

        urlrelated.requestBody.data = {
            "jgxxJgid": args.id
        }
        //获取表格数据
        Post(urlrelated.getOrganizationDetailById, JSON.stringify(urlrelated.requestBody), SetElementValue, args.layEvent);
    }

});
