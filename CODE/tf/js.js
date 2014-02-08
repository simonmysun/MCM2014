maxRow = 4;
frontWarningRatio = 5.0;
backWarningRatio = 0.3;
brakeRatio = 0.8;
accelerateRatio = 1.2;
test = 1;
stop = 0;

ticks = 0;
cars = 0;
totTicks = 0;
currentCars = 0;

var letThereBeState = function() {
    var s = {};
    s.row = [];
    s.distribution = [];
    s.init = function() {
	s.carList = [];
	s.row = [];
	for(var x = 0; x < maxRow; x ++ ) {
	    s.row[x] = [];
	}
    };
    s.carList = [];
    s.newCar = function(r) {
	var car = {};
	car.len = 150 + Math.random() * 100;
	car.maxSpeed = Math.floor(20 + Math.random() * 130);
	car.speed = 1;
	car.row = r;
	car.startTicks = ticks;
	car.x = 0;
	car.o = 'streight';
	car.offset = 0;
	s.carList.push(car);
	s.row[car.row].push(car);
    };
    s.determine = function(callback) {
	for(var k in s.carList) {
	    var car = s.carList[k];
	    if(car.x > 10000) {
		totTicks += ticks - car.startTicks;
		cars ++ ;
		currentCars --;
		delete s.carList[k];
		continue;
	    }
	    if(car.offset < 0) {
		if(car.o == 'left') {
		    car.row -- ;
		} else {
		    car.row ++ ;
		}
		car.o = 'streight';
	    }
	    if(car.offset > 0) {
		car.offset -- ;
	    }
	    //strategyNon(car, s.carList);
	    strategyWait(car, s.carList);
	    //strategyA(car, s.carList);
	    //strategyB(car, s.carList);
	    //strategyC(car, s.carList);
	}
	callback();
    }
    s.refresh = function(callback) {
	for(var r = 0; r < maxRow; r ++ ) {
	    var flag = 0;
	    for(var c in s.row[r]) {
		if(s.row[r][c].x < s.row[r][c].len + s.row[r][c].maxSpeed * 1.8) {
		    flag = 1;
		}
	    }
	    if(flag == 0) {
		if(Math.random() < 0.1) {
		    s.newCar(r);
		    currentCars ++ ;
		}
	    }
	}
	s.determine(callback);
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
    console.log(m);
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
	ctx.lineTo(x - car.len / 10.0, y);
	ctx.lineTo(x, y + 5);
	ctx.lineTo(x, y);
	ctx.lineTo(x - car.len / 10.0, y + 5);
	ctx.lineTo(x, y + 5);
	ctx.fill();
    } else if(o == 'left') {
	y = y - 10 - car.len / 10.0 / 2.0;
	var l = car.len / 10.0 / Math.sqrt(2.0);
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
    if(test == 1) {
	console.log("tick");
    }
    ticks ++ ;
    currentState.refresh(function() {
	if(test == 1) {
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
    });
    var timeout = 0;
    if(test == 1) {
	timeout = 25;
    } else {
	timeout = 0;
    }
    setTimeout(idle, timeout);
}

function toMessage(key, value) {
    return '<div class="message">' + key + ': ' + value + '</div>';
}

function watch() {
    var html = '';
    html = html.concat(toMessage('Start ticks', ticks));
    html = html.concat(toMessage('Vehicles passed', cars));
    html = html.concat(toMessage('Total ticks', totTicks));
    html = html.concat(toMessage('Average ticks', Math.floor(totTicks / cars)));
    html = html.concat(toMessage('Current cars',currentCars));
    //html = html.concat(toMessage('',));
    $('#log').html(html);
}

window.onload = function() {
    $(document).ready(function() {
	canvas = $('#c')[0];
	currentState = letThereBeState();
	currentState.init();
	$('#toggle').click(function() {
	    if(test == 1) {
		test = 0;
	    } else {
		test = 1;
	    }
	});
	idle();
	setInterval(watch, 500);
    });
}