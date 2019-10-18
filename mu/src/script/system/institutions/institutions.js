var selectedTreeId = '';
var selectedjgdm = '';
layui.use(['table', 'form', 'urlrelated', 'tree', 'extension'], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        table = layui.table,
        $ = layui.$,
        extension = layui.extension,
        tree = layui.tree,
        form = layui.form,
        loginuserinfo = extension.getUserInfo(); //获取用户登录信息
    form.render();
    $("#querytype").val(localStorage.getItem("querytypeItem"));
    $("body", parent.document).find('#sub-title').html('组织机构');
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
    var treeOpInfo = {
        selectedElement: {
            data: null,
            elem: null
        },
        checkedItems: []
    };
    var isTreeSingleType = true;

    function convertJsonToTreeData(jsonData) {
        var treeData = [];

        for (var i = 0; i < jsonData.length; i++) {
            treeItemIndex++;
            //分层级获取时，需手动添加一个假子级元素{title: '',id:-1}
            var treeItem = {
                title: jsonData[i].jgxxGajgjgmc + "(" + jsonData[i].jgxxGajgjgdm + ")",
                id: treeItemIndex,
                treeId: jsonData[i].jgxxJgid,
                treeName: jsonData[i].jgxxGajgjgmc,
                treeCode: jsonData[i].jgxxGajgjgdm,
                children: [{
                    title: '',
                    id: -1
                }]
            };

            if (jsonData[i].children != undefined && jsonData[i].children.length > 0) {
                treeItem.children = convertJsonToTreeData(jsonData[i].children);
            }

            treeData.push(treeItem);
        }

        return treeData;
    }

    function setCurrentSelectNode(elem) {
        var idValue, idSource = $(elem).data();

        if (idSource != undefined && idSource != null) {
            idSource = idSource.id;
            $(".layui-tree-txt").each(function (index, item) {
                idValue = $(item).parent().parent().parent().data().id;
                $(item).removeClass("tree-node-selected");
                if (idValue == idSource) {
                    $(item).addClass("tree-node-selected");
                }
            });
        }
    }
    //分层级获取时，需手动添加一个假子级元素{title: '',id:-1}
    var treeData = [],
        treeItemIndex = 0;

    //获取权限信息和登录信息
    var powerControl = $("#querytype").val();
    // console.log(powerControl);

    urlrelated.requestBody.data = {
        "currentOrgCode": loginuserinfo.userJGDM,
        "chirdOrgCode": "-1",
        "queryType": urlrelated.requestBodyTree.queryTypeTree,
        "orgListQueryTypeEq4": urlrelated.requestBodyTree.orgListQueryTypeEq4Tree
    }

    function loadSubItems(parentInfo) {
        urlrelated.requestBody.data.chirdOrgCode = parentInfo.treeCode;
        urlrelated.requestBody.data.queryType = 1;
        urlrelated.requestBody.data.orgListQueryTypeEq4 = [];
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: urlrelated.getOrganizationTree,
            data: JSON.stringify(urlrelated.requestBody),
            type: "post",
            dataType: "json",
            timeout: 120000,
            contentType: "application/json",
            async: true,
            success: function (result) {
                layer.close(loadingIndex);
                if (result.status == 200) {
                    var tempData = convertJsonToTreeData(result.data);
                    // $.each(treeData, function (index, item) {
                    //     if (item.treeCode == parentInfo.treeCode) {
                    //         item.children = [];
                    //         $.each(tempData, function (index, item1) {
                    //             item.children.push(item1);
                    //         });
                    //         return false;
                    //     }
                    // });
                    function addAllItems(treedata) {
                        $.each(treedata, function (index, item) {
                            if (item.treeId == parentInfo.treeId) {
                                // item["spread"] = true;
                                item.children = [];
                                $.each(tempData, function (index, item1) {
                                    item.children.push(item1);
                                });
                                return false;
                            } else if (item.children != undefined && item.children.length > 0 && item.children[0].id != -1) {
                                addAllItems(item.children);
                            }
                        });
                    }
                    addAllItems(treeData);
                    tree.reload('treeInstitutions', {
                        data: treeData
                    });
                    tree.addAllSubItems('treeInstitutions', parentInfo, tempData);
                    if (isTreeSingleType != true) {
                        var ids = $.map(treeOpInfo.checkedItems, function (item) {
                            return parseInt(item.id);
                        });
                        tree.setChecked('treeInstitutions', ids); //勾选指定节点
                    }

                    setCurrentSelectNode(treeOpInfo.selectedElement.elem);
                } else {
                    layer.msg(result.message);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorLogin();
            }
        });
    }
    var loadingIndex1 = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        url: urlrelated.getOrganizationTree,
        data: JSON.stringify(urlrelated.requestBody),
        type: "post",
        dataType: "json",
        timeout: 120000,
        contentType: "application/json;charset=UTF-8",
        async: true,
        success: function (result) {
            //console.log(result);
            layer.close(loadingIndex1);
            if (result.status == 200) {
                treeData = convertJsonToTreeData(result.data);
                // console.log(treeData)
                tree.render({
                    elem: '#main_org_tree', //绑定元素
                    showCheckbox: !isTreeSingleType, //是否显示复选框
                    data: treeData,
                    // treeDefaultClose: false,
                    id: 'treeInstitutions',
                    click: function (obj) {
                        if (obj.state == "iconClick") {
                            // debugger
                            function itemAddSpread(treedata) {
                                for (var i = 0; i < treedata.length; i++) {
                                    if (treedata[i].treeId == obj.data.treeId) {
                                        treedata[i]["spread"] = obj.isExpand
                                        return false
                                    } else if (treedata[i].children != undefined && treedata[i].children.length > 0 && treedata[i].children[0].id != -1) {
                                        itemAddSpread(treedata[i].children);
                                    }
                                }
                            }
                            itemAddSpread(treeData);
                            if (obj.isExpand && obj.data.children.length > 0 && obj.data.children[0].id == -1) {
                                //console.log(obj.data);
                                loadSubItems(obj.data);
                            }
                        } else {
                            if (isTreeSingleType == true) {
                                selectedTreeId = obj.data.treeId;
                                selectedjgdm = obj.data.treeCode;
                                treeOpInfo.selectedElement.data = obj.data;
                                treeOpInfo.selectedElement.elem = obj.elem;
                                setCurrentSelectNode(obj.elem);
                            } else {
                                setCurrentSelectNode(obj.elem);
                            }
                        }
                    }
                });
                // $(".layui-tree-main").click(); 
            } else {
                layer.msg(result.message);
            }
        },
        error: function (tt) {
            layer.close(loadingIndex1);
            //只要进error就跳转到登录页面
            extension.errorLogin();
        }
    });

    $(".changegroup").on("click", function () {
        var layEvent = $(this).data().event;
        switch (layEvent) {
            case "edit": //编辑
            case "add_next_org": //新增下级组织
                if (selectedTreeId == "" || selectedTreeId == undefined) {
                    layer.msg("请先选中一条记录");
                    return;
                }
                location.href = "./add_institutious.html?id=" + selectedTreeId + "&layEvent=" + layEvent;
                break;
            case "add":

                location.href = "./add_institutious.html?id=" + "" + "&layEvent=" + layEvent;
                break;
            case "del":
                if (selectedTreeId == "" || selectedTreeId == undefined) {
                    layer.msg("请先选中一条记录");
                    return;
                }
                DeleteUser(selectedjgdm);
                break;
        }
    });

    function DeleteUser(id) {
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '删除确认',
            resize: false
        }, function (index) {

            urlrelated.requestBody.data = {
                "userId": loginuserinfo.userId,
                "jgxxGajgjgdm": id
            }
            var loadingIndex2 = layer.load(1, {
                shade: 0.3
            });
            $.ajax({
                url: urlrelated.deleteOrganization,
                type: "post",
                async: true,
                data: JSON.stringify(urlrelated.requestBody),
                cache: false,
                timeout: 120000,
                contentType: "application/json;charset=UTF-8", //推荐写这个
                dataType: "json",
                success: function (res) {
                    layer.close(loadingIndex2);
                    if (res.status == 200) {
                        //在树形数据中找到删除的数据
                        function RemoveTreeData(jsonData) {
                            for (var i = 0; i < jsonData.length; i++) {
                                if (jsonData[i].treeCode == id) {
                                    jsonData.splice(i, 1);
                                    break
                                }
                                if (jsonData[i].children != undefined && jsonData[i].children.length > 0) {
                                    RemoveTreeData(jsonData[i].children);
                                }
                            }
                        }
                        RemoveTreeData(treeData);

                        tree.reload('treeInstitutions', {
                            data: treeData
                        });
                        selectedTreeId = "";
                        layer.msg(res.message);
                    } else {
                        layer.msg(res.message);
                    }
                },
                error: function (tt) {
                    layer.close(loadingIndex2);
                    //只要进error就跳转到登录页面
                    extension.errorLogin();
                }
            });
            layer.close(index);
        });
    }

    // table.render({
    //     elem: '#org_tab'
    //     , data: []
    //     , limits: [10, 20, 30]
    //     , toolbar: "#add"
    //     , cols: [[
    //         { field: 'jgxxGajgjgmc', title: '机构名称' }
    //         , { field: 'jgxxGajgjgdm', title: '机构编号' }
    //         , { title: '操作', toolbar: '#row_opt' }
    //     ]]
    //     , loading: false
    //     , page: true
    //     , where: {
    //         time: new Date()
    //     }
    // });

    // //重新加载表格
    // function TableReload(tab_data, tab_id) {
    //     table.reload(tab_id, {
    //         data: tab_data
    //     });
    // }
    // //获取数据
    // function Post(url, datas_json_str, tab_id, callback) {
    //     $.ajax({
    //         url: url,
    //         type: "post",
    //         async: false,
    //         data: datas_json_str,
    //         cache: false,
    //         contentType: "application/json;charset=UTF-8",
    //         dataType: "json",
    //         success: function (res) {
    //             callback(res.data, tab_id);
    //         },
    //         error: function (err) {
    //             //console.log(err);
    //         }
    //     });
    // }

    // var d = {
    //     "platform": "ios/android/pc",
    //     "appversion": "1.0.3",
    //     "apiversion": "1.0.2",
    //     "imei": "12345678",
    //     "signature": "xxxxxx",
    //     "token": "xxxxxxxxxxxx",
    //     "data": {
    //         "currentOrgCode": "110108000000",
    //         "chirdOrgCode": "-1",
    //         "queryType": "1",
    //         "orgListQueryTypeEq4": [

    //         ]
    //     }
    // };
    // //获取表格数据
    // Post(urlrelated.getOrganizationTree, JSON.stringify(d), 'org_tab', TableReload);

    // table.on('tool(org_tab_filter)', function (obj) {
    //     var data = obj.data; //获得当前行数据
    //     //console.log("行数据", data);
    //     var layEvent = obj.event; //获得 lay-event 对应的值
    //     switch (layEvent) {
    //         case "edit": //编辑
    //             location.href = "./add_institutious.html?id=" + data.jgxxJgid + "&layEvent=" + layEvent;
    //             break;
    //         case "add_next_org": //新增下级组织
    //             location.href = "./add_institutious.html?id=" + data.jgxxJgid + "&layEvent=" + layEvent;
    //             break;
    //     }
    // });
    // table.on('toolbar(org_tab_filter)', function (obj) {
    //     //console.log("头工具栏");
    //     var layEvent = obj.event; //获得 lay-event 对应的值
    //     if (layEvent === "add") {
    //         location.href = "./add_institutious.html?id=" + "" + "&layEvent=" + layEvent;
    //     }
    // });
});