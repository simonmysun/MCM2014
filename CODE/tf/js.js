 mvar letThereBeState = function() {
    var s = {};
    s.row = [];
    s.distribution = [];
    s.init = function() {
	s.row = [];
	for(var x = 0; x < 5; x ++ ) {
	    s.row[x] = [];
	}
    };
    s.carList = [];
    s.newCar = function(r) {
	var car = {};
	car.len = 15 + Math.random() * 10;
	car.maxSpeed = Math.floor(50 + Math.random() * 100);
	car.speed = car.maxSpeed;
	car.row = r;
	car.startTime = new Date();
	car.x = 0;
	car.o = 'streight';
	s.carList.push(car);
    };
    s.determine = function() {
	for(var x in s.carList) {
	    if(s.carList[x].x > 10000) {
		delete s.carList[x];
		continue;
	    }
	    s.carList[x].x += s.carList[x].speed;
	}
    }
    s.refresh = function() {
	s.init();
	for(var k in s.carList) {
	    if(s.carList[k] != "undefined") {
		var l = s.carList[k].x - 100;
		l = l > 0 ? l : 0;
		var r = s.carList[k].x + s.carList[k].speed * 1.5;
		var o = s.carList[k].o;
		var y = s.carList[k].row
		for(var x = l; x <= r; x ++) {
		    if(o == 'left') {
			s.row[y][x - 1] = 1;
			s.row[y][x] = 1;
		    } else if(o == 'right') {
			s.row[y][x] = 1;
			s.row[y][x + 1] = 1;
		    } else {
			s.row[y][x] = 1;
		    }
		}
	    }
	}
	for(var r = 0; r < 5; r ++ ) {
	    if(s.row[r][0] != 1) {
		if(Math.random() < 0.05) {
		    s.newCar(r);
		}
	    }
	}
    };
    return s;
}

function drawDashedLine(ctx, x1, y1, x2, y2, dashLength) {  
    dashLengthdashLength = dashLength === undefined ? 5 :dashLength;
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
    for (var i = 0; i < numDashes; i ++ ) {
	ctx[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1 + (deltaX / numDashes) * i, y1 +(deltaY / numDashes) * i);
    }
    ctx.stroke();
};

function _log(m) {
    console.log("m");
    $('#log').append('<p>' + m.toString +'</p>');
}

function drawCar(ctx, car, row, x, o, s) {
    if(s == 0) {
	ctx.strokeStyle = '#7f7';
    } else {
	ctx.strokeStyle = '#f77';
    }
    var y = 10 + (row * 25);
    x = x / 10.0;
    var o = car.o;
    if(o == 'streight') {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - car.len, y);
	ctx.lineTo(x, y + 5);
	ctx.lineTo(x, y);
	ctx.lineTo(x - car.len, y + 5);
	ctx.lineTo(x, y + 5);
	ctx.fill();
    } else if(o == 'left') {
	y = y - 10 - car.len / 2.0;
	var l = car.len / Math.sqrt(2.0);
	var w = 5 / Math.sqrt(2.0);
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - l, y + l);
	ctx.lineTo(x + w, y + w);
	ctx.lineTo(x, y);
	ctx.lineTo(x - l + w, y + l + w);
	ctx.lineTo(x + w, y + w);
	ctx.fill();
    } else {
	y = y + 15 + car.len / 2.0;
	var l = car.len / Math.sqrt(2.0);
	var w = 5 / Math.sqrt(2.0);
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - l, y - l);
	ctx.lineTo(x + w, y - w);
	ctx.lineTo(x, y);
	ctx.lineTo(x - l + w, y - l - w);
	ctx.lineTo(x + w, y - w);
	ctx.fill();
    }
    ctx.stroke();
}

function idle() {
    currentState.refresh();
    currentState.determine();
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1000, 200);
    ctx.fillStyle = "#336";
    ctx.fillRect(0, 0, 1000, 200);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#eed';
    drawDashedLine(ctx, 0, 25, 1000, 25, 15);
    drawDashedLine(ctx, -15, 50, 1015, 50, 15);
    drawDashedLine(ctx, 0, 75, 1000, 75, 15);
    for(var c in currentState.carList) {
	var car = currentState.carList[c];
	drawCar(ctx, car, car.row, car.x, car.o, car.speed - car.maxSpeed);
    }
}

window.onload = function() {
    $(document).ready(function() {
	canvas = $('#c')[0];
	currentState = letThereBeState();
	setInterval(idle,10);
    });
}
