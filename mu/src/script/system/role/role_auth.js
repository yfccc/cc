layui.config({
    base: '/layui/layui'
}).extend({
    treetable: '/lay/modules/treetable'
}).use(["table", "treetable", "layer"], function () {
    var table = layui.table,
        layer = layui.layer,
        treetable = layui.treetable;
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
    $("body", parent.document).find('#sub-title').html('权限设置');

    function getRequestParams(url) {
        var params = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return params;
    }
    var urlinfo = getRequestParams(location.search);
    //通过缓存获取url地址
    var serverBase = localStorage.serverBase;
    var requestData = {
        "platform": "1007",
        "appversion": "1.0.3",
        "apiversion": "1.0.2",
        "imei": "12345678",
        "signature": "xxxxxx",
        "token": localStorage.getItem("token"),
        "data": {
            "roleId": urlinfo.roleid,
            "userId": localStorage.userId
        }
    }
    var loadingIndex = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        url: serverBase + "SysManage/role/getAuthorityList",
        type: "post",
        async: true,
        data: JSON.stringify(requestData),
        cache: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (res) {
            layer.close(loadingIndex);
            // console.log(res)
            if (res.status === 200) {
                // 渲染表格
                var resData = res.data.modelList;
                table = $.extend(table, {
                    config: {
                        checkName: 'hasAuthority'
                    }
                });
                treetable.render({
                    treeColIndex: 1,
                    treeSpid: 0,
                    treeIdName: 'modelId',
                    treePidName: 'modelParentid',
                    data: resData,
                    elem: '#table1',
                    // url: '/json/menus.json',
                    url: serverBase + 'SysManage/role/getAuthorityList',
                    page: false,
                    cols: [
                        [{
                            type: 'checkbox'
                        },
                        {
                            field: 'modelName',
                            minWidth: 200,
                            title: '菜单名称'
                        },
                        {
                            field: '',
                            title: '所属机构',
                            templet: function (d) {
                                var radiolist = '';
                                var jgdmval = '';
                                var jgmcval = '';
                                if (d.queryType == 4 && d.orgIds != null && d.orgIds.length != 0) {
                                    for (var i = 0; i < d.orgIds.length; i++) {
                                        jgdmval += d.orgIds[i] + ",";
                                        if (d.orgNames != null && d.orgNames.length > 0) {
                                            jgmcval += d.orgNames[i] + ",";
                                        }
                                    }
                                    jgdmval = jgdmval.substring(0, jgdmval.lastIndexOf(','));
                                    jgmcval = jgmcval.substring(0, jgmcval.lastIndexOf(','));
                                }
                                if (d.modelData == 1) {
                                    radiolist +=
                                        '<div class="layui-form-item bixuan">' +
                                        '<div class="layui-input-block">' +
                                        '<div class="layui-input-block" style="display: inline-block;margin-left:0;" class="opinionType">';
                                    if (decodeURI(urlinfo.rolename) == "超级管理员") {
                                        radiolist += '<input type="radio" lay-filter="opiniontype" name="queryType' + d.modelId + '" value="1" title="全部" class="hidetree" ' + ((d.queryType == null || d.queryType == 1) ? 'checked="true"' : '') + '><br>'+
                                        '<input type="radio" lay-filter="opiniontype" name="queryType' + d.modelId + '" value="2" title="所在机构及下级机构" class="hidetree" ' + (d.queryType == 2 ? 'checked="true"' : '') + '><br>' 
                                    }else{
                                        radiolist +='<input type="radio" lay-filter="opiniontype" name="queryType' + d.modelId + '" value="2" title="所在机构及下级机构" class="hidetree" ' + ((d.queryType == null || d.queryType == 2) ? 'checked="true"' : '') + '><br>' 
                                    }
                                    radiolist +=
                                        '<input type="radio" lay-filter="opiniontype" name="queryType' + d.modelId + '" value="3" title="仅本人数据" class="hidetree" ' + (d.queryType == 3 ? 'checked="true"' : '') + '><br>';
                                    if (decodeURI(urlinfo.rolename) == "超级管理员") {
                                        radiolist += '<input type="radio" lay-filter="opiniontype" name="queryType' + d.modelId + '" value="4" title="指定机构" class="showtree" ' + (d.queryType == 4 ? 'checked="true"' : '') + '><br>';
                                    }
                                    radiolist += '<div class="layui-input-inline select_org"' + (d.queryType == 4 ? '' : 'style="display:none;"') + '>' +
                                        '<input type="text" name="modelName' + d.modelId + '" data-orgid="' + jgdmval + '" value="' + jgmcval + '" disabled placeholder="请指定机构" autocomplete="off" class="layui-input prev_org">' +
                                        '<i class="layui-icon layui-icon-search" style="font-size: 20px; position: absolute;top: 1px; right: 1px; background: #fff; width: 35px; height: 35px; text-align: center; line-height: 35px;"></i>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>'
                                }
                                return radiolist
                            }
                        },
                        ]
                    ],
                    done: function (res) {

                        var selectTreeOrg = {};
                        $(".select_org").on("click", function () {
                            var $this = $(this);
                            localStorage.setItem("currentOrgCodeTree", localStorage.getItem("userJGDM"));
                            localStorage.setItem("chirdOrgCodeTree", "-1");
                            localStorage.setItem("queryTypeTree", localStorage.getItem("querytypeItem"));
                            localStorage.setItem("orgListQueryTypeEq4Tree", localStorage.getItem("models"));
                            layer.open({
                                title: '选择机构',
                                type: 2,
                                move: false,
                                area: [getDialogSize().width, getDialogSize().height],
                                resize: false,
                                content: ['/html/system/institutions/select_institutions.html?tree_type=multiple', "no"],
                                btn: ['确定', '取消'],
                                yes: function (index, layero) {
                                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                                    selectTreeOrg = iframeWin.getSelectOrg();
                                    // console.log(selectTreeOrg);
                                    if (selectTreeOrg.length == 0 || selectTreeOrg == []) {
                                        layer.msg("请至少勾选一个机构");
                                        return;
                                    }
                                    var orgIds = "";
                                    var prev_orgval = "";
                                    for (var i = 0; i < selectTreeOrg.length; i++) {
                                        prev_orgval += selectTreeOrg[i].title + ",";
                                        orgIds += selectTreeOrg[i].treeId + ",";
                                    }
                                    prev_orgval = prev_orgval.substring(0, prev_orgval.lastIndexOf(','));
                                    orgIds = orgIds.substring(0, orgIds.lastIndexOf(','));
                                    $this.find(".prev_org").val(prev_orgval);
                                    $this.find(".prev_org").attr("data-orgid", orgIds);

                                    layer.close(index);
                                },
                                success: function (layero, index) {

                                }
                            });
                        });
                        $(".showtree").next().on("click", function () {
                            $(this).siblings(".select_org").show();
                        })
                        $(".hidetree").next().on("click", function () {
                            $(this).siblings(".select_org").hide();
                        })
                        //鼠标滑过显示文本信息
                        $(".select_org").on('mouseenter', function () {
                            var obj = $(this).find(".prev_org");
                            if (obj.val() != 0 && obj.val() != '') {
                                var value = obj.val();
                                $(this).attr("title", value);
                            }
                        });
                    }
                });
            } else {
                layer.msg(res.message);
            }
        },
        error: function (xml, textstatus, thrown) {
            layer.close(loadingIndex);
            //只要进error就跳转到登录页面
            layer.open({
                type: 0,
                title: "<div style='font-weight:bold;color:red'>提示</div>",
                btn: ["确定"],
                resize: false,
                area: ["450px", "210px"],
                content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>账号已过期或系统错误，请重新登录</span></div>",
                btn1: function (index) {
                    // 点击退出
                    // window.location.reload()
                    window.parent.location.href = "/login.html"
                },
                cancel: function () {
                    // window.location.reload()
                    window.parent.location.href = "/login.html"
                }
            })
        }
    });

    function getDialogSize() {
        //弹窗大小
        if ($(window).width() < 1130) {
            return {
                width: 520 + "px",
                height: 370 + "px"
            }
        } else {
            return {
                width: 755 + "px",
                height: 430 + "px"
            }
        }
    }
    //监听工具条
    table.on('tool(table1)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;

        if (layEvent === 'del') {
            layer.msg('删除' + data.id);
        } else if (layEvent === 'edit') {
            layer.msg('修改' + data.id);
        }
    });
    var active = {
        getCheckData: function () { //获取选中数据
            var checkStatus = table.checkStatus('table1'),
                data = checkStatus.data;
            // console.log(data);
            // debugger
            var menuList = [];
            var allowsubmit = true;
            for (var i = 0; i < data.length; i++) {
                var queryType = '';
                var orgIdStr = '';
                queryType = $('input[name="queryType' + data[i].modelId + '"]:checked').val();
                orgIdStr = $('input[name="modelName' + data[i].modelId + '"]').attr("data-orgid");
                if (queryType == undefined) {
                    queryType = "1";
                }
                if (queryType == 4 && orgIdStr == "") {
                    layer.msg("请指定" + data[i].modelName + "的机构");
                    $('input[name="modelName' + data[i].modelId + '"]').parent().css("border", "1px solid #FF5722");
                    setTimeout(function () {
                        $('input[name="modelName' + data[i].modelId + '"]').parent().css("border", "none");
                    }, 3000);
                    $('input[name="modelName' + data[i].modelId + '"]').parent().focus()
                    allowsubmit = false;
                    // debugger
                    break;
                }
                if (orgIdStr == undefined || orgIdStr == "") {
                    orgIdStr = [];
                } else {
                    orgIdStr = orgIdStr.split(",");
                }
                var data1 = {
                    "modelId": data[i].modelId,
                    "queryType": queryType,
                    "orgIds": orgIdStr
                }
                menuList.push(data1);
            }
            if (allowsubmit) {
                // console.log(menuList);
                SetModelList(menuList);
            }

        }
    };
    $("#submit_multiple").on("click", function () {
        active.getCheckData();
    });

    function SetModelList(menuList) {
        var requestdata = {
            "platform": "1007",
            "appversion": "1.0.3",
            "apiversion": "1.0.2",
            "imei": "12345678",
            "signature": "xxxxxx",
            "token": localStorage.getItem("token"),
            "data": {
                "roleId": urlinfo.roleid,
                "modelList": menuList
            }
        }
        var loadingIndex2 = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: serverBase + "SysManage/role/setAuthority",
            type: "post",
            async: true,
            data: JSON.stringify(requestdata),
            cache: false,
            contentType: "application/json;charset=UTF-8", //推荐写这个
            dataType: "json",
            success: function (res) {
                layer.close(loadingIndex2);
                //console.log(res);
                if (res.status == 200) {
                    top.layer.msg("保存成功");
                    window.location.href = "./role.html";
                } else {
                    top.layer.msg(res.message);
                }
            },
            error: function (xml, textstatus, thrown) {
                layer.close(loadingIndex2);
                //只要进error就跳转到登录页面
                layer.open({
                    type: 0,
                    title: "<div style='font-weight:bold;color:red'>提示</div>",
                    btn: ["确定"],
                    resize: false,
                    area: ["450px", "210px"],
                    content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>账号已过期或系统错误，请重新登录</span></div>",
                    btn1: function (index) {
                        // 点击退出
                        // window.location.reload()
                        window.parent.location.href = "/login.html"
                    },
                    cancel: function () {
                        // window.location.reload()
                        window.parent.location.href = "/login.html"
                    }
                })
            }
        });
    }

    //但子菜单选中后自动选择父菜单，父菜单选中后默认显示子菜单
    var ischildrenclick = false;
    var isparentclick = false;
    table.on('checkbox(table1)', function (obj) {
        if (isparentclick || ischildrenclick) {
            return
        }
        if (obj.data.modelParentid == "0") {
            isparentclick = true;
            autoSelectParent(obj);
        } else {
            ischildremclick = true;
            autoSelectChildren(obj);
        }
    });

    function autoSelectParent(obj) {
        var tableinfo = JSON.parse(JSON.stringify(table.cache));
        //选中的是一级菜单
        for (var i = 0; i < tableinfo.table1.length; i++) {
            if (tableinfo.table1[i].modelParentid == obj.data.modelId) {
                var index = tableinfo.table1[i].undefined;
                if (obj.checked == true && !$('tr[data-index=' + index + ']').find(".layui-form-checkbox").hasClass("layui-form-checked")) {
                    $('tr[data-index=' + index + ']').find(".layui-form-checkbox").click();
                } else if ((obj.checked == false && $('tr[data-index=' + index + ']').find(".layui-form-checkbox").hasClass("layui-form-checked"))) {
                    $('tr[data-index=' + index + ']').find(".layui-form-checkbox").click();
                }
            }
        }
        isparentclick = false;
    }

    function autoSelectChildren(obj) {
        var tableinfo = JSON.parse(JSON.stringify(table.cache));
        //选中的是子菜单
        var arr = "";
        for (var i = 0; i < tableinfo.table1.length; i++) {
            if (tableinfo.table1[i].modelId == obj.data.modelParentid) {
                // debugger
                arr = tableinfo.table1[i].modelId; //获取当前选中子菜单的主菜单的id
                var index = tableinfo.table1[i].undefined;
                //直接选择子菜单，如果主菜单未选中，则自动选中主菜单
                if (obj.checked == true && !$('tr[data-index=' + index + ']').find(".layui-form-checkbox").hasClass("layui-form-checked")) {
                    ischildrenclick = true;
                    $('tr[data-index=' + index + ']').find(".layui-form-checkbox").click();
                }
                //判断是不是最后一个取消的子元素，如果选中的子元素的数量为0，一级菜单自动取消选择
                if (obj.checked == false && $('tr[data-index=' + index + ']').find(".layui-form-checkbox").hasClass("layui-form-checked")) {
                    var aaa = new Array();
                    //找到当前选中的子菜单的所有兄弟
                    for (var z = 0; z < tableinfo.table1.length; z++) {
                        if (tableinfo.table1[z].modelParentid == arr) {
                            aaa.push(tableinfo.table1[z].undefined);
                        }
                    }
                    var isnone = true; //是否自动取消主菜单选中状态
                    //判断所有子菜单是否都未选择，
                    for (var j = 0; j < aaa.length; j++) {
                        if ($('tr[data-index=' + aaa[j] + ']').find(".layui-form-checkbox").hasClass("layui-form-checked")) {
                            isnone = false;
                            break
                        }
                    }
                    //所有子菜单未选中，而现在主菜单是选中状态，取消主菜单的选中状态
                    if (isnone && $('tr[data-index=' + index + ']').find(".layui-form-checkbox").hasClass("layui-form-checked")) {
                        $('tr[data-index=' + index + ']').find(".layui-form-checkbox").click();
                    }

                }
            }
        }

        ischildrenclick = false;
    }
});