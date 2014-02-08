function collision(a, b) {
    
}

function strategyNon(car, carList){
    car.x += car.speed;
    car.speed = Math.min(car.maxSpeed, Math.max(car.speed, 0.1) * accelerateRatio);
}

function strategyWait(car, carList){
    var flag = 0;
    for(var x in carList) {
	if(car!=carList[x]) {
	    if(car.row == carList[x].row) {
		if(car.x + car.speed * accelerateRatio + carList[x].len * 1.3 > carList[x].x - carList[x].speed * backWarningRatio && car.x < carList[x].x) {
		    flag = 1;
		    break;
		}
	    }
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
    var flag = 0;
    for(var x in carList) {
	if(car != carList[x]) {
	    if(carList[x].o == 'left') {
		if(car.o == 'left') {
		    if(car.row - 1 <= carList[x].row || car.row >= carList[x].row - 1) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		} else if(car.o == 'right') {
		    if(car.row <= carList[x].row || car.row + 1 >= carList[x].row - 1) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		} else {
		    if(car.row == carList[x].row || car.row == carList.row - 1) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		}
	    } else if(carList[x].o == 'right') {
		if(car.o == 'left') {
		    if(car.row - 1 <= carList[x].row + 1 || car.row >= carList[x].row) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		} else if(car.o == 'right') {
		    if(car.row <= carList[x].row + 1 || car.row + 1 >= carList[x].row) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		} else {
		    if(car.row == carList[x].row || car.row == carList.row + 1) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		}
	    } else {
		if(car.o == 'left') {
		    if(car.row - 1 == carList[x].row || car.row == carList[x].row) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		} else if(car.o == 'right') {
		    if(car.row + 1 == carList[x].row || car.row == carList[x].row) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		} else {
		    if(car.row == carList[x].row) {
			if(carList[x].x < car.x + car.speed * 1.5) {
			    flag = 1;
			    break;
			}
		    }
		}
	    }
	}
    }
    if(flag == 1) {
	//_log("meet: " + car.row + ', ' + car.x);
	car.speed *= 0.8;
    } else {
	car.speed = Math.min(car.maxSpeed, car.speed * 1.1);
    }
    car.x += car.speed;
}

function strategyB(car, row) {
    var flag = 0;
    for(var x = car.x; flag == 0 && x <= Math.min(100000, car.x + car.speed * 1.5); x ++ ) {
	if(s.row[x][car.row] == 1) {
	    flag = 1;
	}
    }
    if(flag == 1) {
	var _flag = 0;
	for(var x = car.x; _flag == 0 && x <= Math.min(100000, car.x + car.speed * 1.5); x ++ ) {
	    if(s.row[x - 1][car.row] == 1) {
		_flag = 1;
	    }
	}
	if(_flag == 1) {
	    var __flag = 0;
	    for(var x = car.x; __flag == 0 && x <= Math.min(100000, car.x + car.speed * 1.5); x ++ ) {
		if(s.row[x + 1][car.row] == 1) {
		    __flag = 1;
		}
	    }
	}
    }
}
