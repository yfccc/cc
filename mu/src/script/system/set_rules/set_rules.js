layui.use(['table', 'form', "layer", "urlrelated", "extension"], function () {
    var laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        extension = layui.extension,
        urlrelated = layui.urlrelated,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
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
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"))

    //获取权限信息
    var powerControl = $("#querytype").val();
    //console.log(powerControl);
    //获取当前登录用户的权限
    var pagepower = extension.getPagePower("规则管理");
    urlrelated.requestBody.data = {
        "userId": loginuserinfo.userId,
        "userName": "",
        "jgdm": "",
        "userJGDM": loginuserinfo.userJGDM,
        "queryType": pagepower.queryType,
        "notifiedBody": pagepower.notifiedBody
    }
    table.render({
        elem: '#rules-table-page',
        toolbar: "#table-hreader",
        url: urlrelated.querySyncRuleList,
        method: 'post',
        contentType: "application/json;charset=UTF-8", //推荐写这个
        where: urlrelated.requestBody,
        defaultToolbar: ['filter'],
        even: true,
        limits: [10, 20, 30],
        cols: [
            [{
                field: 'userName',
                title: '用户名称'
            }, {
                field: 'roleName',
                title: '角色名称'
            }, {
                field: 'isrRule',
                minWidth: '180',
                title: '同步规则'
            }, {
                field: 'isrAppointedTime',
                minWidth: 100,
                title: '同步时间'
            }, {
                field: 'isrFailingTime',
                minWidth: 100,
                title: '失败同步时间'
            }, {
                field: 'jgmc',
                title: '用户归属机构'
            }, {
                field: 'createTime',
                minWidth: 165,
                title: '创建时间'
            }, {
                field: 'updateTime',
                minWidth: 165,
                title: '修改时间'
            }, {
                field: '',
                title: '操作',
                minWidth: '180',
                align: 'center',
                fixed: 'right',
                toolbar: '#rules-table-operate'
            }]
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
                "data": res.data.records //解析数据列表
            };
        }
    });
    table.on('tool(rules-table-operate)', function (obj) {
        var data = obj.data;
        //console.log(obj);
        if (obj.event === 'edit') {
            changeRules("edit", data)
        } else if (obj.event === 'detail') {
            changeRules("detail", data)
        }
    });
    //增改规则
    function changeRules(operatetype, info) {
        var changeData = "edit";
        var titleinfo = "编辑规则";
        var btngroup = ['确定', '取消'];
        if (operatetype == "edit") {
            changeData = "edit";
            titleinfo = "编辑规则";
            btngroup = ['确定', '取消'];
        } else if (operatetype == "detail") {
            changeData = "detail";
            titleinfo = "查看规则";
            btngroup = ['确定','取消'];
        }
        var isclickyes = false;
        layer.open({
            title: '<span style="font-weight: 650;font-size: 16px;">' + titleinfo + '</span>',
            type: 2,
            move: false,
            area: ["755px", "430px"],
            resize: false,
            content: ['/html/system/set_rules/change_rules.html?type=' + changeData + '&userId=' + info.userId + '&isrId=' + info.isrId, "no"],
            btn: btngroup,
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                body.find("#changeSubmit").click();
                isclickyes = true;
                // layer.close(index);
            },
            btn2: function (index, layero) {
                isclickyes = false;
            },
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                if (operatetype != "add") {
                    body.find('#isrAppointedTime').val(info.ctDecrible);
                    body.find('#isreAppointedTime').val(info.ctId);
                    body.find('#isrAppointedNum').val(info.ctRemark);
                    $("input[name='isrRule'][value=" + info.isrRuleCode + "]").prop('checked', true);
                }
                if (operatetype == "detail") {
                    $("#isrAppointedTime").prop('disabled', true);
                    $("#isreAppointedTime").prop('disabled', true);
                    $("#isrAppointedNum").prop('disabled', true);
                    $("input[name='isrRule']").each(function (i, e) {
                        $(e).prop('disabled', true);
                    });
                    $(".layui-layer .layui-layer-btn .layui-layer-btn0").hide();
                }
            },
            end: function () {
                if (isclickyes && changeData != "detail") {
                    table.reload('rules-table-page', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    });
                }
            }
        });
    }
    //查询数据按钮
    form.on('submit(searchinfo)', function (data) {
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        //去除空格
        for (var key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        var jgdm = $("#prev_org").attr("data-jgdm");
        if (jgdm == undefined || jgdm == "" || jgdm == null) {
            jgdm = "";
        } else {
            jgdm = jgdm + '';
        }
        table.reload('rules-table-page', {
            where: {
                data: {
                    userName: data.field.userName,
                    jgdm: jgdm,
                }
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //重置
    $("#reset_btn").on("click", function () {
        $("#userName,#prev_org").val('');
        $("#prev_org").removeAttr("data-jgdm");
        selectTreeOrg = new Array();
    });
    var selectTreeOrg = new Array();
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
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                selectTreeOrg = iframeWin.getSelectOrg();
                // console.log(selectTreeOrg);
                if (selectTreeOrg.length == 0) {
                    layer.msg("请选择组织机构");
                    return;
                }
                $("#prev_org").val(selectTreeOrg[0].title);
                $("#prev_org").attr("data-jgdm", selectTreeOrg[0].treeId);
                layer.close(index);
            },
            success: function (layero, index) {}
        });
    });

});