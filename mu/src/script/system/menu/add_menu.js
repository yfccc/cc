layui.use(['table', 'form', 'extension', 'urlrelated'], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        urlrelated = layui.urlrelated,
        extension = layui.extension,
        $ = layui.$,
        layer = layui.layer,
        loginuserinfo = extension.getUserInfo() //获取用户登录信息
        ,
        form = layui.form;
    form.render();
    var layEvent;
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
    form.verify({
        numsort: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value != "" && value != null) {
                if (!new RegExp("^[1-9]\d*|0$").test(value)) {
                    return '只能输入数字';
                }
            }
        }
    });
    //获取url中传递的参数
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
    //填写结果
    function SetValCallback(res, layEvent) {
        //判断结果
        if (res.status === 200) {
            data = res.data;
            if (layEvent === 'details' || layEvent === 'edit') { //查看
                $("#prev_org_id").val(data.modelParentid);
                $("#org_id").val(data.modelId);
                $("#prev_org").val(data.modelNameParent);
                $("#org_name").val(data.modelName);
                $("input[name='modelStatus'][value=" + data.modelStatus + "]").prop('checked', true);
                $("input[name='modelType'][value=" + data.modelType + "]").prop('checked', true);
                $("input[name='modelData'][value=" + data.modelData + "]").prop('checked', true);
                $("#link").val(data.modelUrl);
                $("#purview_sign").val(data.modelAuthority);
                $("#description").val(data.modelRemark);
                $("#modelIcon").val(data.modelIcon);
                $("#modelSort").val(data.modelSort);
                form.render();
            } else if (layEvent === 'add_next') { //增加下级菜单
                $("#prev_org_id").val(data.modelId);
                $("#prev_org").val(data.modelName);
            }
        } else {
            layer.msg(res.message);
        }
    }
    form.on('radio(receiveobj)', function (data) {
        //console.log(data.value); //被点击的radio的value值
        //如果val是1为菜单
        if (data.value == "1") {
            $(".data-auth").show();
        } else if (data.value == "2") {
            $(".data-auth").hide();

        }
    });
    //获取数据
    function post(url, datas_json_str, layEvent, callback) {
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
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex);
                callback(res, layEvent);
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        });
    }
    //设置页面元素状态
    function SetElementStatus(layEvent) {
        $("body", parent.document).find('#sub-title').html('菜单管理>新增');
        if (layEvent === 'details') { //查看
            // $("#menutitle").text("查看菜单");
            $("body", parent.document).find('#sub-title').html('菜单管理>查看');
            $(".mustfill").hide();
            $("#select_org").off('click');
            $("#prev_org").prop('disabled', true);
            $("#org_name").prop('disabled', true);
            $("input[name='modelStatus']").each(function (i, e) {
                $(e).prop('disabled', true);
            });
            $("input[name='modelType']").each(function (i, e) {
                $(e).prop('disabled', true);
            });
            $("input[name='modelData']").each(function (i, e) {
                $(e).prop('disabled', true);
            });
            $("#link").prop('disabled', true);
            $("#purview_sign").prop('disabled', true);
            $("#description").prop('disabled', true);
            $("#modelIcon").prop('disabled', true);
            $("#modelSort").prop('disabled', true);
            $("#btn_submit").hide();
        } else if (layEvent === 'edit') { //编辑
            // $("#menutitle").text("编辑菜单");
            $("body", parent.document).find('#sub-title').html('菜单管理>编辑');
        } else if (layEvent === 'add_next') { //增加下级菜单
            $("body", parent.document).find('#sub-title').html('菜单管理>添加下级菜单');
            // $("#menutitle").text("新增下级菜单");
        }
    }
    //输出 提示
    function TestConsoleLog(res, layEvent) {
        //console.log(res);
        if (res.status === 200) {
            layer.msg(layEvent === 'edit' ? "修改成功" : "新增成功");
        } else {
            layer.msg(res.message);
        }
    }

    $("#select_org").on("click", function () {
        localStorage.setItem("currentOrgCodeTree", loginuserinfo.userJGDM);
        localStorage.setItem("chirdOrgCodeTree", "440115000000");
        localStorage.setItem("queryTypeTree", loginuserinfo.querytypeItem);
        localStorage.setItem("orgListQueryTypeEq4Tree", loginuserinfo.models);
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">选择菜单</span>',
            type: 2,
            move: false,
            area: [extension.getDialogSize().width, extension.getDialogSize().height],
            resize: false,
            content: ['/html/system/institutions/select_institutions.html?tree_type=single&mode=getMenu', "no"],
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var org_info = iframeWin.getSelectOrg();
                $("#prev_org").val(org_info[0].title);
                $("#prev_org_id").val(org_info[0].treeId);
                layer.close(index);
            },

            success: function (layero, index) {

                var iframeWin = window[layero.find('iframe')[0]['name']];
                //设置选择组织机构滚动条
                var add_scroll_section = iframeWin.document.getElementsByClassName("section");
                //初始化树
                // iframeWin.layui.initTree("single");
                $(add_scroll_section).css('overflow-y', 'auto');
                var iframe_height = iframeWin.innerHeight;
                $(add_scroll_section).css('height', iframe_height);
            }
        });
    });

    form.on('submit(go)', function (data) {
        //console.log(JSON.stringify(data.field));
        //调用修改接口
        urlrelated.requestBody.data = data.field;
        switch (layEvent) {
            case 'edit':
                if (data.field.modelParentid == data.field.modelId) {
                    layer.msg('上级菜单不能选择自己');
                    return false;
                }
                post(urlrelated.modifyMenuDetails, JSON.stringify(urlrelated.requestBody), layEvent, TestConsoleLog);
                break;
            case 'add_next':
            case 'opt_add':
                post(urlrelated.addMenu, JSON.stringify(urlrelated.requestBody), layEvent, TestConsoleLog);
                break;
        }
        setTimeout(function () {
            location.href = "./menu.html";
        }, 1000);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //获取参数
    var page_obj = GetRequest(location.search);
    layEvent = page_obj.layEvent;
    //设置页面元素状态
    SetElementStatus(page_obj.layEvent);

    urlrelated.requestBody.data = {
        "modelId": page_obj.id
    }
    post(urlrelated.searchMenuDetails, JSON.stringify(urlrelated.requestBody), layEvent, SetValCallback);

});