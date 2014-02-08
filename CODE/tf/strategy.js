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
function turn(car,o) {
    var _car = cloneObject(car);
    _car.o = o;
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
		return 1; //
	    } else {
		if(a.x - a.speed * backWarningRatio - a.len * 1.3 < b.x + b.speed * frontWarningRatio) {
		    if(a.maxSpeed > b.maxSpeed) {
			return 1; // 
		    } else {
			return 1; // 
		    }
		} else {
		    return 1; //
		}
	    }
	} else {
	    if(a.speed < b.speed) {
		return 1; //
	    } else {
		if(a.x + a.speed * frontWarningRatio > b.x - b.speed * backWarningRatio - b.len * 1.3) {
		    if(a.maxSpeed > b.maxSpeed) {
			return 0; //
		    } else {
			return 0; //
		    }
		} else {
		    return 1; //
		}
	    }
	}
    }
    return 1; // 根本不着边
}

function strategyNon(car, carList){
    car.x += car.speed;
    car.speed = Math.min(car.maxSpeed, Math.max(car.speed, 0.1) * accelerateRatio);
}

function strategyWait(car, carList){
    var flag = 0;
    for(var x in carList) {
	/*if(car!=carList[x]) {
	    if(car.row == carList[x].row) {
		if(car.x + car.speed * accelerateRatio + carList[x].len * 1.5 > carList[x].x - carList[x].speed * backWarningRatio && car.x < carList[x].x) {
		    flag = 1;
		    break;
		}
	    }
	}*/
	if(car != carList[x] && safe(car, carList[x]) == 0) {
	    flag = 1;
	}
    }
    if(flag == 1) {
	car.speed = car.speed * brakeRatio;
    } else {
	car.speed = Math.min(car.maxSpeed, Math.max(car.speed, 0.1) * accelerateRatio);
    }
    car.x += car.speed;
}

function strategyA(car, carList) {
    car.x += car.speed;
}

function strategyB(car, row) {
}
