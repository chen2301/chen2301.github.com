$(function () {
    var videoPlayer = $("#videoPlayer");
    enableInlineVideo(videoPlayer.get(0));
    var loader = $(".loader");
    var alertDiv = $("#alert-div");
    var scratch_card = $(".scratch_card");


    $("#play").one("click",function () {
        loader.fadeOut();
        setTimeout(function () {
            videoPlayer[0].play();
        },500);
    });

    videoPlayer.bind("ended",function () {
        alert("Explore the deep ocean in 360°");
        window.location.href = "panorama.html"
    });

    videoPlayer.bind("error", function (event) {
        alert("player error");
        console.log(event);
    });

    var showReadyBtn_Executed = false;
    videoPlayer.one("canplay",function () {
        showReadyBtn();
    });

    setTimeout(function () {
        if(!showReadyBtn_Executed){
            videoPlayer.unbind("canplay");
            showReadyBtn();
        }
    },5000);

    function showReadyBtn() {
        showReadyBtn_Executed = true;
        loader.find(".square-spin").fadeOut();
        setTimeout(function () {
            loader.find("#readyBtn").fadeIn();
        },500);
    }


    var _isExecuted_1 = false,
        _isExecuted_2 = false;
    videoPlayer.on("timeupdate",function (event) {
        var currentTime = parseInt(event.target.currentTime);
        if(currentTime === 130 && !_isExecuted_1){
            if (window.DeviceMotionEvent) {
                videoPlayer[0].pause();
				_isExecuted_1 = true;
                alertDiv.fadeIn();

                window.addEventListener("devicemotion", function (event) {
                    deviceMotionHandler(event, function () {
                        alert("Thanks!");
                        // hide the alert
                        $(".alertDiv").fadeOut();
                        // continue to play
                        setTimeout(function () {
                            videoPlayer[0].play();
                        }, 500);
						$(window).unbind("devicemotion");
                    },function () {
                        $(alertDiv).hide();
                        videoPlayer[0].play();
                        console.log("error");
						alert("Can't get the information.");
                        $(window).unbind("devicemotion");
                    });

                },false);
            }else {
                console.log("设备不支持陀螺仪，操作跳过");
            }

        }
        // 9s
        else if(currentTime === 9 && !_isExecuted_2){
            _isExecuted_2 = true;
            videoPlayer[0].pause();
            scratch_card.fadeIn();
            scratch_card_init(function () {
                // hide the touch
                scratch_card.fadeOut();
                // continue to play
                setTimeout(function () {
                    videoPlayer[0].play();
                }, 500);
            })

        }
        // both of them has been operated
        else if(_isExecuted_1 && _isExecuted_2){
            videoPlayer.unbind("timeupdate");
        }
    });



    var shakeThreshold = 3000;
	  //设置最后更新时间，用于对比
    var lastUpdate = 0;
    //设置位置速率
    var curShakeX, curShakeY, curShakeZ, lastShakeX, lastShakeY, lastShakeZ = 0;
    function deviceMotionHandler(event, callBack,errorCallBack) {

        var acceleration = event.accelerationIncludingGravity || event.originalEvent.accelerationIncludingGravity;
        if(acceleration == null ) {
            if (typeof errorCallBack == 'function'){
                errorCallBack();
            }
            return;
        }

        var curTime = new Date().getTime();

        if ((curTime - lastUpdate) > 100) {

            var diffTime = curTime - lastUpdate;
            lastUpdate = curTime;

            curShakeX = acceleration.x;
            curShakeY = acceleration.y;
            curShakeZ = acceleration.z;

            var speed = Math.abs(curShakeX + curShakeY + curShakeZ - lastShakeX - lastShakeY - lastShakeZ) / diffTime * 10000;

            if (speed > shakeThreshold) {
                if (typeof callBack == 'function') {
                    callBack();
                }
            }

            lastShakeX = curShakeX;
            lastShakeY = curShakeY;
            lastShakeZ = curShakeZ;
        }
    }

    // guagua
    function scratch_card_init(callBack) {

        var c1; //canvas
        var ctx; //pencil
        var ismousedown; 
        var isOk=0; 
        var fontem = parseInt(window.getComputedStyle(document.documentElement, null)["font-size"]);

        c1 = document.getElementById("scratch_card_can");
        c1.width=c1.clientWidth;
        c1.height=c1.clientHeight;
        ctx = c1.getContext("2d");
        //PC
        c1.addEventListener("mousemove",eventMove,false);
        c1.addEventListener("mousedown",eventDown,false);
        c1.addEventListener("mouseup",eventUp,false);
        //mobile
        c1.addEventListener('touchstart', eventDown,false);
        c1.addEventListener('touchend', eventUp,false);
        c1.addEventListener('touchmove', eventMove,false);
		
        initCanvas();

        function initCanvas(){
            // c1.style.backgroundImage="url(resources/images/logo.jpg)";
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = '#aaaaaa';
            ctx.fillRect(0,0,c1.clientWidth,c1.clientHeight);
            ctx.fill();
            ctx.font = "Bold 30px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#999999";
            ctx.fillText("scratch this area",c1.width/2,c1.clientHeight/2);
            ctx.globalCompositeOperation = 'destination-out';
        }

        function eventDown(e){
            e.preventDefault();
            ismousedown=true;
        }

        function eventUp(e){
            e.preventDefault();
            var a = ctx.getImageData(0,0,c1.width,c1.height);
            var j=0;
            for(var i=3;i<a.data.length;i+=4){
                if(a.data[i]==0)j++;
            }
            if(j>=a.data.length/8){
                if (typeof callBack == 'function') {
                    callBack();
                }
            }
            ismousedown=false;
        }

        function eventMove(e){
            e.preventDefault();
            if(ismousedown) {
                if(e.changedTouches){
                    e=e.changedTouches[e.changedTouches.length-1];
                }
                // var topY = document.getElementById("top").offsetTop;
                var oX = c1.offsetLeft,
                    oY = c1.offsetTop;
                var x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
                    y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0;

                
                ctx.beginPath();
                ctx.arc(x, y, fontem*3, 0, Math.PI * 2,true);

                c1.style.display = 'none';
                c1.offsetHeight;
                c1.style.display = 'inherit';
                ctx.fill();
            }
        }
    }



});
