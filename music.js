/*
***********************
* Francesco Vatteroni *
*  Matricola: 468134  *
*        UniPi        *
***********************
*/

var ctx;
var DnD;
var mode;
var state;
var slotx;
var sloty;
var sizeh;
var sizew;
var audio;
var matrix;
var canvas;
var auxtimer;
var interval;
var iconplay;
var iconstop;
var iconpencil;
var iconeraser;
var colortopleft;
var colortopright;
var colortopmiddle;
var colorbottomleft;
var colorbottomright;
var colorbottommiddle;
var statereproduction;

function dec2hex (x) {
    var d = parseInt(x);
    if (d > 255)
        return "FF";
    else if (d > 15)
        return d.toString(16);
    else
        return "0" + d.toString(16);
}

function calculateColor(i,j){
    var rgb = [0,0,0];
    var stepy = 1/sloty;
    var s = slotx/2;
    var stepx = 1/s;

    for (var iter = 0; iter<3; iter++){ 
        if(j<s) {   
            var ctl = colortopleft[iter] * (1-(stepy*(i))) * (1-(stepx*(j%s))) ;
            var ctm = colortopmiddle[iter] * (1-(stepy*(i))) * (stepx*(j%s));
            var ctr = 0;

            var cbl = colorbottomleft[iter] * (stepy*(i)) * (1-(stepx*(j%s)));
            var cbm = colorbottommiddle[iter] * (stepy*(i)) * (stepx*(j%s));
            var cbr = 0;
        } else {
            var ctl = 0;
            var ctm = colortopmiddle[iter] * (1-(stepy*(i))) * (1-(stepx*(j%s)));
            var ctr = colortopright[iter] * (1-(stepy*(i))) * (stepx*(j%s));

            var cbl = 0;
            var cbm = colorbottommiddle[iter] * (stepy*(i)) * (1-(stepx*(j%s)));
            var cbr = colorbottomright[iter] * (stepy*(i)) * (stepx*(j%s));
        }

        rgb[iter] = ( ctl + ctr + ctm + cbl + cbr + cbm );
    }

    return rgb;;
}

function drawRectOff(ctx,x,y,w,h,i,j){
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(x,y,w,h);
    
    if (state && (i == statereproduction)){
        ctx.fillStyle="#E5E5E5";
    } else {
        ctx.fillStyle="#DDDDDD";
    }
    ctx.fillRect(x+1,y+1,w-2,h-2);
}

function drawRectOn(ctx,x,y,w,h,i,j){

    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(x,y,w,h);

    var rgb = calculateColor(j,i);
    var color = "#" + dec2hex(rgb[0]) + dec2hex(rgb[1]) + dec2hex(rgb[2]);

    if (state && (i == statereproduction)){
        var grd = ctx.createRadialGradient(x+(w/2),y+(h/2),0,x+(w/2),y+(h/2),Math.min(w,h)/2);
        color = "#" + dec2hex(rgb[0]+25) + dec2hex(rgb[1]+25) + dec2hex(rgb[2]+25);
        grd.addColorStop(1, color);
        color = "#" + dec2hex(rgb[0]+150) + dec2hex(rgb[1]+150) + dec2hex(rgb[2]+150);
        grd.addColorStop(0, color);
        ctx.fillStyle = grd;
    } else {
        ctx.fillStyle=color;
    }
    
    ctx.fillRect(x+1,y+1,w-2,h-2);
}

function onPaint(){
    ctx.beginPath();

    for (var i = 0; i < slotx; i++) {
        for (var j = 0; j < sloty; j++) {
            if(matrix[i][j]) {
                drawRectOn(ctx,(i*sizew),(j*sizeh),sizew,sizeh,i,j);
            } else {
                drawRectOff(ctx,(i*sizew),(j*sizeh),sizew,sizeh,i,j);
            }
        }
    }
}

function onResize() {
    canvas.width = (window.innerWidth)*(0.9);
    canvas.height = (window.innerHeight)*(0.6);

    sizew = canvas.width/slotx;
    sizeh = canvas.height/sloty;

    onPaint(); 
}

function onTick() {

    function reproduce(a){
        a.currentTime = 0;
        a.play();
    }

    statereproduction = (statereproduction+1)%slotx;
    
    for (var i = 0; i < sloty; i++) {

        /*audio[i].pause();*/

        if(matrix[statereproduction][i]){
            reproduce(audio[i]);
        }
    }
    
    onPaint();
}

function blockoldaudio(){
    for (var i = 0; i < sloty; i++) {
        audio[i].pause();
    }
}

function PlayStop(){
    state = !state;
    onPaint();
    if(state){
        auxtimer = setInterval(onTick,interval);
    } else {
        clearInterval(auxtimer);
        blockoldaudio();
        statereproduction = slotx-1;
        onPaint();
    }        
}

function AddRemove(){
    mode = !mode;
}

function newSpeed(interv){
    interval = 300-interv;
        if(state){
            clearInterval(auxtimer);
            auxtimer = setInterval(onTick,interval);
        }
}

function PressGrid(evt){
    if (DnD) {
        var r = canvas.getBoundingClientRect();
        var x = parseInt((evt.clientX - r.left)/sizew);
        var y = parseInt((evt.clientY - r.top)/sizeh);
        matrix[x][y]=mode;
        onPaint();
    }
}

function PressToolBar(evt){
    var x = evt.clientX;

    if ((x>pointPlayStopX) && (x<pointPlayStopX+PlayStopWidth))
        PlayStop();

    if ((x>pointModeX) && (x<pointModeX+ModeWidth))
        AddRemove();
    
    if ((x>pointSpeedDownX) && (x<pointSpeedDownX+SpeedDownWidth) && (interval<350))
        interval = interval+25;
    
    if ((x>pointSpeedUpX) && (x<pointSpeedUpX+SpeedUpWidth) && (interval>50))
        interval = interval-25;
}

function newSetInstrument(x){
    for (var i = 0; i < sloty; i++) {
        audio[i] = document.createElement("audio");
        audio[i].src = "src/" + x + "/" + i + ".wav";
    }
}

function init(){
    canvas = document.getElementById('MusicCanvas');
    ctx = canvas.getContext('2d');

    state = false;
    slotx = 32;
    sloty = 13;

    var BottonPlayStop = document.getElementById('PlayStop');
    BottonPlayStop.onclick = function() {
        if (!state) {
            BottonPlayStop.innerHTML = iconstop;
            BottonPlayStop.style.background = '#db3236';
        } else {
            BottonPlayStop.innerHTML = iconplay;
            BottonPlayStop.style.background = '#3cba54';
        }
        PlayStop();
    }

    var BottonEdit = document.getElementById('Edit');
    BottonEdit.onclick = function() {
        if (!mode)
            BottonEdit.innerHTML = iconpencil;
        else
            BottonEdit.innerHTML = iconeraser;

        AddRemove();
    }

    var SpeedBar = document.getElementById('Speed');
    SpeedBar.onchange = function() {
        newSpeed(SpeedBar.value);
    }

    var SetInstrument = document.getElementById('SetInstrument');
    SetInstrument.onchange = function() {
        blockoldaudio();
        newSetInstrument(SetInstrument.value);
    }

    matrix = new Array(slotx);
    for (var i = 0; i < slotx; i++) {
        matrix[i] = new Array(sloty);
        for (var j = 0; j < sloty; j++) {
            matrix[i][j]=mode;
        }
    }

    audio = new Array(sloty);
    newSetInstrument(SetInstrument.value);
    
    DnD = false;
    mode = true;
    statereproduction = slotx-1;
    interval = 300 - (SpeedBar.value);
    changespeed = false;
    iconpencil = '<i class="fa fa-pencil"></i>';
    iconplay = '<i class="fa fa-play"></i>';
    iconeraser = '<i class="fa fa-eraser"></i>';
    iconstop = '<i class="fa fa-stop"></i>';
    
    colortopleft = [0,240,240];
    colortopmiddle = [0,240,0];
    colortopright = [240,240,0];
    colorbottomleft = [0,0,240];
    colorbottommiddle = [240,0,240];
    colorbottomright = [240,0,0];

    window.addEventListener('resize', onResize, true);

    window.addEventListener('mousedown', function(evt){DnD = true; PressGrid(evt)}, true);
    canvas.addEventListener('mousemove', function(evt){if(DnD)PressGrid(evt)}, true);
    window.addEventListener('mouseup', function(){DnD = false}, true);

    onResize();
}
