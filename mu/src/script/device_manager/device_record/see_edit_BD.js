// 设备返回状态
var isCloseE30ByStatus; // 判断那些状态是需要关闭设备并开启开始按钮的
function OnNotifyStatus(param1) {
  var message = "";
  if (param1) {

    layui.use(["layer"], function () {
      var layer = layui.layer;
      $("#xlSN").val("")
      layer.msg("设备状态异常,请检查设备", { icon: "5" })
    })

    isCloseE30ByStatus = false
    active['closeE30'].call();
    return false
  }
}

// 方法  望远镜设备方法
active = {
  // 关闭E30设备
  closeE30: function () {
    Biometrics.CloseEngine();
  },
  // 初始化设备, 1: 采集 , 3 : 强制采集
  initE30: function (nWorkMode) {
    // 清空所有提示
    var ie = false;
    if ((!!window.ActiveXObject || "ActiveXObject" in window)) {
      ie = true;

    }
    try {
      // 关闭设备声音
      //  初始化成功
      /* Biometrics.UIType = 1;*/
      //   获取设备信息代码
      vRet = Biometrics.InitEngine();
      Biometrics.SetPlaySound(false);
      DeviceInfo = Biometrics.GetConnectedDeviceInfo();
      var infoArr = DeviceInfo.split("_");
      var sbbh = infoArr[0]; // 设备编号
      if (sbbh != "") {
        $("#xlSN").val(sbbh)
      }
      active.closeE30()
    } catch (e) {
      if (ie) {
        //弹窗  相对于父级窗定位
        top.layer.open({
          type: 1,
          title: '<span style="color: red;font-weight: bold">提示</span>',
          skin: 'layui-layer-demo', //样式类名
          area: ['450px', '210px'],
          anim: 2,
          resize: false,
          btn: "关闭",
          shadeClose: false, //开启遮罩关闭
          content: '<div class="layui-card-body layui-text layadmin-text;"style="width:420px;text-align:center;overflow:hidden">' +
            '<div  style="width:100%;font-size:24px;font-weight: bold;margin-bottom:35px;">' +
            '<span  class="layui-icon layui-icon-tips" style="color:#FF9900;font-size:26px; vertical-align: middle"></span>' +
            '<span   style="margin-left:5px;font-size:16px; font-weight: normal; vertical-align: middle">请先下载驱动</span>' +
            '</div>' +
            '<a href=' + localStorage.getItem("QDurl") + ' style="color:#3B98FE;font-size: 13px;font-weight: normal;display:block;width:100%">点击下载驱动</a>' +
            '</div>'
        });
      } else {
        layer.msg('请使用IE浏览器', {
          icon: 5
        });
      }
      return false;
    }
  }
}
layui.use(['element', 'laydate', 'table', 'form', 'urlrelated', 'extension'], function () {
  var laydate = layui.laydate,
    urlrelated = layui.urlrelated,
    extension = layui.extension,
    $ = layui.$,
    layer = layui.layer,
    form = layui.form,
    args = extension.getRequestParams(location.search),
    dropDownList = extension.getDropDownList(),
    userInfo = extension.getUserInfo();
  form.render();
  $(document).on("keydown", function (event) {
    var ev = event || window.event; //获取event对象 
    var obj = ev.target || ev.srcElement; //获取事件源 
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
    var code = event.keyCode || event.which;
    if ((code == 13 || code == 8) && t != "password" && t != "text" && t != "textarea") {
      return false;
    }
  });
  var devicehome = "",
    devicegenre = "",
    devicePlace = "";
  //设备厂商
  devicehome += '<option value="" selected>请选择</option>';
  $.each(dropDownList.sbcsList, function (i, e) {
    devicehome += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
  });
  $("select[name='deviceManufacturerCode']").html(devicehome);
  //设备类型
  devicegenre += '<option value="" selected>请选择</option>';
  $.each(dropDownList.sbxhList, function (i, e) {
    devicegenre += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
  });
  $("select[name='deviceTypeid']").html(devicegenre);
  //采集地点
  devicePlace += '<option value="" selected>请选择</option>';
  $.each(dropDownList.cjcdList || [], function (i, e) {
    devicePlace += '<option value="' + e.codeIndex + '">' + e.codeName + '</option>';
  });
  $("select[name='devicePlaceCode']").html(devicePlace);
  form.render('select');
  //页面加载完成 获取详情
  getDetails();

  //设置头
  switch (args.layEvent) {
    case "edit":
      $("body", parent.document).find('#sub-title').html("设备信息>编辑");
      break;
    case "see":
      $(".xinghao").hide();
      $("#see_edit_submit_btn").hide();
      $("textarea").attr("disabled", true);
      $("body", parent.document).find('#sub-title').html("设备信息>查看");
      break;
    case "add":
      $("body", parent.document).find('#sub-title').html("设备信息>绑定");
      break;
  }

  //获取详情
  function getDetails() {
    //根据layevent判断操作类型
    switch (args.layEvent) {
      case "edit":
      case "see":
        var loadingicon = layer.load(1, {
          shade: 0.3
        })
        if (args.layEvent === "see") {
          //查看禁用
          $("input").attr("disabled", true);
          $("select").attr("disabled", true);
          $("#lab_desc").attr("disabled", true);

        }
        //获取详情并填写到页面 查看和编辑 会有deviceid
        urlrelated.requestBody.data = {
          "deviceId": args.deviceId
        };
        $.ajax({
          url: urlrelated.getDeviceById,
          type: "post",
          async: true,
          data: JSON.stringify(urlrelated.requestBody),
          cache: false,
          contentType: "application/json;charset=UTF-8", //推荐写这个
          dataType: "json",
          timeout: 120000,
          success: function (res) {
            layer.close(loadingicon);
            if (res.status === 200) {
              // 默认值 赋值
              $("#deviceId").val(res.data.deviceId);
              $("#deviceCode").val(res.data.deviceCode);
              $("#bq").val(res.data.deviceTitle);
              $("#xh").val(res.data.deviceModeCode);
              $("#xlSN").val(res.data.deviceSn);
              $("#dzmac").val(res.data.deviceMac);
              $("#ipdz").val(res.data.deviceIp);
              $("#lab_desc").val(res.data.deviceRemork);
              $("#jgxxGajgjgname").val(res.data.jgxxGajgjgmc);
              $("#jgxxGajgjgdm").val(res.data.jgxxGajgjgdm);
              $("#jgxxJgid").val(res.data.jgxxJgid);
              $("select[name=deviceManufacturerCode]").val(res.data.deviceManufacturerCode);
              $("select[name=deviceTypeid]").val(res.data.deviceTypeid);
              $("select[name=deviceIsConnected]").val(res.data.deviceIsConnected);
              $("select[name=devicePlaceCode]").val(res.data.devicePlaceCode);
              $("#sbjd").val(res.data.deviceLongitude);
              $("#sbwd").val(res.data.deviceLatitude);
              $("textarea[name=deviceRemork]").val(res.data.deviceRemork);
              form.render();
              if (args.layEvent === "see") {
                $("input.layui-disabled").attr("disabled", true)
                $("input.layui-disabled").removeClass("layui-disabled");
              }
            } else {
              layer.close(loadingicon);
              layer.msg("详细信息获取失败！");
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loadingicon);
            extension.errorMessage(errorThrown);
          }
        });
        break;

    }
  };
  //    身份证读卡器设备代码 
  var g_iPort = 1001; //端口号；USB = 1001 ~ 1016 ，COM端口 = 1~1
  function hxgc_OpenReader() {
    var iResult = objActiveX.hxgc_OpenReader(1001); //打开设备
    if (iResult == 0) {
      var strSAMID = objActiveX.hxgc_GetSamIdToStr(1001); //获取SAMID
      if (strSAMID != "") {
        $("#xlSN").val(strSAMID)
      }
    } else {
      $("#xlSN").val("")
      layer.msg("设备状态异常,请检查设备", { icon: "5" })
    }
  }
  function hxgc_ReadIDCard() {
    var ie = false;
    if ((!!window.ActiveXObject || "ActiveXObject" in window)) {
      ie = true;
    }
    try {
      objActiveX.hxgc_CloseReader(1001)
    } catch (e) {
      if (ie) {
        var soft_open = top.layer.open({
          type: 1,
          title: '<span  style="color: red;font-weight: bold">提示</span>',
          skin: 'layui-layer-demo', //样式类名
          area: ['450px', '210px'],
          anim: 2,
          resize: false,
          btn: "关闭",
          shadeClose: false, //开启遮罩关闭
          content: '<div class="layui-card-body layui-text layadmin-text;"style="width:420px;text-align:center;overflow:hidden">' +
            '<div  style="width:100%;font-size:24px;font-weight: bold;margin-bottom:35px;">' +
            '<span  class="layui-icon layui-icon-tips" style="color:#FF9900;font-size:26px; vertical-align: middle"></span>' +
            '<span   style="margin-left:5px;font-size:16px; font-weight: normal; vertical-align: middle">请先下载驱动</span>' +
            '</div>' +
            '<a href=' + localStorage.getItem("SFZurl") + ' style="color:#3B98FE;font-size: 13px;font-weight: normal;display:block;width:100%">点击下载驱动</a>' +
            '</div>'
        });
      } else {
        top.layer.msg('请使用IE浏览器', {
          icon: 5
        });
      }
      return false;
    }
    hxgc_OpenReader()
  }


  form.on("select(sbcs)", function (obj) {
    var val = obj.value
    if (val == "91110108797597536U" || val == "911101135960806618") {
      $(".getActiveSn").css("display", "block")
    } else {
      $(".getActiveSn").css("display", "none")
    }
  })

  // 获取设备的Sn码
  $(".getActiveSn").click(function () {
    var sbcsdm = $("#sbcs").val()
    //  e30设备SN码
    if (sbcsdm == "91110108797597536U") {
      active.initE30()
    }
    //    获取身份证读卡器sN
    if (sbcsdm == "911101135960806618") {
      hxgc_ReadIDCard()
    }
  })

  form.verify({
    IPV4: function (value, item) {
      var pattern = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
      if (value != "" && !pattern.test(value)) {
        return '请输入标准IPV4地址格式';
      }
    }
    , MAC: function (value, item) {
      var pattern = /^([A-Fa-f0-9]{2}[-:]){5}[A-Fa-f0-9]{2}$/;
      if (value != "" && !pattern.test(value)) {
        return '请输入标准计算机物理地址格式';
      }
    }
    , longitude: function (value, item) {
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
    , deviceSn: function (value, item) {
      var pattern = /^[a-zA-Z0-9]+$/;
      if (!pattern.test(value)) {
        return '序列号为30位数字或英文字母';
      }
    }
  })
  form.on('submit(see_edit_filter)', function (obj) {
    obj.field["userId"] = userInfo.userId;
    obj.field["userPoliceId"] = userInfo.policeId;
    //获取采集场地、设备厂商、设备类型、状态
    var deviceplacename = $("#cjcd").next(".layui-form-select").find("dl").find(".layui-this").text();
    var sbcs = $("[name=deviceManufacturerCode]").next(".layui-form-select").find("dl").find(".layui-this").text();
    var sblx = $("[name=deviceTypeid]").next(".layui-form-select").find("dl").find(".layui-this").text();

    $.extend(obj.field, {
      "deviceManufacturer": sbcs || "",
      "deviceTypeName": sblx || "",
      "devicePlaceName": deviceplacename || "",
      "userId": userInfo.userId,
      "userPoliceId": userInfo.policeId,
    });
    urlrelated.requestBody.data = obj.field;
    switch (args.layEvent) {
      case 'edit':
        var loadingicon = layer.load(1, {
          shade: 0.3
        })
        $.ajax({
          url: urlrelated.editDevice,
          type: "post",
          async: true,
          data: JSON.stringify(urlrelated.requestBody),
          cache: false,
          contentType: "application/json;charset=UTF-8", //推荐写这个
          dataType: "json",
          timeout: 120000,
          success: function (res) {
            layer.close(loadingicon);
            if (res.status === 200) {
              top.layer.msg("修改成功！");
              setTimeout(function () {
                location.href = './device_record.html'
              }, 1e3);
            } else {
              layer.msg(res.message);
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loadingicon);
            extension.errorMessage(errorThrown);
          }
        });
        break;
      case 'add':
        var loadingicon = layer.load(1, {
          shade: 0.3
        })
        $.ajax({
          url: urlrelated.addDevice,
          type: "post",
          async: true,
          data: JSON.stringify(urlrelated.requestBody),
          cache: false,
          contentType: "application/json;charset=UTF-8", //推荐写这个
          dataType: "json",
          timeout: 120000,
          success: function (res) {
            layer.close(loadingicon);
            if (res.status === 200) {
              top.layer.msg("新增成功！");
              setTimeout(function () {
                location.href = './device_record.html'
              }, 1e3);
            } else {
              top.layer.msg(res.message);
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loadingicon);
            extension.errorMessage(errorThrown);
          }
        });
        break;
    }

    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });
  if (args.layEvent === "edit" || args.layEvent === "add") {
    $("#select_org").on("click", function () {
      localStorage.setItem("currentOrgCodeTree", userInfo.userJGDM);
      localStorage.setItem("chirdOrgCodeTree", "-1");
      localStorage.setItem("queryTypeTree", userInfo.querytypeItem);
      localStorage.setItem("orgListQueryTypeEq4Tree", userInfo.models);
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
          $("#jgxxJgid").val(org[0].jgId);
          $("#jgxxGajgjgdm").val(org[0].treeId);
          $("#jgxxGajgjgname").val(org[0].title);
          layer.close(index);
        },
        btn2: function (index, layero) {

        },
        success: function (layero, index) {

        }
      });
    });
  }
});
