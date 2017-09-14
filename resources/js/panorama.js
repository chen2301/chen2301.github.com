/**
 * Created by Administrator on 2016/11/29.
 */


//you need to upload the file on the sever
window.onload = function() {
    getTitleHeight();
    loadingAllImg();
}
var canvasHeight;

function getTitleHeight() {
    var title = document.getElementById('title');
    var titleHeight = parseFloat(getComputedStyle(title).height);
    var maxHeight = window.innerHeight;
    canvasHeight = parseFloat(maxHeight - titleHeight) + 'px';
}

function loadingAllImg() {
    var div = document.getElementById('container');
    var PSV = new PhotoSphereViewer({
        panorama: 'resources/images/sphereImage.jpg',

        container: div,


        time_anim: false,


        navbar: [ // 工具栏
            'autorotate',
            'zoom',
            'caption',
            'gyroscope'
        ],
        gyroscope: true,

        size: {
            width: '100%',
            height: canvasHeight
        }
    });
}