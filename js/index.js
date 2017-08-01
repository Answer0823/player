/**
 * 1、本地音乐文件初始化为一个对象，遍历整个对象创建播放列表内容。
 *
 * 2、播放/暂停按钮-调用audio.paused属性进行按钮CSS转化。
 *
 * 3、播放列表；切歌按钮 绑定的相同的3个事件：
 *         <1>、 列表中当前播放歌曲前出现红色小喇叭--正在播放。
 *         <2>、底部歌曲专辑图片切换至当前曲目图片，歌曲名字替换。
 *         <3>、通过Ajax获取歌词文件。
 *         <4>、歌词滚动。
 *
 * 4、歌词页面中“音量控制条“和“播放进度控制条”：
 *
 *         <1>、音量控制条
 *               1>.控制音量
 *
 *         <2>播放进度控制条：
 *               1>.滑动控制歌曲播放位置；
 *               2>.播放条左侧歌曲已播放时间改变；
 *               3>.歌词面板滑动至相应位置；
 *
 */
$(function () {
    //初始化歌曲对象
    var songList = {
        'Ellie Goulding': {
            name: 'Lights',
            singer: 'Ellie Goulding',
            album: 'Lights',
            picUrl: 'images/singerPics/Lights.png',
            srcUrl: 'music/Ellie Goulding - Lights.mp3'
        },
        'Beyond': {
            name: '海阔天空',
            singer: 'Beyond',
            album: '海阔天空',
            picUrl: 'images/singerPics/海阔天空.png',
            srcUrl: 'music/Beyond - 海阔天空.mp3'
        },
        'Lafee': {
            name: 'tell me why',
            singer: 'lafee',
            album: 'Shut Up',
            picUrl: 'images/singerPics/tell me why.png',
            srcUrl: 'music/lafee - tell me why.mp3'
        },
        'Justin Timberlake': {
            name: 'Five Hundred Miles',
            singer: 'Justin Timberlake',
            album: 'Inside Llewyn Davis',
            picUrl: 'images/singerPics/Five Hundred Miles.png',
            srcUrl: 'music/Justin Timberlake - Five Hundred Miles.mp3'
        },
        'Passenger': {
            name: 'Let Her Go',
            singer: 'Passenger',
            album: 'All The Little Lights',
            picUrl: 'images/singerPics/Let Her Go.png',
            srcUrl: 'music/Passenger - Let Her Go.mp3'
        },
        '孙燕姿': {
            name: '遇见',
            singer: '孙燕姿',
            album: '经典全记录（主打精华版）',
            picUrl: 'images/singerPics/遇见.png',
            srcUrl: 'music/孙燕姿 - 遇见.mp3'
        },
        '马飞': {
            name: '种树',
            singer: '马飞',
            album: '我当初就不应该学吉他',
            picUrl: 'images/singerPics/种树.png',
            srcUrl: 'music/马飞 - 种树.mp3'
        },
        'James Blunt':{
            name: '1973',
            singer: 'James Blunt',
            album: '1973',
            picUrl: 'images/singerPics/1973.png',
            srcUrl: 'music/James - Blunt.mp3'
        },
        'Sia':{
            name:'Chandelier',
            singer:'Sia',
            album:'Chandelier',
            picUrl:'images/singerPics/Chandelier.png',
            srcUrl:'music/Sia - Chandelier.mp3'
        }
    };

    var list = Object.keys(songList);   //通过对象内置方法获取对象键的数组

    //将对象遍历渲染至页面歌曲列表
    for (var i = 0; i < list.length; i++) {
        var strings = '<li>' +
            '<img class="hurn " src="images/pngs/hurn.png">' +
            '<div class="leftContent">' +
            '<p class="songName"> ' + songList[list[i]].name + '</p>' +
            '<small class="singer">' + songList[list[i]].singer + '</small>' +
            ' - ' +
            '<small class="album">' + songList[list[i]].album + '</small>' +
            '</div>' +
            '</li>';

        $('#songlist').append(strings);

    }

    //首页、歌词页播放/暂停按钮绑定事件
    $('#play-pause-1,#play-pause-2').on('click', function () {
        if (myAudio.paused) {
            myAudio.play();
            $('#albumimgs').css({animationPlayState:"running"});
            $('#play-pause-1').css({backgroundImage: "url(images/pngs/pause.png)"});
            $('#play-pause-2').css({backgroundImage: "url(images/pngs/pause-1.png)"});
        } else {
            myAudio.pause();
            $('#albumimgs').css({animationPlayState:"paused"});
            $('#play-pause-1').css({backgroundImage: "url(images/pngs/play.png)"});
            $('#play-pause-2').css({backgroundImage: "url(images/pngs/play-1.png)"});
        }
    });

    var myAudio = document.getElementById('audio1');                //获取音频元素；
    var voice = document.getElementById('volumeRange');            //获取音量控制条元素
    var playRange = document.getElementById('playRange');          //获取播放进度控制条元素
    var imgs = document.getElementById('pic');                      //获取展示歌曲图片的元素
    var $playRange = $('#playRange');
    var $time = $('#time-1');                                       //获取显示歌曲已播放时间元素

    voice.value = 50;
    playRange.value = 0;
    myAudio.volume = 0.5;                                             //初始化音量值及播放进度值

    myAudio.src = "music/Ellie Goulding - Lights.mp3";

    $('#volumeRange').on('change', function () {                   //监测input事件调节音量
        myAudio.volume = voice.value / 100;
    });



    //显示已播放时长函数
    function timeShow() {
        playRange.value = myAudio.currentTime;
        var min = parseInt(playRange.value / 60);
        var sec = parseInt(Math.round(playRange.value - min * 60));

        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }

        var timeLength1 = "" + min + ":" + sec + "";      //设置显示格式
        $time.html(timeLength1);
    }

    //监听input事件动态改变已播放时间
    $playRange.on('change', function () {
        myAudio.currentTime = playRange.value;
        timeShow();
    });

    //歌曲状态为可播放时 ，播放条右侧显示歌曲总时长
    $('#audio1').on('canplay', function () {

        var mins = parseInt(myAudio.duration / 60);
        var secs = parseInt(Math.round(myAudio.duration - mins * 60));

        if (mins < 10) {
            mins = '0' + mins;
        }
        if (secs < 10) {
            secs = '0' + secs;
        }

        var timeLength = "" + mins + ":" + secs + "";

        $('#duration').html(timeLength);

        $playRange.attr('max', parseInt(Math.round(myAudio.duration)));

        setInterval(function () {
            if (!myAudio.paused) {
                timeShow();
            }
        }, 1000);
    });

    //首页播放列表点击事件
    $('#content-2').on('click', '.leftContent', function () {

        $('.lrycilist').remove();                                           //移除ajax动态添加的歌词列元素  切歌时移除上一首歌词
        $('#lryci-2').animate({
            scrollTop: 0
        });
        var singnames = $(this).find('p').html();                          //html文档中列表元素各子元素显示歌曲名字，歌手，专辑，让后通过查找元素来确定歌曲信息
        var songers = $(this).find('small').html();
        var imagesrc = $.trim($(this).find('.songName').html());
        var $this = $(this).prev();

        myAudio.src = "music/" + songers + " -" + singnames + ".mp3";       //字符串变量拼接改变音频地址
        myAudio.play();                                                        //点击列表默认播放

        imgs.src = "images/singerPics/" + imagesrc + ".png";

        $('#filter_blur,#albumimgs').css({
            backgroundImage:"url("+imgs.src+")"
        }).delay("slow");

        $('#songName,#songName2').html(singnames);
        $('#singer').html(songers);                                          //替换footer内歌手图片及歌曲名
        $('#singleLrc').find('small').html(songers);


        $('#play-pause-1').css({backgroundImage: "url(images/pngs/pause.png)"});
        $('#play-pause-2').css({backgroundImage: "url(images/pngs/pause-1.png)"});    //暂停播放按钮图片切换

        playRange.value = 0;                                             //重置播放条进度
        $time.html('00:00');                                           //重置播放条左侧已播放时长

        if (!$this.hasClass('active')) {                               //正在播放歌曲列表左侧显示小喇叭表示当前播放歌曲
            $('.active').removeClass('active');
            $this.addClass('active');
        }

        //Ajax获取歌词

        var $lryciScroll = $('#lryci-scroll');                       //获取歌词div滚动条
        var Lryci = new XMLHttpRequest();                              //声明ajax XMLHttpRequest对象

        Lryci.onreadystatechange = function () {
            if (Lryci.readyState === 4 && Lryci.status === 200) {
                //成功获取个歌词后
                var lrycistring = Lryci.responseText;                    //获取的歌词以字符格式返回
                var lryciArry = lrycistring.split(/\[\d*:\d*.\d*]/g);    //以歌词内时间轴为分割点，将歌词提取出来存放在数组里
                var lryciTime = lrycistring.match(/\[\d*:\d*/g);          //获取歌词时间轴（每句歌词前面会显示时间格式：[分分：秒秒.毫秒]）
                var lryciMins = [];                                        //声明存放分的数组
                var lryciSens = [];                                        //声明存放秒的数组
                var playTime = [];                                        //播放时间数组

                for (i = 0; i < lryciTime.length; i++) {                        //循环添加歌词至歌词页面
                    lryciMins[i] = parseInt(lryciTime[i][2]);
                    lryciSens[i] = parseInt(lryciTime[i][4] + lryciTime[i][5]);
                    playTime[i] = lryciMins[i] * 60 + lryciSens[i];
                    //每句歌词所属的<p>元素中“data-play-time”属性存放已播放时长"data-scroll"属性存放父元素<div id="lryci-2">的scoll-top值
                    $lryciScroll.append('<p class="lrycilist" data-play-time="' + playTime[i] + '" data-scroll="' + (parseInt($('#lryci-scroll').height()) + 40) + '">' + lryciArry[i + 1] + '</p>');
                }

                //设置计时器，根据播放时间滚动歌词
                setInterval(function () {
                    if (!myAudio.paused) {
                        var $this3 = $('.lrycilist[data-play-time = ' + parseInt(myAudio.currentTime) + ']');    //寻找声明当前歌曲播放时间所对应的歌词元素
                        var text = $('.white').html();
                        $('#singleLrc').find('small').html(text);
                        $('#lryci-2').stop().animate({
                            scrollTop: $this3.attr('data-scroll')     //拉去该歌词元素的“data-scroll”属性值  设置父元素的scroll-top属性值
                        });

                        $this3.addClass('white');
                        $this3.prev().removeClass('white')                   //添加white类名来改变当前歌词颜色；
                    }
                }, 500);

            }
        };
        Lryci.open("GET", "music/Lrc/" + songers + " -" + singnames + ".lrc", true);
        Lryci.send();

    });


    //播放下一首
    $('#nextSong').on('click', function () {

        $('.lrycilist').remove(); //移除ajax动态添加的歌词列元素  切歌时移除上一首歌词
        $('#lryci-2').animate({
            scrollTop: 0
        });

        var $this1 = $('.hurn.active').parent().next().find('.leftContent');             //和点击列表时间做的事情差不多：显示小喇叭，修改audio视频地址，更改暂停播放按钮，重置播放条左侧播放时间
        if ($this1.length < 1) {
            $this1 = $('#songlist').find('.leftContent').first();
        }
        //判断是否是列表中的最后一首歌，如果是，将切换至列表中第一首歌曲
        var singnames = $this1.find('p').html();
        var songers = $this1.find('small').html();
        var imagesrc = $.trim($this1.find('.songName').html());
        var $this = $this1.prev();

        myAudio.src = "music/" + songers + " -" + singnames + ".mp3";
        myAudio.play();
        imgs.src = "images/singerPics/" + imagesrc + ".png";

        $('#songName,#songName2').html(singnames);
        $('#singer').html(songers);
        $('#singleLrc').find('small').html(songers);

        $('#filter_blur,#albumimgs').css({
            backgroundImage:"url("+imgs.src+")"
        }).delay("slow");

        $('#play-pause-1').css({backgroundImage: "url(images/pngs/pause.png)"});
        $('#play-pause-2').css({backgroundImage: "url(images/pngs/pause-1.png)"});

        playRange.value = 0;
        $time.html('00:00');

        if (!$this.hasClass('active')) {
            $('.active').removeClass('active');
            $this.addClass('active');
        }

        var $lryciScroll = $('#lryci-scroll');                       //获取歌词div滚动条
        var Lryci = new XMLHttpRequest();                              //声明ajax XMLHttpRequest对象

        Lryci.onreadystatechange = function () {
            if (Lryci.readyState === 4 && Lryci.status === 200) {
                //成功获取个歌词后
                var lrycistring = Lryci.responseText;                    //获取的歌词以字符格式返回
                var lryciArry = lrycistring.split(/\[\d*:\d*.\d*]/g);    //以歌词内时间轴为分割点，将歌词提取出来存放在数组里
                var lryciTime = lrycistring.match(/\[\d*:\d*/g);          //获取歌词时间轴（每句歌词前面会显示时间格式：[分分：秒秒.毫秒]）
                var lryciMins = [];                                        //声明存放分的数组
                var lryciSens = [];                                        //声明存放秒的数组
                var playTime = [];                                        //播放时间数组

                for (i = 0; i < lryciTime.length; i++) {                        //循环添加歌词至歌词页面
                    lryciMins[i] = parseInt(lryciTime[i][2]);
                    lryciSens[i] = parseInt(lryciTime[i][4] + lryciTime[i][5]);
                    playTime[i] = lryciMins[i] * 60 + lryciSens[i];
                    //每句歌词所属的<p>元素中“data-play-time”属性存放已播放时长"data-scroll"属性存放父元素<div id="lryci-2">的scoll-top值
                    $lryciScroll.append('<p class="lrycilist" data-play-time="' + playTime[i] + '" data-scroll="' + (parseInt($('#lryci-scroll').height()) + 40) + '">' + lryciArry[i + 1] + '</p>');
                }

                //设置计时器，根据播放时间滚动歌词
                setInterval(function () {
                    if (!myAudio.paused) {
                        var $this3 = $('.lrycilist[data-play-time = ' + parseInt(myAudio.currentTime) + ']');    //寻找声明当前歌曲播放时间所对应的歌词元素
                        var text = $('.white').html();
                        $('#singleLrc').find('small').html(text);
                        $('#lryci-2').stop().animate({
                            scrollTop: $this3.attr('data-scroll')     //拉去该歌词元素的“data-scroll”属性值  设置父元素的scroll-top属性值
                        });

                        $this3.addClass('white');
                        $this3.prev().removeClass('white')
                    }
                }, 500);

            }
        };
        Lryci.open("GET", "music/Lrc/" + songers + " -" + singnames + ".lrc", true);
        Lryci.send();
    });

    //上一首 播放 （同上一首播放事件）
    $('#pervSong').on('click', function () {

        $('.lrycilist').remove(); //移除ajax动态添加的歌词列元素  切歌时移除上一首歌词
        $('#lryci-2').animate({
            scrollTop: 0
        });

        var $this1 = $('.hurn.active').parent().prev().find('.leftContent');
        if ($this1.length < 1) {
            $this1 = $('#songlist').find('.leftContent').last();
        }
        var singnames = $this1.find('p').html();
        var songers = $this1.find('small').html();
        var imagesrc = $.trim($this1.find('.songName').html());
        var $this = $this1.prev();

        myAudio.src = "music/" + songers + " -" + singnames + ".mp3";
        myAudio.play();
        imgs.src = "images/singerPics/" + imagesrc + ".png";

        $('#songName,#songName2').html(singnames);
        $('#singer').html(songers);
        $('#singleLrc').find('small').html(songers);

        $('#filter_blur,#albumimgs').css({
            backgroundImage:"url("+imgs.src+")"
        });

        $('#play-pause-1').css({backgroundImage: "url(images/pngs/pause.png)"});
        $('#play-pause-2').css({backgroundImage: "url(images/pngs/pause-1.png)"});

        playRange.value = 0;
        $time.html('00:00');

        if (!$this.hasClass('active')) {
            $('.active').removeClass('active');
            $this.addClass('active');
        }

        var $lryciScroll = $('#lryci-scroll');                       //获取歌词div滚动条
        var Lryci = new XMLHttpRequest();                              //声明ajax XMLHttpRequest对象

        Lryci.onreadystatechange = function () {
            if (Lryci.readyState === 4 && Lryci.status === 200) {
                //成功获取个歌词后
                var lrycistring = Lryci.responseText;                    //获取的歌词以字符格式返回
                var lryciArry = lrycistring.split(/\[\d*:\d*.\d*]/g);    //以歌词内时间轴为分割点，将歌词提取出来存放在数组里
                var lryciTime = lrycistring.match(/\[\d*:\d*/g);          //获取歌词时间轴（每句歌词前面会显示时间格式：[分分：秒秒.毫秒]）
                var lryciMins = [];                                        //声明存放分的数组
                var lryciSens = [];                                        //声明存放秒的数组
                var playTime = [];                                        //播放时间数组

                for (i = 0; i < lryciTime.length; i++) {                        //循环添加歌词至歌词页面
                    lryciMins[i] = parseInt(lryciTime[i][2]);
                    lryciSens[i] = parseInt(lryciTime[i][4] + lryciTime[i][5]);
                    playTime[i] = lryciMins[i] * 60 + lryciSens[i];
                    //每句歌词所属的<p>元素中“data-play-time”属性存放已播放时长"data-scroll"属性存放父元素<div id="lryci-2">的scoll-top值
                    $lryciScroll.append('<p class="lrycilist" data-play-time="' + playTime[i] + '" data-scroll="' + (parseInt($('#lryci-scroll').height()) + 40) + '">' + lryciArry[i + 1] + '</p>');
                }

                //设置计时器，根据播放时间滚动歌词
                setInterval(function () {
                    if (!myAudio.paused) {
                        var $this3 = $('.lrycilist[data-play-time = ' + parseInt(myAudio.currentTime) + ']');    //寻找声明当前歌曲播放时间所对应的歌词元素
                        var text = $('.white').html();
                        $('#singleLrc').find('small').html(text);
                        $('#lryci-2').stop().animate({
                            scrollTop: $this3.attr('data-scroll')     //拉去该歌词元素的“data-scroll”属性值  设置父元素的scroll-top属性值
                        });

                        $this3.addClass('white');
                        $this3.prev().removeClass('white')
                    }
                }, 500);

            }
        };
        Lryci.open("GET", "music/Lrc/" + songers + " -" + singnames + ".lrc", true);
        Lryci.send();
    });

    //页面切换
    $('#nextpage').on('click', function () {
        $('#outborder').css({
            marginTop: -660
        });
        $('#filter_blur').css({
            backgroundImage:"url("+imgs.src+")"
        });
        $('#hh').css({
            position:"absolute"
        })
    });

    $('#backto').on('click', function () {
        $('#outborder').css({
            marginTop: 0
        });
        $('#filter_blur').css({
            backgroundImage:"url("+imgs.src+")"
        });
        $('#hh').css({
            position:"static"
        })
    });

    $('#albumpic').click(function () {
        $(this).addClass('active3');
        $('#lryci-content').removeClass('active3');
    });
    $('#lryci-content').click(function () {
        $(this).addClass('active3');
        $('#albumpic').removeClass('active3');
    })
});
