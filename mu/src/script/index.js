  layui.use(['element', "layer", "extension", "urlrelated"], function () {
  var el = layui.element,
      layer = layui.layer,
      $ = layui.$,
      urlrelated = layui.urlrelated,
      extension = layui.extension;
      // extension.getDropDownList();
  el.on('nav(left-menu)', function (data) {
    var hrefThis = $(this).attr("thisHref");
    var thisText = $(this).text();
    $("#sub-title-span").text(thisText)
    $("iframe").attr("src", hrefThis);
    if ($(this).attr("thisHref")) {
      var querytype = $(this).attr("querytype")
      // 找到子页面的按钮    把权限的type放进去
      // $(".contentss").contents().find("#querytype").val(querytype)
      localStorage.setItem("querytypeItem",querytype)
    }
  });
  $(".moreDrive").on('click', function () {
    $(".letMenuA").each(function(){
      if($(this).attr("modelid") == "53"){
        //找到驱动管理的modelid
        $(this).click();
      }
    })
  })

  $(".user-edit").on("click", function () {
    // 修改用户名
    top.layer.open({
      type: 2,
      area: ["600px", "380px"],
      title: "修改密码",
      resize:false,
      content: ["/html/index/user_edit.html","no"],
      success:function(layero,indent){
       
      }
    })
  });
  $(".user-info").on("click", function () {
    // 修改用户名
    top.layer.open({
      type: 2,
      area: ["600px", "380px"],
      title: "用户信息",
      resize:false,
      btn: ["关闭"],
      content: ["/html/index/user_info.html","no"],
      success:function(layero, index){
        // 用户信息
        var body = layer.getChildFrame('body', index);
        var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
        body.find('.name').val(localStorage.getItem("userRealname"))
        body.find('.userName').val(localStorage.getItem("userName"))
        body.find('.JGID').val(localStorage.getItem("jgmc"))
        body.find('.idCard').val(localStorage.getItem("idCard"))
        body.find('.phone').val(localStorage.getItem("phone"))
        body.find('.gender').val(localStorage.getItem("gender") == "1"?"男":"女")        
      }
    })
  });


  $(".out").click(function () {
    //点击退出
    top.layer.open({
      type: 0,
      title: "<div style='font-weight:bold;color:red'>提示</div>",
      btn: ["确定", "取消"],
      resize:false,
      area: ["450px", "210px"],
      content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px;'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>确定要退出吗？</span></div>",
      btn1: function (index) {
        // 点击退出
        localStorage.clear();
        layer.close(index);
        window.location.href = "/login.html"
      }

    })
  });

  var  datas = {
    "platform": "1007",
    "appversion": "1.0.3",
    "apiversion": "1.0.2",
    "mac": "12345678",
    "ip": "xxx.xxx.xx.xx",
    "token": localStorage.getItem("token"),
    "userId": localStorage.getItem("userId"), //登录用户信息_用户ID
    "data":{
      "userId": localStorage.getItem("userId")
    }
    }
var datass = JSON.stringify(datas);
jQuery.support.cors = true;
    $.ajax({
        url:urlrelated.indexSQWJdownload,
        type: "post",
        contentType: "application/json",
        data: datass,
        dataType: "json",
        success:function(data){ 
        if(data.status== 200){
          sqUrl=data.data.url;
          $(".sq").attr("href",sqUrl);
        }else{
          layer.msg(data.message,{icon:"5"})
        }
        } ,error: function (XMLHttpRequest, textStatus, errorThrown) {
          var  status=XMLHttpRequest.status;
          if(textStatus == "error" && status == "401"){
              extension.errorLogin() 
              return false
          }
          if(textStatus == "error" && status != "401"){
          layer.msg("授权文件下载错误",{icon:"5"})
          }
        }
        })

  jQuery.support.cors = true;
  $.ajax({
    url: urlrelated.getNewDrive,
    type: "post",
    data: JSON.stringify(urlrelated.requestBody),
    contentType: "application/json;charset=UTF-8",  //推荐写这个
    dataType: "json",
    success: function (res) {
      if (res.status == 200) {
        var urldata = res.data
        for (var i = 0; i < urldata.length; i++) {
          if (urldata[i].deviceTypeid == "05") {
            if (urldata[i].driveUrl != "" && urldata[i].driveUrl != null & urldata[i].driveUrl != undefined) {
              $("#irisdownload").attr("href", urlrelated.downloadUrlDrive + urldata[i].driveUrl);
              var  QDurl=$("#irisdownload").attr("href");
              localStorage.setItem("QDurl",QDurl);
            } else {
              $("#irisdownload").on("click", function () {
                layer.msg("未找到最新的虹膜识别驱动仪");
                return;
              })
            }
          }
          if (urldata[i].deviceTypeid == "03") {
            if (urldata[i].driveUrl != "" && urldata[i].driveUrl != null & urldata[i].driveUrl != undefined) {
              $("#iddownload").attr("href", urlrelated.downloadUrlDrive + urldata[i].driveUrl);
              var  SFZurl=$("#iddownload").attr("href");
              localStorage.setItem("SFZurl",SFZurl);
            }else{
              $("#iddownload").on("click", function () {
                layer.msg("未找到最新的身份证读卡器驱动");
                return;
              })
            }
          }
        }
      } else {
        $("#irisdownload").attr("href", "javascript:");
        if ($("#irisdownload").attr("href") == "javascript:") {
          $("#irisdownload").on("click", function () {
            layer.msg("未找到最新的虹膜识别驱动仪");
            return;
          })
        }
        $("#iddownload").attr("href", "javascript:");
        if ($("#iddownload").attr("href") == "javascript:") {
          $("#iddownload").on("click", function () {
            layer.msg("未找到最新的身份证读卡器驱动");
            return;
          })
        }
        layer.msg(res.message);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      var  status=XMLHttpRequest.status
      if(textStatus == "error" && status == "401"){
          extension.errorLogin() 
          return false
      }
      if(textStatus == "error" && status != "401"){
        extension.error()
      }
    }
  });

  //意见反馈
  $("#feedback").on("click", function () {
    layer.open({
      title: '<span style="font-size: 16px;">意见反馈</span>',
      type: 2,
      move: false,
      area: [extension.getDialogSize().width, extension.getDialogSize().height],
      resize: false,
      content: ['/html/opinion/opinion/add_opinion.html', "no"],
      btn: ['确定', '取消'],
      yes: function (index, layero) {
        var body = layer.getChildFrame('body', index);
        body.find("#add_opinion_submit").click();
        // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
      },
      success: function (layero, index) {
        var body = layer.getChildFrame('body', index);
        // layer.iframeAuto(index);
      }
    });
  })
  function testBtn(){

    　　   var reshSrc = document.getElementById('myFrame').src;
    
    　　   var iframe1=document.getElementById("mainframe");        
    
    　　 iframe1.src = reshSrc;//需要给主框架刷新才可以
    
       }
  // $(".reload").click(function(){//刷新子页面
  //   var ifrSrc =  $("iframe").attr("src")
  // })

  $(".first-home").click(function(){
    window.location.reload()
  })
  $(".user_name").hover(function(ev){
    var  userName = $(".user_name").text()
    $(".user_name").attr("title",userName)
  })
  //用户帮助
  $("#user_help").click(function () {
    $("iframe").attr("src", "/html/index/user_help.html");
  })
  //防止页面后退
  $(document).on("keydown",function(event){
    var ev = event || window.event; //获取event对象 
    var obj = ev.target || ev.srcElement; //获取事件源 
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
    var code = event.keyCode|| event.which;
    if(code == 8 && t != "password" && t != "text" && t != "textarea"){
            return false
    } 
})
});