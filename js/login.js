$(function() {
        $('[data-toggle="popover"]').popover();
    })
var check1 = '';//全局变量要放到window外面
var check2 = '';
window.onload = function() {
    var _userLogin = document.getElementById('userLogin');//用户点击按钮
    var _travler = document.getElementById('travler');//游客体验 按钮   
    var login_userId=document.getElementById('login_userid');//用户名
    var usernameDiv = document.getElementById('_userName');//用户名提示框
    var login_passWord=document.getElementById('login_userpass');//密码
    var passwordDiv = document.getElementById('_passWord');//密码提示框
    
    // if($("#login_userid").val())
    // {
    //     check1 = checkName(login_userId, usernameDiv);
    //     console.log(check1);
    // }
    // if($("#login_userpass").val())
    // {
    //     check2 = checkPass(login_passWord, passwordDiv);
    //     console.log(check2);
    // }
    $("#login_userid").focus(function(event) {
        $(usernameDiv).find('small').remove();
    });
    $("#login_userid").blur(function(event) {     
        check1 = checkName(login_userId, usernameDiv);
    });
    $("#login_userpass").focus(function(event) {
        $(passwordDiv).find('small').remove();
    });
    $('#login_userpass').blur(function(event) {
        check2 = checkPass(login_passWord, passwordDiv);
    });
    _userLogin.onclick = function() {
        if($("#login_userid").val())
    {
        check1 = checkName(login_userId, usernameDiv);
        console.log(check1);
    }
    if($("#login_userpass").val())
    {
        check2 = checkPass(login_passWord, passwordDiv);
        console.log(check2);
    }
        if (check1 && check2) {
            $.ajax({
                    url: '/api/login',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        username: $("input[name='username']").val(),
                        password: $("input[name='password']").val(),
                        device: "web"
                    },
                })
                .done(function(data) {
                    console.log("success",data);
                    if(data.succ==0)
                    {
                        
                        window.location.href = "/index.html";
                    }
                    else
                    {
                        alert(data.msg);
                    }

                })
                .fail(function() {
                    console.log("error");
                })
        } else {
            alert('输入信息不正确');
        }

    }
    _travler.onclick = function() {
        // window.location.href='./index.html';
        $.ajax({
            url: '/api/login',
            type: 'POST',
            dataType: 'json',
        })
        .done(function(data) {
            console.log("success",data);
            window.location.href='./index.html';

        })
        .fail(function() {
            console.log("error");
        })        
    }    
}
