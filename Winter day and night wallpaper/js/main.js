
(function () {//页面样式变化 控制程序
    let durationM = 25;
    let durationS = durationM * 60;//天亮到日出以及日落到天黑时间跨度约25min,可根据实际情况更改
    let intervalD = 91;//春分→夏至→秋分→冬至，两个节气间 时间跨度约91天
    let changeM = 90;//春分→夏至→秋分→冬至，两个节气间 日出日落时间变化时间约90min

    let now = new Date();//当前时间对象
    let nowYear = now.getFullYear();//当前时间 年
    let nowStr = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate();//当前时间 yyyy/m/d 字符串
    let vernal_equinox = nowYear + "/03/21";//春分日期字符串
    let the_summer_solstice = nowYear + "/06/22";//夏至日期字符串
    let the_autumnal_equinox = nowYear + "/09/23";//秋分日期字符串
    let winter_solstice = nowYear + "/12/22";//冬至日期字符串
    let initial_sunrise = new Date(nowStr).getTime() + (6 * 60 * 60 * 1000) - (durationS * 1000);//春分，秋分天亮时间
    let initial_sunset = new Date(nowStr).getTime() + (18 * 60 * 60 * 1000) - (durationS * 1000);//春分，秋分天亮时间

    //计算对应节气 天亮天黑时间
    let days = getDays(the_autumnal_equinox, nowStr);
    let incrementM = changeM * (days / intervalD);
    let sunnrise, sunset;
    if (isDuringDate(vernal_equinox, the_summer_solstice)) {//春分→夏至
        sunnrise = new Date(initial_sunrise - incrementM * 60 * 1000);
        sunset = new Date(initial_sunset + incrementM * 60 * 1000);
    } else if (isDuringDate(the_summer_solstice, the_autumnal_equinox)) {//夏至→秋分
        sunnrise = new Date(initial_sunrise + incrementM * 60 * 1000);
        sunset = new Date(initial_sunset - incrementM * 60 * 1000);
    } else if (isDuringDate(the_autumnal_equinox, winter_solstice)) {//秋分→冬至
        sunnrise = new Date(initial_sunrise + incrementM * 60 * 1000);
        sunset = new Date(initial_sunset - incrementM * 60 * 1000);
    } else {//冬至→春分
        sunnrise = new Date(initial_sunrise - incrementM * 60 * 1000);
        sunset = new Date(initial_sunset + incrementM * 60 * 1000);
    }
    let myTimer;
    timeChangeMode(sunnrise, sunset)//执行一次模式判断
    timedExecution(sunnrise, sunset);//每隔一段时间执行一次模式判断

    function timeChangeMode(sunnrise, sunset) {//根据时间改变页面模式
        var refreshHours = new Date().getHours();
        var refreshMin = new Date().getMinutes();
        var refreshSec = new Date().getSeconds();
        //逐渐天亮
        if (refreshHours === sunnrise.getHours()
            && refreshMin === sunnrise.getMinutes()
            && refreshSec === sunnrise.getSeconds()) {
            toDayOrNight(durationS, 0);
        }
        //彻底天亮
        if (refreshHours > sunnrise.getHours()
            && refreshHours < sunset.getHours()) {
            toDayOrNight(3, 0);
        }
        //逐渐天黑
        if (refreshHours === sunset.getHours()
            && refreshMin === sunset.getMinutes()
            && refreshSec === sunset.getSeconds()) {
            toDayOrNight(durationS, 1);
        }
        //彻底天黑
        if (refreshHours > sunset.getHours()) {
            toDayOrNight(3, 1);
        }
    }

    function toDayOrNight(durationS, opacity) {//切换昼夜样式
        let boxNight = document.getElementsByClassName("night")[0];
        boxNight.style.transition = durationS + "s";
        boxNight.style.opacity = opacity;
    }

    function isDuringDate(beginDateStr, endDateStr) {//当前日期是否处于规定范围，半开区间 [起始,结束)
        var curDate = new Date(),
            beginDate = new Date(beginDateStr),
            endDate = new Date(endDateStr);
        if (curDate >= beginDate && curDate < endDate) {
            return true;
        }
        return false;
    }
    //var beginDateStr = "2021/01/01",endDateStr = "2023/06/25"
    function getDays(beginDateStr, endDateStr) {//获得两个日期之间相差的天数
        beginDate = new Date(beginDateStr),
            endDate = new Date(endDateStr);
        var t1 = beginDate.getTime();
        var t2 = endDate.getTime();
        var dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
        var minusDays = Math.floor(((t2 - t1) / dateTime));//计算出两个日期的天数差
        var days = Math.abs(minusDays);//取绝对值
        return days;
    }

    function timedExecution(sunnrise, sunset) {//创建计时器 每隔一段时间判断一次应该使用的模式
        myTimer = setInterval(function () {
            timeChangeMode(sunnrise, sunset);
        }, 1 * 60 * 1000);
    }
    //clearInterval(myTimer);

    {//昼夜切换按钮动画

        let select = function (s) {
            return document.querySelector(s);
        },
            selectAll = function (s) {
                return document.querySelectorAll(s);
            },
            hit = select('.hit'),
            allStars = selectAll('.starGroup *'),
            allClouds = selectAll('.cloud'),
            allCloudPuffs = selectAll('.cloud circle')

        TweenMax.set('svg', {
            visibility: 'visible'
        })
        TweenMax.set(allStars, {
            transformOrigin: '50% 50%'
        })
        TweenLite.defaultEase = Elastic.easeOut.config(0.58, 0.8);
        let tl = new TimelineMax({ paused: true });
        tl.staggerTo(['.sun', '.moonMask', '.moon'], 1, {
            cycle: {
                attr: [{ cx: '-=140', cy: '-=20' }, { cx: '-=140', cy: '-=20' }, { cx: '-=90', cy: '-=0' }]
            }
        }, 0)

            .staggerTo(['.moon', '.sun'], 1, {
                cycle: {
                    alpha: [1, 0]
                }
            }, 0, '-=1')
            .to('body', 1, {
                //backgroundColor:'#2C3E7B'
            }, '-=1')
            .to('.outline', 1, {
                stroke: '#6172AD',
                fill: '#45568D'
            }, '-=1')

            .staggerFrom(allStars, 0.9, {
                cycle: {
                    x: [-20, 30, 40, -30, 60, -40, 80, 90, 100, 110, 120]
                },
                alpha: 0
            }, 0.005, '-=1')

            .staggerTo(allClouds, 1, {
                cycle: {
                    x: [40, 20]
                },
                alpha: 0
            }, 0, '-=1')

            .addPause()


            .staggerTo(['.sun', '.moonMask', '.moon'], 1, {
                cycle: {
                    attr: [{ cx: '+=140', cy: '+=20' }, { cx: '+=140', cy: '+=20' }, { cx: '+=90', cy: '+=0' }]
                }
            }, 0)
            .staggerTo(['.moon', '.sun'], 1, {
                cycle: {
                    alpha: [0, 1]
                }
            }, 0, '-=1')
            .to('body', 1, {
                //backgroundColor:'#26D6FE',
                ease: Linear.easeNone
            }, '-=1')
            .to('.outline', 1, {
                stroke: '#FCFDFE',
                fill: '#85E8FE'
            }, '-=1')
            .staggerTo(allStars, 1, {
                alpha: 0
            }, 0, '-=1')
            .staggerFromTo(allClouds, 0.6, {
                cycle: {
                    y: [120, 160],
                    x: [0]
                }
            },
                {
                    cycle: {
                        y: [0],
                        x: [0]
                    },
                    alpha: 1,
                    immediateRender: false
                }, 0.06, '-=1')


            .from(['.plane', '.contrail'], 0.7, {
                x: -400,
                ease: Linear.easeNone
            }, '-=1')

            .to('.contrail', 0.5, {
                alpha: 0,
                ease: Sine.easeOut
            })

        //ScrubGSAPTimeline(tl);

        function clickToggle(e) {//点击 hit执行
            if (tl.time() > 0 && tl.time() < tl.duration()) {
                tl.play();
                let wall = document.getElementsByClassName("night")[0];
                wall.style.transition = 3 + "s";
                wall.style.opacity = 0;
                clearInterval(myTimer);
            } else {
                tl.play(0);
                let wall = document.getElementsByClassName("night")[0];
                wall.style.transition = 3 + "s";
                wall.style.opacity = 1;
                clearInterval(myTimer);
            }
        }

        tl.timeScale(0.7)
        hit.onclick = clickToggle;
        TweenMax.globalTimeScale(2)//修改按钮动画速度
    }


    ////////////设置按钮
    document.getElementsByClassName("ope_set")[0].onclick = function () {
        let set = document.getElementsByClassName("set")[0];
        if (set.clientWidth === 0) {
            set.style.width = 180 + "px";
            document.getElementsByClassName("ope_set")[0].style.transform = "rotate(360deg)";
        } else {
            set.style.width = 0 + "px";
            document.getElementsByClassName("ope_set")[0].style.transform = "rotate(0deg)";
        }
    }
    
    document.getElementById("ope_snow").onclick = function () {
        snow();
    }
    document.getElementById("clo_snow").onclick = function () {
        location.reload();
    }


    document.getElementById("use_on").onclick = function () {
        timedExecution(sunnrise, sunset);
    }
    document.getElementById("use_off").onclick = function () {
        clearInterval(myTimer);
    }
    document.getElementById("reload").onclick = function () {
        location.reload();
    }
}());

function snow() {
    //  1、定义一片雪花模板
    var flake = document.createElement('div');
    // 雪花字符 ❄❉❅❆✻✼❇❈❊✥✺
    flake.innerHTML = '❅';
    flake.style.cssText = 'position:absolute;color:#fff;';
    //获取页面的高度 相当于雪花下落结束时Y轴的位置
    var documentHieght = window.innerHeight;
    //获取页面的宽度，利用这个数来算出，雪花开始时left的值
    var documentWidth = window.innerWidth;
    //定义生成一片雪花的毫秒数
    var millisec = 10;
    //2、设置第一个定时器，周期性定时器，每隔一段时间（millisec）生成一片雪花；
    setInterval(function () { //页面加载之后，定时器就开始工作
        //随机生成雪花下落 开始 时left的值，相当于开始时X轴的位置
        var startLeft = Math.random() * documentWidth;
        //随机生成雪花下落 结束 时left的值，相当于结束时X轴的位置
        var endLeft = Math.random() * documentWidth;
        //随机生成雪花大小
        var flakeSize = 3 + 20 * Math.random();
        //随机生成雪花下落持续时间
        var durationTime = 4000 + 7000 * Math.random();
        //随机生成雪花下落 开始 时的透明度
        var startOpacity = 0.7 + 0.3 * Math.random();
        //随机生成雪花下落 结束 时的透明度
        var endOpacity = 0.2 + 0.2 * Math.random();
        //克隆一个雪花模板
        var cloneFlake = flake.cloneNode(true);
        //第一次修改样式，定义克隆出来的雪花的样式
        cloneFlake.style.cssText += `
                       left: ${startLeft}px;
                       opacity: ${startOpacity};
                       font-size:${flakeSize}px;
                       top:-25px;
                           transition:${durationTime}ms;`;
        //拼接到页面中
        document.body.appendChild(cloneFlake);
        //设置第二个定时器，一次性定时器，
        //当第一个定时器生成雪花，并在页面上渲染出来后，修改雪花的样式，让雪花动起来；
        setTimeout(function () {
            //第二次修改样式
            cloneFlake.style.cssText += `
                               left: ${endLeft}px;
                               top:${documentHieght}px;
                               opacity:${endOpacity};`;
            //4、设置第三个定时器，当雪花落下后，删除雪花。
            setTimeout(function () {
                cloneFlake.remove();
            }, durationTime);
        }, 0);
    }, millisec);
}
//snow();






