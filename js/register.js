    //把函数返回值都定义为全局变量  使用该js时要引入check1.js 和check2.js
    var nickBin = '';
    var userBin = '';
    var qqBin = '';
    var passBin = '';
    var passBin2 = '';
    var passBinCheck = '';
    var passWord = document.getElementById('pass'); //输入密码框

    function personal() {
    var UserName = document.getElementById('userInput'); //输入用户名的框
    var myDivName = document.getElementById('myname'); //显示提示的框
    var myNickDiv = document.getElementById('nickname'); //显示提示的框 昵称
    var NickName = document.getElementById('nick'); //输入昵称的框
    var passWord = document.getElementById('pass'); //输入密码框
    var passDiv = document.getElementById('pass1'); //密码提示框
    var passWord2 = document.getElementById('passsure'); //确认密码框
    var passDiv2 = document.getElementById('pass2'); //确认是否一致框
    var qqNumber = document.getElementById('qq'); //qq输入框
    var qqDiv = document.getElementById('qie');//qq输入提示框

    //注册时禁止浏览器记住原来信息
    $('input').val('');     
    $('#submit').val('注册');


    $('#userInput').focus(function(event) { //jquery的方法必须只有jquer对象才能用，所以必须有$  
        divShow(myDivName);//提示框显示 divshow（提示框）参数为dom对象
        iconHide($('#userId'));//图标隐藏 iconHide(form-group)
    });
    $('#userInput').blur(function(event) {
     //要定义个新变量，如果直接对函数判断，函数会重复执行
        userBin = checkName(UserName, myDivName);
        iconShow(userBin,$('#userId'));
    });
    $('#nick').focus(function(event) {
        divShow(myNickDiv);
        iconHide($('#nickId'));
    });
    $('#nick').blur(function(event) {
        nickBin = checkNickName(NickName, myNickDiv);
        iconShow(nickBin,$('#nickId'));
    });
    $('#qq').focus(function(event) {
        divShow(qqDiv);
        iconHide($('#qqNum'));
    });
    $('#qq').blur(function(event) {
        qqBin = checkQQ(qqNumber, qqDiv);
        iconShow(qqBin,$('#qqNum'));
    });
    $('#pass').focus(function(event) {
        divShow(passDiv);
        iconHide($('#passId'));
    });
    $('#pass').blur(function(event) {
        passBin = checkPass(passWord, passDiv);
        iconShow(passBin,$('#passId'));
    });
    $('#passsure').focus(function(event) {
        divShow(passDiv2);
        iconHide($('#pass2Id'));
    });
    $('#passsure').blur(function(event) {
        passBin2 = checkPass(passWord2, passDiv2); //先检测是否为空
        passBinCheck = checkConsist(passWord, passWord2,passDiv2); //再检测两次是否一致
        var test=passBin&&passBinCheck;
        iconShow(test,$('#pass2Id'));
    });
}

