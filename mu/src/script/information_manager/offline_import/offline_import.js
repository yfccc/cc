layui.use(['urlrelated', 'laydate', 'upload', "element", "layer"], function () {
    var laydate = layui.laydate,
        urlrelated = layui.urlrelated,
        element = layui.element,
        layer = layui.layer,
        $ = layui.$,
        upload = layui.upload,
        d = layui.device();
    // 防止页面后退
    $(document).on("keydown", function (event) {
        var ev = event || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        var code = event.keyCode || event.which;
        if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
            return false;
        }
    });
    $("#querytype").val(localStorage.getItem("querytypeItem"))
    //注册xhr监听
    var xhrOnProgress = function (fun) {
        xhrOnProgress.onprogress = fun; //绑定监听
        //使用闭包实现监听绑
        return function () {
            //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
            var xhr = $.ajaxSettings.xhr();
            //判断监听函数是否为函数
            if (typeof xhrOnProgress.onprogress !== 'function')
                return xhr;
            //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
            if (xhrOnProgress.onprogress && xhr.upload) {
                xhr.upload.onprogress = xhrOnProgress.onprogress;
            }
            return xhr;
        }
    }
    var timerObj = {};
    //设置进度条失败的状态
    function setProgressStatus(index, eq, text) {
        var tr = $('body').find('tr#upload-' + index),
            tds = tr.children();
        switch (eq) {
            case 1:
                //上传状态修改  
                text && tds.first().next().find('.layui-progress-text').text(text);
                break;
            case 2:
                //解析状态修改
                tds.first().next().next().find('.layui-progress-text').text("");
                tds.first().next().next().find('.status').remove();
                tds.first().next().next().append('<span class="status textoverflow">' + text + '</span>');
                break;
        }
    }

    //鼠标滑过显示文本信息
    $(document).on("hover", ".textoverflow", function () {
        if ($(this).width() < $(this)[0].scrollWidth) {
            var text = $(this).text();
            $(this).attr("title", text);
        }
    })

    //设置解析数据进度条的状态
    function setAnalysisProgress(index, pathSign) {
        if (d.ie && d.ie < 10) {
            urlrelated.requestBody.data = {
                "key": pathSign
            }
            timerObj[index] = setInterval(function () {
                var i = index;
                $.ajax({
                    url: urlrelated.getOffineDataExportState,
                    type: "post",
                    async: false,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        if (res.status == 200) {
                            if (res.data == null) {
                                setProgressStatus(i, 2, "获取状态失败");
                                clearInterval(timerObj[i]);
                            } else {
                                //根据返回状态做处理
                                switch (res.data.state) {
                                    case 'NOSTART':
                                        setProgressStatus(i, 2, "等待导入…");
                                        break;
                                    case 'START':
                                        setProgressStatus(i, 2, "开始导入…");
                                        break;
                                    case 'RUNNING':
                                        setProgressStatus(i, 2, "");
                                        element.progress("progress_analysis" + i, res.data.percent);
                                        break;
                                    case 'WAIT':
                                        clearInterval(timerObj[i]);
                                        setProgressStatus(i, 2, "已暂停");
                                        var tr = $('body').find('tr#upload-' + i),
                                            tds = tr.children();
                                        tds.first().next().next().next().find('.stat').data("status", "pause");
                                        tds.first().next().next().next().find('.stat').text("继续");
                                        break;
                                    case 'DONE':
                                        element.progress("progress_analysis" + i, res.data.percent);
                                        if (res.data.percent == "100%") {
                                            var msg = "导入完成：共计" + (res.data.failNum + res.data.succNum) + "条,其中成功" + res.data.succNum + "条,失败" + res.data.failNum + "条。" + res.data.message;
                                            setProgressStatus(i, 2, msg);
                                        }
                                        clearInterval(timerObj[i]);
                                        var tr = $('body').find('tr#upload-' + i),
                                            tds = tr.children();
                                        tds.first().next().next().next().find('.stat').addClass("layui-hide");
                                        $("#testList").show();
                                        $("#replace").hide();
                                        break;
                                    default:
                                        setProgressStatus(i, 2, res.data.message || "获取结果没有或不存在状态");
                                        break;
                                }
                            }
                        } else {
                            setProgressStatus(i, 2, res.data.message);
                            clearInterval(timerObj[i]);
                            $("#testList").show();
                            $("#replace").hide();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        setProgressStatus(i, 2, textStatus);
                        extension.errorMessage(errorThrown);
                        clearInterval(timerObj[i]);
                        $("#testList").show();
                        $("#replace").hide();
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        urlrelated.requestBody.data.RYBH = "";
                    }
                })
            }, 1000);
        } else {
            timerObj[index] = setInterval(function (i, p) {
                urlrelated.requestBody.data = {
                    "key": p
                }
                $.ajax({
                    url: urlrelated.getOffineDataExportState,
                    type: "post",
                    async: false,
                    data: JSON.stringify(urlrelated.requestBody),
                    cache: false,
                    contentType: "application/json;charset=UTF-8", //推荐写这个
                    dataType: "json",
                    success: function (res) {
                        if (res.status == 200) {
                            if (res.data == null) {
                                setProgressStatus(i, 2, "获取状态失败");
                                clearInterval(timerObj[i]);
                            } else {
                                //根据返回状态做处理
                                switch (res.data.state) {
                                    case 'NOSTART':
                                        setProgressStatus(i, 2, "等待导入…");
                                        break;
                                    case 'START':
                                        setProgressStatus(i, 2, "开始导入…");
                                        break;
                                    case 'RUNNING':
                                        setProgressStatus(i, 2, "");
                                        element.progress("progress_analysis" + i, res.data.percent);
                                        break;
                                    case 'WAIT':
                                        clearInterval(timerObj[i]);
                                        setProgressStatus(i, 2, "已暂停");
                                        var tr = $('body').find('tr#upload-' + i),
                                            tds = tr.children();
                                        tds.first().next().next().next().find('.stat').data("status", "pause");
                                        tds.first().next().next().next().find('.stat').text("继续");
                                        break;
                                    case 'DONE':
                                        element.progress("progress_analysis" + i, res.data.percent);
                                        if (res.data.percent == "100%") {
                                            setProgressStatus(i, 2, res.data.message);
                                        }
                                        clearInterval(timerObj[i]);
                                        var tr = $('body').find('tr#upload-' + i),
                                            tds = tr.children();
                                        tds.first().next().next().next().find('.stat').addClass("layui-hide");
                                        break;
                                    default:
                                        setProgressStatus(i, 2, res.data.message || "获取结果没有或不存在状态");
                                        break;
                                }
                            }
                        } else {
                            setProgressStatus(i, 2, res.data.message);
                            clearInterval(timerObj[i]);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        setProgressStatus(i, 2, textStatus);
                        extension.errorMessage(errorThrown);
                        clearInterval(timerObj[i]);
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        urlrelated.requestBody.data.RYBH = "";
                    }
                })
            }, 1000, index, pathSign);
        }
    }
    var fakeIndex, chooseFiles = {};

    //多文件列表示例
    var demoListView = $('#demoList'),
        uploadListIns = upload.render({
            elem: '#testList',
            url: d.ie && d.ie < 10 ? urlrelated.offlineDataUpload1 : urlrelated.offlineDataUpload,
            accept: 'file',
            multiple: true,
            acceptMime: "irisking",
            field: 'files',
            headers: { token: localStorage.token },
            data: urlrelated.requestBody,
            exts: 'irisking',
            xhr: xhrOnProgress,
            progress: function (index, percent) {
                d.ie && d.ie < 10 ? element.progress("progress_upload" + fakeIndex, percent + '%') :
                    element.progress("progress_upload" + index, percent + '%'); //设置页面进度条
            },
            choose: function (obj) {
                if (d.ie && d.ie < 10) {
                    $("#testList").hide();
                    $("#replace").show();
                    var file = {},
                        fv = $("input[name=files]")[0].value, fvx = fv.substring(fv.lastIndexOf('\\') + 1, fv.length);
                    file["name"] = fvx;
                    var index = (new Date).getTime() + "-0";
                    chooseFiles[index] = file;
                    fakeIndex = index;

                    var tr = $(['<tr id="upload-' + index + '">',
                    '<td>' + file.name + '</td>',
                    '<td id="progressBar_upload"><div class="layui-progress" lay-showpercent="true" lay-filter="progress_upload' + index + '"><div class="layui-progress-bar layui-bg-blue" lay-percent="0%" style = "width:0%;"> <span class="layui-progress-text">0%</span></div></div> </td>',
                    '<td><div class="layui-progress" lay-showpercent="true" lay-filter="progress_analysis' + index + '"><div class="layui-progress-bar layui-bg-blue" lay-percent="0%" style = "width:0%;"> <span class="layui-progress-text">0%</span></div></div></td>',
                        '<td>',
                    '<button class="layui-btn layui-btn-xs stat layui-hide" data-status="processing" data-index=' + index + ' data-filename=' + file.name + '>暂停</button>',
                        '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>',
                        '</tr>'].join(''));

                    //单个重传
                    tr.find('.demo-reload').on('click', function () {
                        layer.msg("ie" + d.ie + "不支持重传");
                    });

                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        var tr = $('body').find('tr#upload-' + index),
                            tds = tr.children();
                        var filenam = tds.first().next().next().next().find('.stat').data("filename");

                        urlrelated.requestBody.data = {
                            "key": filenam
                        }
                        $.ajax({
                            url: urlrelated.deleteExportData,
                            type: "post",
                            async: true,
                            data: JSON.stringify(urlrelated.requestBody),
                            cache: false,
                            contentType: "application/json;charset=UTF-8",
                            dataType: "json",
                            success: function (res) {
                                if (res.status == 200 && res.data) {
                                    if (res.data.isSuccess) {
                                        delete chooseFiles[index]; //删除对应的文件
                                        tr.remove();
                                        $("body").find("tr").length <= 1 && $(".nodata").show();
                                        timerObj[index] && clearInterval(timerObj[index]);
                                        uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                                    } else {
                                        layer.msg(res.message);
                                    }
                                } else {
                                    layer.msg(res.message);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                extension.errorMessage(errorThrown);
                            }
                        });
                        $("#testList").show();
                        $("#replace").hide();
                    });

                    demoListView.append(tr);
                    //绑定暂定、开始事件
                    $(".stat").off("click").on("click", function () {
                        var othis = this;
                        var stat = $(othis).data("status") || "";
                        var filenam = $(othis).data("filename") || "";
                        var filen = filenam.substring(filenam.lastIndexOf('\\') + 1, filenam.length);
                        var i = $(othis).data("index") || "";
                        urlrelated.requestBody.data = {
                            "key": filen
                        }
                        if (stat == "processing") {
                            $.ajax({
                                url: urlrelated.waitExportData,
                                type: "post",
                                async: true,
                                data: JSON.stringify(urlrelated.requestBody),
                                cache: false,
                                contentType: "application/json;charset=UTF-8",
                                dataType: "json",
                                success: function (res) {
                                    if (res.status == 200 && res.data) {
                                        if (res.data.state == "WAIT") {
                                            setProgressStatus(i, 2, "已暂停");
                                            var tr = $('body').find('tr#upload-' + i),
                                                progressbar = tr.find(".layui-progress-bar");
                                            $(progressbar).removeClass("layui-bg-blue").addClass("layui-bg-red");
                                            clearInterval(timerObj[i]);
                                            $(othis).data("status", "pause");
                                            $(othis).text("继续");
                                        } else if (res.data.state == "ERROR") {
                                            layer.msg("暂停失败");
                                        } else {
                                            layer.msg(res.data.state || "返回状态为空");
                                        }
                                    } else {
                                        layer.msg(res.message);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    extension.errorMessage(errorThrown);
                                }
                            });
                        } else if (stat == "pause") {
                            $.ajax({
                                url: urlrelated.reStartExportData,
                                type: "post",
                                async: true,
                                data: JSON.stringify(urlrelated.requestBody),
                                cache: false,
                                contentType: "application/json;charset=UTF-8",
                                dataType: "json",
                                success: function (res) {
                                    if (res.status == 200 && res.data) {
                                        if (res.data.state == "RUNNING") {
                                            setProgressStatus(i, 2, "");
                                            setAnalysisProgress(i, filenam);
                                            var tr = $('body').find('tr#upload-' + i),
                                                progressbar = tr.find(".layui-progress-bar");
                                            $(progressbar).removeClass("layui-bg-red").addClass("layui-bg-blue");
                                            $(othis).data("status", "processing");
                                            $(othis).text("暂停");
                                        } else if (res.data.state == "ERROR") {
                                            layer.msg("开始未成功");
                                        } else {
                                            layer.msg(res.data.state || "返回状态为空");
                                        }
                                    } else {
                                        layer.msg(res.message);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    extension.errorMessage(errorThrown);
                                }
                            });
                        } else {
                            layer.msg("某种未处理情况下进入");
                        }
                    });
                } else {
                    var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                    //读取本地文件
                    obj.preview(function (index, file, result) {
                        var tr = $(['<tr id="upload-' + index + '">', '<td>' + file.name + '</td>', '<td id="progressBar_upload">等待上传……</td>', '<td>等待导入……</td>', '<td>', '<button class="layui-btn layui-btn-xs stat layui-hide" data-status="processing" data-index=' + index + ' data-filename=' + file.name + '>暂停</button>', '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));

                        //单个重传
                        tr.find('.demo-reload').on('click', function () {
                            var tr = demoListView.find('tr#upload-' + index),
                                tds = tr.children();
                            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                                tds.first().next().next().next().html('<div class="layui-progress" lay-showpercent="true" lay-filter="progress_upload' + index + '"><div class="layui-progress-bar layui-bg-blue" lay-percent="0%" style = "width:0%;"> <span class="layui-progress-text">0%</span></div></div> ');
                                tds.first().next().next().next().html('<div class="layui-progress" lay-showpercent="true" lay-filter="progress_analysis' + index + '"><div class="layui-progress-bar layui-bg-blue" lay-percent="0%" style = "width:0%;"> <span class="layui-progress-text">0%</span></div></div> ');
                            } else {
                                tr.remove();
                            }
                            obj.upload(index, file);
                        });

                        //删除
                        tr.find('.demo-delete').on('click', function () {
                            var tr = $('body').find('tr#upload-' + index),
                                tds = tr.children();
                            var filenam = tds.first().next().next().next().find('.stat').data("filename");

                            urlrelated.requestBody.data = {
                                "key": filenam
                            }
                            $.ajax({
                                url: urlrelated.deleteExportData,
                                type: "post",
                                async: true,
                                data: JSON.stringify(urlrelated.requestBody),
                                cache: false,
                                contentType: "application/json;charset=UTF-8",
                                dataType: "json",
                                success: function (res) {
                                    if (res.status == 200 && res.data) {
                                        if (res.data.isSuccess) {
                                            delete files[index]; //删除对应的文件
                                            tr.remove();
                                            $("body").find("tr").length <= 1 && $(".nodata").show();
                                            timerObj[index] && clearInterval(timerObj[index]);
                                            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                                        } else {
                                            layer.msg(res.message);
                                        }
                                    } else {
                                        layer.msg(res.message);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    extension.errorMessage(errorThrown);
                                }
                            });

                        });

                        demoListView.append(tr);
                        //绑定暂定、开始事件
                        $(".stat").off("click").on("click", function () {
                            var othis = this;
                            var stat = $(othis).data("status") || "";
                            var filenam = $(othis).data("filename") || "";
                            var i = $(othis).data("index") || "";
                            urlrelated.requestBody.data = {
                                "key": filenam
                            }
                            if (stat == "processing") {
                                $.ajax({
                                    url: urlrelated.waitExportData,
                                    type: "post",
                                    async: true,
                                    data: JSON.stringify(urlrelated.requestBody),
                                    cache: false,
                                    contentType: "application/json;charset=UTF-8",
                                    dataType: "json",
                                    success: function (res) {
                                        if (res.status == 200 && res.data) {
                                            if (res.data.state == "WAIT") {
                                                setProgressStatus(i, 2, "已暂停");
                                                clearInterval(timerObj[i]);
                                                $(othis).data("status", "pause");
                                                $(othis).text("继续");
                                            } else if (res.data.state == "ERROR") {
                                                layer.msg("暂停失败");
                                            } else {
                                                layer.msg(res.data.state || "返回状态为空");
                                            }
                                        } else {
                                            layer.msg(res.message);
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        extension.errorMessage(errorThrown);
                                    }
                                });
                            } else if (stat == "pause") {
                                $.ajax({
                                    url: urlrelated.reStartExportData,
                                    type: "post",
                                    async: true,
                                    data: JSON.stringify(urlrelated.requestBody),
                                    cache: false,
                                    contentType: "application/json;charset=UTF-8",
                                    dataType: "json",
                                    success: function (res) {
                                        if (res.status == 200 && res.data) {
                                            if (res.data.state == "RUNNING") {
                                                setProgressStatus(i, 2, "");
                                                setAnalysisProgress(i, filenam);
                                                $(othis).data("status", "processing");
                                                $(othis).text("暂停");
                                            } else if (res.data.state == "ERROR") {
                                                layer.msg("开始未成功");
                                            } else {
                                                layer.msg(res.data.state || "返回状态为空");
                                            }
                                        } else {
                                            layer.msg(res.message);
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        extension.errorMessage(errorThrown);
                                    }
                                });
                            } else {
                                layer.msg("某种未处理情况下进入");
                            }
                        });

                        var tr = demoListView.find('tr#upload-' + index),
                            tds = tr.children();
                        tds.first().next().html('<div class="layui-progress" lay-showpercent="true" lay-filter="progress_upload' + index + '"><div class="layui-progress-bar layui-bg-blue" lay-percent="0%" style = "width:0%;"> <span class="layui-progress-text">0%</span></div></div> ');
                        tds.first().next().next().html('<div class="layui-progress" lay-showpercent="true" lay-filter="progress_analysis' + index + '"><div class="layui-progress-bar layui-bg-blue" lay-percent="0%" style = "width:0%;"> <span class="layui-progress-text">0%</span></div></div> ');
                        $("body").find("tr").length > 1 ? $(".nodata").hide() : $(".nodata").show();
                    });
                }
                //根据是否有文件上传， 隐藏显示nodata
                $("body").find("tr").length > 1 ? $(".nodata").hide() : $(".nodata").show();
            },
            done: function (res, index, upload) {
                if (d.ie && d.ie < 10) {
                    index = fakeIndex;
                    element.progress("progress_upload" + fakeIndex, 100 + '%');
                }
                if (res.status == 200) { //上传成功 开始获取解析的状态
                    var tr = demoListView.find('tr#upload-' + index),
                        tds = tr.children();
                    setProgressStatus(index, 1, "已完成");
                    //设置状态
                    setAnalysisProgress(index, res.data[0] || "");
                    tds.first().next().next().next().find('.stat').removeClass('layui-hide');//eq(3).find('.stat').removeClass('layui-hide'); //显示暂停
                } else {
                    $("#testList").show();
                    $("#replace").hide();
                    var tr = demoListView.find('tr#upload-' + index),
                        tds = tr.children();
                    setProgressStatus(index, 1, res.message);
                    tds.first().next().next().next().find('.demo-reload').removeClass('layui-hide');//eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
                }
                //无论成功失败都删除该文件， 防止重复导入该文件
                return (d.ie && d.ie < 10) ? delete chooseFiles[index] : delete this.files[index];

            },
            error: function (index, upload) {
                if (d.ie && d.ie < 10) {
                    index = fakeIndex;
                }
                var tr = demoListView.find('tr#upload-' + index),
                    tds = tr.children();
                tds.first().next().html('<span style="color: #FF5722;">上传失败</span>');
                tds.first().next().next().next().find('.demo-reload').removeClass('layui-hide'); //显示重传
                delete this.files[index];
            }
        });

    $("#replace").on('click', function () {
        layer.msg("请等待当期任务执行完毕！");
    })
});