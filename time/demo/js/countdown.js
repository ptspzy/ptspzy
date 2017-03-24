/*全局变量*/
var audio = document.getElementById('music');
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;//小圆的半径
var MARGIN_TOP = 0;//上边距
var MARGIN_LEFT = 30;//左边距

//截止时间设置
var endTime = new Date('2016-06-18 24:00:00');
var curShowTimeSeconds = 0;

//小球参数设置
var balls = [];
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"]

/*基本函数*/
window.onload = function () {

    WINDOW_WIDTH = document.documentElement.clientWidth;
    WINDOW_HEIGHT = document.documentElement.clientHeight;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    RADIUS = Math.round(WINDOW_WIDTH * 3 / 5 / 300) - 1;

    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 100);


    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH * .8;
    canvas.height = WINDOW_HEIGHT * .8;

    curShowTimeSeconds = getCurrentShowTimeSeconds();

    setInterval(
        function () {
            render(context);
            update();
        }
        ,
        50
    );

};

function getDiffTimeSeconds() {
    var curTime = (new Date());
    var ret = Math.abs(endTime.getTime() - curTime.getTime());
    ret = Math.round(ret / 1000)
    return ret >= 0 ? ret : 0;

}

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = curTime.getTime();
    ret = Math.round(ret / 1000);
    return ret >= 0 ? ret : 0;
}

/*时间的改变*/
function update() {

    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    if (nextSeconds != curSeconds) {
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 34 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours / 10));
        }

        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 52 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
        }
        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 68 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
        }

        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 104 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 120 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;

    }

    updateBalls();
}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }
    //删除小球
    var cnt = 0;
    for (var i = 0; i < balls.length; i++)
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH)
            balls[cnt++] = balls[i];
    while (balls.length > Math.min(300, cnt)) {
        balls.pop();
    }
}

/*添加小球并设置小球的运动的物理参数*/
function addBalls(x, y, num) {

    for (var i = 0; i < digit[num].length; i++)
        for (var j = 0; j < digit[num][i].length; j++)
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }

                balls.push(aBall)
            }
}

/*绘制图形*/
function render(con) {
    //对矩形内部刷新操作
    con.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    var curentTime = new Date();
    var msDay = 24 * 60 * 60;

    var days = Math.round(getDiffTimeSeconds() / msDay);
    console.log(days)
    var hours = curentTime.getHours();
    var minutes = curentTime.getMinutes();
    var seconds = curentTime.getSeconds();

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), con);
    renderDigit(MARGIN_LEFT + 16 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), con);
    renderDigit(MARGIN_LEFT + 34 * (RADIUS + 1), MARGIN_TOP, 11, con);
    renderDigit(MARGIN_LEFT + 52 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), con);
    renderDigit(MARGIN_LEFT + 68 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), con);
    renderDigit(MARGIN_LEFT + 86 * (RADIUS + 1), MARGIN_TOP, 12, con);
    renderDigit(MARGIN_LEFT + 104 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), con);
    renderDigit(MARGIN_LEFT + 120 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), con);
    renderDigit(MARGIN_LEFT + 136 * (RADIUS + 1), MARGIN_TOP, 13, con);

    var str = days.toString();
    for (var i = 0; i < str.length; i++) {
        renderDigit(400 +MARGIN_LEFT + i * 20 * (RADIUS + 1), MARGIN_TOP * 16, str[i], con);
    }

    //绘制小球
    for (var i = 0; i < balls.length; i++) {
        con.fillStyle = balls[i].color;

        con.beginPath();
        con.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        con.closePath();

        con.fill();
    }
}

/**
 * 矩阵绘制
 * @param x
 * @param y
 * @param num
 * @param con
 */
function renderDigit(x, y, num, con) {
    con.fillStyle = "rgb(0,102,153)";

    for (var i = 0; i < digit[num].length; i++)
        for (var j = 0; j < digit[num][i].length; j++)
            if (digit[num][i][j] == 1) {
                con.beginPath();
                con.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                con.closePath();

                con.fill();
            }
}