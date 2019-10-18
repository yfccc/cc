layui.use('layer', function() {
    var $ = layui.$
        , layer = layui.layer
        , index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    var defaultCartdImg = basePath +  "/iias/img/card-img.png";
    var gatherData = parent.layui.$("#submitData").val();
    var gData = eval('('+gatherData+')');

    var active = {
        fmtCjsj: function(date){
            if (date == null) {
                return false;
            }
            if (date.length < 14){
                return false;
            }

            var yy = date.substring(0,4);
            var MM = date.substring(4,6);
            var dd = date.substring(6, 8);
            var HH = date.substring(8, 10);
            var mm = date.substring(10, 12);
            var ss = date.substring(12, 14);
            return yy + "-" + MM +'-' + dd + " " + HH + ":" +mm + ":" + ss;
        }
    };

    // 姓名
    $("#xm").html(gData.xm);
    $('#xm').attr('title',"" + gData.xm + "");
    // 性别
    $("#xb").html(parent.layui.$("#bcjr_xb option[value=" + gData.xb + "]").html());
    // 证件类型
    $("#zjlx").html(parent.layui.$("#bcjr_zjlxdm option[value=" + gData.zjlx + "]").html());
    // 证件号
    $("#zjhm").html(gData.zjhm);
    $('#zjhm').attr('title',"" + gData.zjhm +"");
    // 出生日期
    $("#csrq").html(gData.csrq);
    // 国籍
    $("#gj").html(parent.layui.$("#bcjr_gj option[value='" + gData.gj + "']").html());
    $('#gj').attr('title',"" + parent.layui.$("#bcjr_gj option[value='" + gData.gj + "']").html() + "");
    // 民族
    $("#mz").html(parent.layui.$("#bcjr_mz option[value='" + gData.mz + "']").html());
    // 户籍地址
    $("#hjdz").html(gData.hjdz);
    $('#hjdz').attr('title',"" + gData.hjdz + "");
    // 手机号码
    $("#sjhm").html(gData.sjh1);



    //人员分类

    $("#ryfl").html(parent.layui.$("#bcjr_ryfl option[value='"+gData.rylb+"']").html());
    $("#ryfl").attr('title',parent.layui.$("#bcjr_ryfl option[value='"+gData.rylb+"']").html());


    // 采集点
    $("#cjd").html(gData.cjdwmc);
    $("#cjd").attr('title',gData.cjdwmc);



    // 采集编号
    $("#bh").html(gData.cjbh);
    $("#bh").attr('title',gData.cjbh);


    // 身份证头像
    var zjzpBase64 = gData.zjzp == "" || gData.zjzp == null ? defaultCartdImg : "data:image/jpeg;base64," + gData.zjzp ;
    $("#cardImage").attr("src", zjzpBase64);



    //采集时间
    $('#cjsj').html(active['fmtCjsj'].call('',gData.cjsj));



    // 采集备注
    $("#bz").html(gData.cjbz);
    $('#bz').attr('title',gData.cjbz);



    // 采集人
    var cjr_xm = (gData.cjr_xm == null || gData.cjr_xm == "") ? "" : gData.cjr_xm;
    $("#cjr").html(cjr_xm);
 $("#cjr").attr('title',"" + cjr_xm + "");

});
