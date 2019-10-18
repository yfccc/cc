layui.use('layer', function() {
    var $ = layui.$
        , layer = layui.layer
        , index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    var defaultCartdImg = basePath +  "/iias/img/card-img.png";


    // 采集编号
    var bhTitle = parent.layui.$("#cjbh").val();
    $("#bh").html(bhTitle);
    $("#bh").attr('title',bhTitle);
    // 姓名
    $("#xm").html(parent.layui.$("#bcjr_xm").val());
    $('#xm').attr('title',""+parent.layui.$("#bcjr_xm").val()+"");
    // 性别
    $("#xb").html(parent.layui.$("#bcjr_xb option[value="+parent.layui.$("#bcjr_xb").val()+"]").html());
    // 证件类型
    $("#zjlx").html(parent.layui.$("#bcjr_zjlxdm option[value="+parent.layui.$("#bcjr_zjlxdm").val()+"]").html());
    // 证件号
    $("#zjhm").html(parent.layui.$("#bcjr_zjhm").val());
    $('#zjhm').attr('title',"" + parent.layui.$("#bcjr_zjhm").val() +"");
    // 出生日期
    $("#csrq").html(parent.layui.$("#bcjr_csrq").val());
    // 民族
    $("#mz").html(parent.layui.$("#bcjr_mz option[value="+parent.layui.$("#bcjr_mz").val()+"]").html());
    // 国籍
    $("#gj").html(parent.layui.$("#bcjr_gj option[value="+parent.layui.$("#bcjr_gj").val()+"]").html());
    $('#gj').attr('title',"" + parent.layui.$("#bcjr_gj option[value="+parent.layui.$("#bcjr_gj").val()+"]").html() + "");
    // 户籍地址
    var c_bcj_hjdz = parent.layui.$("#bcjr_hjdz").val();
    if (c_bcj_hjdz==null||c_bcj_hjdz==""){
        c_bcj_hjdz = "-"
    }else {
        $('#hjdz').attr('title',""+c_bcj_hjdz+"");
    }
    $("#hjdz").html(c_bcj_hjdz);

    // 手机号码
    var bcj_shjm = parent.layui.$("#bcjr_sjhm1").val();
    if (bcj_shjm == null || bcj_shjm == ""){
        bcj_shjm = "-"
    }
    $("#sjhm").html(bcj_shjm);
    //人员分类
    var ryfl = parent.layui.$("#bcjr_ryfl").val();
    $("#ryfl").html(parent.layui.$("#bcjr_ryfl option[value='"+ ryfl +"']").html());
    $('#ryfl').attr('title',""+parent.layui.$("#bcjr_ryfl option[value='"+ ryfl +"']").html()+"");
    // 身份证头像
    var zjzpBase64 = parent.layui.$('#zjzp').val() == "" ? defaultCartdImg : "data:image/jpeg;base64,"+parent.layui.$('#zjzp').val();
    $("#cardImage").attr("src", zjzpBase64);
    // 采集方式
    $("#fs").html(parent.layui.$("#qzcjbz").val() == 1 ? '强制' :  parent.layui.$("#qzcjbz").val() == 0 ? '正常' : '无法采集');
    // 采集备注
    var cjbz = parent.layui.$("#cjbz").val();
    if (cjbz == null || cjbz == ""){
        cjbz = "-"
    }else {
        $('#bz').attr('title',""+cjbz+"");
    }
    $("#bz").html(cjbz);


    // 采集点 从session取值
    var cjdTexts = $("#cjd").html().trim();
    $('#cjd').attr('title',""+cjdTexts+"");

    // // 采集人  从session取值
    $("#cjr").attr('title',""+$("#cjr").html().trim()+"");


});