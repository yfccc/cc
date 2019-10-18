layui.use(['tree', 'urlrelated', 'extension'], function () {
    var tree = layui.tree,
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
    var treeOpInfo = {
        selectedElement: {
            data: null,
            elem: null
        },
        checkedItems: []
    };

    var expandNodes = new Array();

    urlrelated.requestBody.data = {
        "currentOrgCode": "",
        "chirdOrgCode": "",
        "queryType": "1",
        "orgListQueryTypeEq4": []
    };
    urlrelated.requestBody.data.currentOrgCode = urlrelated.requestBodyTree.currentOrgCodeTree;
    urlrelated.requestBody.data.chirdOrgCode = urlrelated.requestBodyTree.chirdOrgCodeTree;
    urlrelated.requestBody.data.queryType = urlrelated.requestBodyTree.queryTypeTree;
    urlrelated.requestBody.data.orgListQueryTypeEq4 = urlrelated.requestBodyTree.orgListQueryTypeEq4Tree;

    //设置选择组织机构滚动条
    $("#org_tree").height($(document).height() - 30);

    //分层级获取时，需手动添加一个假子级元素{title: '',id:-1}
    var treeData = [],
        treeItemIndex = 0;

    var params = extension.getRequestParams(location.search);
    var isTreeSingleType = true;
    var treeMode = 'org';
    var dataUrl = urlrelated.getOrganizationTree;
    if (params != null && !$.isEmptyObject(params)) {
        if (params.tree_type != undefined) {
            isTreeSingleType = params.tree_type.toLowerCase() == 'single';
        }

        if (params.mode != undefined) {
            treeMode = params.mode.toLowerCase();

            switch (treeMode) {
                case 'getuser':
                    dataUrl = urlrelated.roleMemberGetUser;
                    break;
                case 'getmenu':
                    dataUrl = urlrelated.searchMenuList;
                    urlrelated.requestBody.data = {
                        isTree: false
                    };
                    break;
                default:
                    dataUrl = urlrelated.getOrganizationTree;
                    break;
            }
        } else {
            dataUrl = urlrelated.getOrganizationTree;
        }
    }

    function setCurrentSelectNode(elem, state) {
        var idValue, idSource = $(elem).data();
        if (idSource != undefined && idSource != null) {
            idSource = idSource.id;
            if(state == "iconClick"){
                return
            }
            $(".layui-tree-txt").each(function (index, item) {
                idValue = $(item).parent().parent().parent().data().id;
                $(item).removeClass("tree-node-selected");
                if (idValue == idSource) {
                    $(item).addClass("tree-node-selected");
                }
            });
        }
    }

    function addSubItems(treeCurrentData, parentItemID, subItems) {
        var isAdded = false;

        for (var i = 0; i < treeCurrentData.length; i++) {
            if (treeCurrentData[i].id == parentItemID) {
                if (treeCurrentData[i].children == undefined) {
                    treeCurrentData[i].children = [];
                }
                for (var j = 0; j < subItems.length; j++) {
                    treeCurrentData[i].children.push(subItems[j]);
                }
                isAdded = true;
                return false;
            } else if (treeCurrentData[i].children != undefined && treeCurrentData[i].children.length > 0) {
                isAdded = addSubItems(treeCurrentData[i].children, parentItemID, subItems);
                if (isAdded) return false;
            }
        }

        return isAdded;
    }

    function convertJsonToTreeData(jsonData) {
        var tempTreeData = [];

        switch (treeMode) {
            case 'getuser':
                for (var i = 0; i < jsonData.length; i++) {
                    treeItemIndex++;
                    var treeUserItem = {
                        id: treeItemIndex,
                        isOrg: false
                    };

                    if (jsonData[i].userRealname == null || jsonData[i].userRealname == "") {
                        treeUserItem.disabled = true;
                        treeUserItem.title = jsonData[i].jgxxGajgjgmc;
                        treeUserItem.treeId = jsonData[i].jgxxGajgjgdm;
                        treeUserItem.children = [{
                            title: '',
                            id: -1
                        }];
                        if (jsonData[i].children != undefined && jsonData[i].children.length > 0) {
                            treeUserItem.children = convertJsonToTreeData(jsonData[i].children);
                        }
                    } else {
                        treeUserItem.title = jsonData[i].userRealname;
                        treeUserItem.treeId = jsonData[i].userId;
                        treeUserItem.policeid = jsonData[i].userPoliceId;
                        treeUserItem.jgdm = jsonData[i].jgxxGajgjgdm;
                        treeUserItem.jgid = jsonData[i].jgxxJgid;
                        treeUserItem.jgmc = jsonData[i].jgxxgajgjgmc;
                        treeUserItem.children = [];
                    }

                    tempTreeData.push(treeUserItem);
                }
                break;
            case 'getmenu':
                for (var j = 0; j < jsonData.length; j++) {
                    if (jsonData[j].modelType == 1) //是菜单
                    {
                        treeItemIndex++;
                        var treeMenuItem = {
                            title: jsonData[j].modelName,
                            id: treeItemIndex,
                            treeId: jsonData[j].modelId
                        };

                        if (jsonData[j].modelParentid == 0) {
                            tempTreeData.push(treeMenuItem);
                        } else {
                            addSubItems(tempTreeData, jsonData[j].modelParentid, [treeMenuItem]);
                        }
                    }
                }
                break;
            default:
                for (var k = 0; k < jsonData.length; k++) {
                    treeItemIndex++;
                    //分层级获取时，需手动添加一个假子级元素{title: '',id:-1}
                    var treeOrgItem = {
                        title: jsonData[k].jgxxGajgjgmc,
                        id: treeItemIndex,
                        treeId: jsonData[k].jgxxGajgjgdm,
                        jgId: jsonData[k].jgxxJgid,
                        children: [{
                            title: '',
                            id: -1
                        }]
                    };

                    if (jsonData[k].children != undefined && jsonData[k].children.length > 0) {
                        treeOrgItem.children = convertJsonToTreeData(jsonData[k].children);
                    }

                    tempTreeData.push(treeOrgItem);
                }
                break;
        }

        return tempTreeData;
    }

    function loadSubItems(parentInfo) {
        switch (treeMode) {
            case 'getuser':
                urlrelated.requestBody.data.chirdOrgCode = parentInfo.treeId;
                break;
            case 'getmenu':
                urlrelated.requestBody.data.isTree = false;
                break;
            default:
                urlrelated.requestBody.data.chirdOrgCode = parentInfo.treeId;
                break;
        }
        var loadingIndex = layer.load(1, {
            shade: 0.3
        });
        $.ajax({
            url: dataUrl,
            data: JSON.stringify(urlrelated.requestBody),
            type: "post",
            dataType: "json",
            timeout: 120000,
            contentType: "application/json",
            // async: false,
            success: function (result) {
                layer.close(loadingIndex);
                if (result.status == 200) {
                    var tempData = convertJsonToTreeData(result.data);

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
                    setCurrentSelectNode(treeOpInfo.selectedElement.elem, null);
                }
            },
            error: function (tt) {
                layer.close(loadingIndex);
                //只要进error就跳转到登录页面
                extension.errorInOpen();
            }
        });
    }
    var loadingIndex1 = layer.load(1, {
        shade: 0.3
    });
    $.ajax({
        url: dataUrl,
        data: JSON.stringify(urlrelated.requestBody),
        type: "post",
        dataType: "json",
        contentType: "application/json",
        // async: false,
        timeout: 120000,
        success: function (result) {
            layer.close(loadingIndex1);
            if (result.status == 200) {
                expandNodes = [];
                treeData = convertJsonToTreeData(result.data);
                tree.render({
                    elem: '#org_tree', //绑定元素
                    showCheckbox: !isTreeSingleType, //是否显示复选框
                    data: treeData,
                    id: 'treeInstitutions',
                    click: function (obj) {
                        if (obj.state == "iconClick") {
                            if (treeMode == "getmenu")
                                return;
                            // //遍历treedata   找到当前的treeid   然后赋值spread = obj.isExpand
                            // for (var i = 0; i < treeData.length; i++) {
                            //     if (treeData[i].treeId == obj.data.treeId) {
                            //         treeData[i]["spread"] = obj.isExpand
                            //     }
                            // }
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
                                loadSubItems(obj.data);
                                setCurrentSelectNode(obj.elem, obj.state);
                            }
                        } else {
                            if (isTreeSingleType == true) {
                                selected = [{
                                    treeId: obj.data.treeId,
                                    title: obj.data.title,
                                    jgId: obj.data.jgId
                                }];

                                treeOpInfo.selectedElement.data = obj.data;
                                treeOpInfo.selectedElement.elem = obj.elem;
                                setCurrentSelectNode(obj.elem, obj.state);
                                // var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                // parent.layer.close(index); //再执行关闭
                            } else {
                                setCurrentSelectNode(obj.elem, obj.state);
                            }
                        }
                    },
                    oncheck: function (obj) {
                        treeOpInfo.checkedItems = tree.getChecked('treeInstitutions');
                        selected = treeOpInfo.checkedItems;
                    }
                });

                // $(".layui-tree-main").click();
            }
        },
        error: function (tt) {
            layer.close(loadingIndex1);
            //只要进error就跳转到登录页面
            extension.errorInOpen();
        }
    });
});

var selected = '';

//获取已选择的树的值
function getSelectOrg() {
    return selected;
}