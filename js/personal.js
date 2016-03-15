//检验输入框的函数 函数跟注册时一样的 但是换个文件夹 本机测试ajax加载不进来
var nickBin = '';
var userBin = '';
var qqBin = '';

var passBin = '';
var passBin2 = '';
var passBinCheck = '';

function personal() {
    var UserName = document.getElementById('userInput'); //输入用户名的框
    var myDivName = document.getElementById('myname'); //显示提示的框
    console.log(UserName, myDivName);
    var myNickDiv = document.getElementById('nickname'); //显示提示的框 昵称
    var NickName = document.getElementById('nick'); //输入昵称的框
    var passWord = document.getElementById('pass'); //输入密码框
    var passDiv = document.getElementById('pass1'); //密码提示框
    var passWord2 = document.getElementById('passsure'); //确认密码框
    var passDiv2 = document.getElementById('pass2'); //确认是否一致框
    var qqNumber = document.getElementById('qq'); //qq输入框
    var qqDiv = document.getElementById('qie'); //qq输入提示框



    $('#userInput').focus(function(event) { //jquery的方法必须只有jquer对象才能用，所以必须有$  
        divShow(myDivName); //提示框显示 divshow（提示框）参数为dom对象
        iconHide($('#userId')); //图标显示 iconHide(form-group)
        console.log('user');
    });
    $('#userInput').blur(function(event) {
        //要定义个新变量，如果直接对函数判断，函数会重复执行
        userBin = checkName(UserName, myDivName);
        iconShow(userBin, $('#userId'));
        console.log(userBin);
    });
    $('#nick').focus(function(event) {
        divShow(myNickDiv);
        iconHide($('#nickId'));
    });
    $('#nick').blur(function(event) {
        nickBin = checkNickName(NickName, myNickDiv);
        iconShow(nickBin, $('#nickId'));
    });
    $('#qq').focus(function(event) {
        divShow(qqDiv);
        iconHide($('#qqNum'));
    });
    $('#qq').blur(function(event) {
        qqBin = checkQQ(qqNumber, qqDiv);
        iconShow(qqBin, $('#qqNum'));
    });
    $('#pass').focus(function(event) {
        divShow(passDiv);
        iconHide($('#passId'));
    });
    $('#pass').blur(function(event) {
        passBin = checkPass(passWord, passDiv);
        iconShow(passBin, $('#passId'));
    });
    $('#passsure').focus(function(event) {
        divShow(passDiv2);
        iconHide($('#pass2Id'));
    });
    $('#passsure').blur(function(event) {
        passBin2 = checkPass(passWord2, passDiv2); //先检测是否为空
        passBinCheck = checkConsist(passWord, passWord2); //再检测两次是否一致
        var test = passBin && passBinCheck;
        iconShow(test, $('#pass2Id'));
    });
}

function changePersonal() {
    $("#changePersonal").click(function(event) {
        /* Act on the event */
        //后期要改，自己测试时要写进来才对
        var all = checkAll(nickBin, userBin, qqBin, passBin, passBin2, passBinCheck);
        console.log(all);
        if (all) {
            $.ajax({
                    url: '/api/Profile',
                    type: 'PUT',
                    dataType: 'json',
                    data: {
                        name: $("#userInput").val(),
                        nickname: $("#userInput").val(),
                        qq: $("#userInput").val(),
                        password: $("#pass").val()
                    },
                })
                .done(function() {
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                })

        } else {
            alert('输入信息不正确');
        }
    });
}

function checkName(name, div) {
    var inputName = name.value;
    if (inputName == "") {
        div.innerHTML = null;
        div.innerHTML = "<small>用户名不能为空</small>";
        return false;
    }
    //检测是否出现非数字或者非字母
    for (var i = 0; i < inputName.length; i++) {
        var text = inputName.charAt(i);
        console.log(inputName);
        console.log(inputName.length);
        console.log(i);
        console.log(text);
        if (!(text <= 9 && text >= 0) && !(text >= 'a' && text <= 'z') && !(text >= 'A' && text <= 'Z')) //如果既不是是数字又不是字母
        {
            console.log(text);
            div.innerHTML = null;
            div.innerHTML = "<small>用户名只能由数字、字母组成</small>";
            return false;
            break; //一旦检测到非字母数字就停止检测,跳出去了，但是整个循环体怎么执行了inputName.length遍？
        }
    }
    //检测长度是否符合
    if (inputName.length < 3 || inputName.length > 20) {
        div.innerHTML = null;
        div.innerHTML = "<small>用户名的长度在3到20之间</small>";
        return false;
    }
    //检测都通过了
    if (i >= inputName.length) {
        console.log("i=" + i);
        div.innerHTML = null;
        return true;
    }

}

function checkPass(password, show) {
    var inputPass = password.value;
    if (inputPass == "") {
        show.innerHTML = null;
        show.innerHTML = "<small>密码不能为空</small>";
        return false;
    }
    if (inputPass.length < 6 || inputPass.length > 20) {
        show.innerHTML = "<small>输入密码长度不符合</small>";
        return false;
    } else {
        return true;
    }
}

function checkNickName(nick, show) { //2到10位 字母，数字，汉字，不能有连续5个数字
    var nickName = nick.value; //两个对象都是dom对象
    if (nickName == "") {
        show.innerHTML = "<small>昵称名不能为空</small>";
        return false;
    }
    for (var m = 0; m < nickName.length; m++) {
        var text = nickName.charAt(m);
        var check1 = /^[A-Za-z0-9\u4e00-\u9fa5]$/.test(text); //检测是否是数字，字母，汉字
        if (!check1) {
            show.innerHTML = "<small>昵称名只能是字母、数字和汉字</small>";
            return false;
            break;
        }
    }
    if (nickName.length < 2 || nickName.length > 10) {
        show.innerHTML = "<small>长度只能2~10</small>";
        return false;
    }
    if (m >= nickName.length) {
        var check2 = /^\d{5}$/.test(nickName);
        if (check2) {
            show.innerHTML = '<small>不能有5个数字相连</small>';
            return false;
        } else {
            return true;
        }
    }

    // var pass=/(?![0-9]{5})[^\[\]]{2,10}/.test(nickName);//检测昵称名，一次都检测完，提示没法写
    // if(pass)
    // {
    //     return true;
    // }
}

function checkQQ(qq, show) {
    console.log(qq); //是input标签
    var qq = qq.value;
    console.log(qq); //是input里的value，是一个字符串!!
    console.log(typeof(qq))
    console.log(qq[0]);
    if (qq == "") {
        show.innerHTML = '<small>QQ号不能为空!</small>';
        return false;
    }
    for (var j = 0; j <= qq.length; j++) {
        var qqText = qq.charAt(j); //chartAt(index),返回的特定索引值下的字符
        if (!(qqText <= 9 && qqText >= 0)) //不是数字
        {
            show.innerHTML = "<small>输入只能为数字</small>";
            return false;
            break;
        }
    }
    if (qq.length < 5 || qq.length > 10) {
        show.innerHTML = '<small>长度不正确</small>';
        return false;
    }
    if (j >= qq.length) {
        return true;
    }
}

function checkConsist(pass1, pass2) {
    var word1 = pass1.value;
    var word2 = pass2.value;
    var passDiv2 = document.getElementById('pass2'); //确认是否一致框
    if (word1 === word2) {
        return true;
    } else {
        passDiv2.innerHTML = "<small>两次密码不一致</small>";
        return false;
    }
}

function checkAll(a, b, c, d, e, f) {
    if (a && b && c && d && e && f) {
        return true;
    } else {
        return false;
    }
}

function divShow(div) {
    div.innerHTML = null;
}

function iconShow(flag, target) {
    if (flag) {
        target.attr('class', 'has-feedback has-success form-group');
        target.find('span').eq(0).hide();
        target.find('span').eq(1).show();
    }
    if (!flag) {
        target.attr('class', 'has-feedback has-error form-group');
        target.find('span').eq(1).hide();
        target.find('span').eq(0).show();
    }
}

function iconHide(target) {
    target.attr('class', 'has-feedback form-group');
    target.find('span').hide();
}
