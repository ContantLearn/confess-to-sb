import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../assets/css/default.css';
import '../../../assets/js/typewriter';
import words from '../../layout/words.html';
import heart from '../../layout/heart.html';

let intervalId,
    radian = 0,
    radian_add = Math.PI / 40;

setTimeout(initContent, 2000);

function initContent() {
    $(".confess-title").fadeOut();
    $(".confess-content").fadeIn(function () {
        $(".words").html(words);
        $(".hearts").html(heart);

        initPeople();
        $("#code").typewriter();

        setTimeout(draw, 12000);
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function initPeople() {
    let mr = getQueryString("mr") || "Man",
        mrs = getQueryString("mrs") || "Lady";

    $("#mr").text(mr);
    $("#mrs").text(mrs);
}

function initMessage() {
    $(".signature").fadeIn();
}

function getX1(t) {  //获取心型线的X坐标
    return 15 * (16 * Math.pow(Math.sin(t), 3))
}

function getY1(t) {  //获取心型线的Y坐标
    return -15 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
}

function draw() {
    let drawing = document.getElementById("drawing"),
        pic = document.getElementById('flower'),
        $hearts = $(".hearts"),
        width = $hearts.width(),
        height = $hearts.height();

    drawing.width = width;
    drawing.height = height;

    if (drawing.getContext) {
        let content = drawing.getContext("2d");

        // 设置原点坐标
        content.translate(width / 2, height / 2 - 40);

        // 绘制心形
        function heart() {
            let x = getX1(radian),
                y = getY1(radian);

            // 在给定坐标上绘制给定大小的图片
            content.drawImage(pic, x, y, 25, 25);
            radian += radian_add;
            // 绘制完整的心型线后取消绘制
            if (radian > (2 * Math.PI)) {
                clearInterval(intervalId);
                initMessage();
            }
        }

        intervalId = setInterval(heart, 100);
    }
}

