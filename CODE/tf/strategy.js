function cloneObject(obj){
    if (obj === null){
        return null; 
    }
    var o = obj.constructor === Array ? [] : {};
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
        }
    }
    return o;
}
function turn(car, o) {
    var _car = cloneObject(car);
    if(o == 'left') {
	_car.row -- ;
    } else {
	_car.row ++ ;
    }
    return _car;
}

function safe(a, b) {
    var ba = 1 << a.row;
    var bb = 1 << b.row;
    if(a.o == 'left') {
	ba |= 1 << (a.row - 1);
    } else if(a.o == 'right'){
	ba |= 1 << (a.row + 1);
    }
    if(b.o == 'left') {
	bb |= 1 << (b.row - 1);
    } else if(b.o == 'right'){
	bb |= 1 << (b.row + 1);
    }
    if((ba & bb) > 0) {
	if(a.x > b.x) {
	    if(a.speed > b.speed) {
		return 1; // ahead and faster
	    } else {
		if(a.x - backWarningRatio * Math.exp( - a.speed) - a.len * 1.3 < b.x + b.speed * frontWarningRatio) {
		    if(a.maxSpeed > b.maxSpeed) {
			return 2; // prior
		    } else {
			return 1.5; // should give place
		    }
		} else {
		    return 1; // too far
		}
	    }
	} else {
	    if(a.speed < b.speed) {
		return 1; // behind and slower
	    } else {
		if(a.x + a.speed * frontWarningRatio > b.x - backWarningRatio * Math.exp( - b.speed) - b.len * 1.3) {
		    if(a.maxSpeed > b.maxSpeed) {
			return 0.5; // prior
		    } else {
			return 0; // should give place
		    }
		} else {
		    return 1; // too for
		}
	    }
	}
    } else {
	return 1; // no conflict
    }
}

function strategyNon(car, carList){
    car.x += car.speed;
    car.speed = Math.min(car.maxSpeed, Math.max(car.speed, 0.1) * accelerateRatio);
}

function strategyWait(car, carList) {
    var flag = 0;
    for(var x in carList) {
	if(car != carList[x]) {
	    var safeStatus = safe(car, carList[x]);
	    if(safeStatus < 1) {
		flag = 1;
	    }
	}
    }
    if(flag == 1) {
	car.speed = Math.max(0, car.speed - car.maxSpeed / brakeRatio);
    } else {
	car.speed = Math.min(car.maxSpeed, car.speed + car.maxSpeed / accelerateRatio);
    }
}

function strategyA(car, carList){
    var flag = 0;
    for(var x in carList) {
	if(car != carList[x]) {
	    var safeStatus = safe(car, carList[x]);
	    if(safeStatus < 1) {
		flag = 1;
	    }
	}
    }
    if(flag == 1) {
	var _flag = 0;
	if(car.row == 0) {
	    _flag = 1;
	}
	for(var x in carList) {
	    if(car != carList[x]) {
		var safeStatus = safe(turn(car, 'left'), carList[x]);
		if(safeStatus < 1) {
		    _flag = 1;
		}
	    }
	}
	if(_flag == 1) {
	    var __flag = 0;
	    if(car.row == maxRow - 1) {
		__flag = 1;
	    }
	    for(var x in carList) {
		if(car != carList[x]) {
		    var safeStatus = safe(turn(car, 'right'), carList[x]);
		    if(safeStatus < 1) {
			__flag = 1;
		    }
		}
	    }
	    if(__flag == 1) {
		car.speed = Math.max(0, car.speed - car.maxSpeed / brakeRatio);
	    } else {
		car.o = 'right';
		car.offset = 3.5;
		_log('turn right');
		//turn right
	    }
	} else {
	    car.o = 'left';
	    car.offset = 3.5;
	    _log('turn left');
	    //turn left
	}
    } else {
	car.speed = Math.min(car.maxSpeed, car.speed + car.maxSpeed / accelerateRatio);
    }
}

function strategyB(car, row) {
}
