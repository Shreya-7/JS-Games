document.addEventListener('DOMContentLoaded', () => {
    setUpGrid();

    const squares = document.querySelectorAll('.grid div');
    const timeLeft = document.getElementById('time-left');
    const result = document.getElementById('result');
    const startBtn = document.getElementById('button');

    const width = 9;
    let currentIndex = 76;
    let currentTime = 20;
    let timerId;
    let paused = true;

    squares[currentIndex].classList.add('frog');

    function moveCars() {

        const carClassMap = {
            'car': {
                'right': 'road-2',
                'left': 'road-1'
            },
            'road-1': {
                'right': 'car',
                'left': 'road-2'
            },
            'road-2': {
                'right': 'road-1',
                'left': 'car'
            }
        };
        let carsLeft = document.querySelectorAll('.car-left');
        let carsRight = document.querySelectorAll('.car-right');

        carsLeft.forEach(carLeft => {
            for (className in carClassMap) {
                if (carLeft.classList.contains(className)) {
                    carLeft.classList.remove(className);
                    carLeft.classList.add(carClassMap[className]['left']);
                    break;
                }
            }
        });
        carsRight.forEach(carRight => {
            for (className in carClassMap) {
                if (carRight.classList.contains(className)) {
                    carRight.classList.remove(className);
                    carRight.classList.add(carClassMap[className]['right']);
                    break;
                }
            }
        });
    }

    function moveLogs() {

        const logClassMap = {
            'log-1': {
                'right': 'river-2',
                'left': 'log-2'
            },
            'log-2': {
                'right': 'log-1',
                'left': 'log-3'
            },
            'log-3': {
                'right': 'log-2',
                'left': 'river-1'
            },
            'river-1': {
                'right': 'log-3',
                'left': 'river-2'
            },
            'river-2': {
                'right': 'river-1',
                'left': 'log-1'
            }
        };
        let logsLeft = document.querySelectorAll('.log-left');
        let logsRight = document.querySelectorAll('.log-right');

        logsLeft.forEach(logLeft => {
            for (className in logClassMap) {
                if (logLeft.classList.contains(className)) {
                    logLeft.classList.remove(className);
                    logLeft.classList.add(logClassMap[className]['left']);
                    break;
                }
            }
        });
        logsRight.forEach(logRight => {
            for (className in logClassMap) {
                if (logRight.classList.contains(className)) {
                    logRight.classList.remove(className);
                    logRight.classList.add(logClassMap[className]['right']);
                    break;
                }
            }
        });
    }

    function moveFrog(e) {
        squares[currentIndex].classList.remove('frog');
        switch (e.keyCode) {
            case 37:
                if (currentIndex % width !== 0) currentIndex -= 1;
                break;
            case 38:
                if (currentIndex - width >= 0) currentIndex -= width;
                break;
            case 39:
                if (currentIndex % width < (width - 1)) currentIndex += 1;
                break;
            case 40:
                if (currentIndex + width > width * width) currentIndex += width;
                break;
        }
        squares[currentIndex].classList.add('frog');
        // check the status of the game after moving the frog
        lose();
        win();
    }

    function moveFrogOnLog() {
        if (currentIndex >= 27 && currentIndex <= 35) {
            squares[currentIndex].classList.remove('frog');
            squares[--currentIndex].classList.add('frog');
        }
        if (currentIndex >= 18 && currentIndex <= 26) {
            squares[currentIndex].classList.remove('frog');
            squares[++currentIndex].classList.add('frog');
        }
    }

    function win() {
        if (squares[4].classList.contains('frog')) {
            result.innerHTML = "YOU WON!!!";
            cleanUp();
        }
    }

    function lose() {
        const loserClasses = ['car', 'river-1', 'river-2'];
        let flag = false;
        loserClasses.forEach(loserClass => flag = flag | squares[currentIndex].classList.contains(loserClass));

        if (currentTime == 0 || flag) {
            result.innerHTML = "YOU LOSE :(";
            cleanUp();
        }
    }

    function allMove() {
        currentTime--;
        timeLeft.textContent = currentTime;
        moveLogs();
        moveCars();
        moveFrogOnLog();

        // added here only because on the movement of any of the above pieces, the frog can die.
        lose();
    }

    function setUpGrid() {
        let grid = document.querySelector('.grid');
        const logClasses = ['log-1', 'log-2', 'log-3', 'river-1', 'river-2'];
        const carClasses = ['car', 'road-1', 'road-2'];
        let logCount = 0;
        let carCount = 0;

        for (let i = 1; i <= 81; i++) {
            let div = document.createElement('div');
            if (i == 5) {
                div.classList.add('ending-block');
            }
            if (i == 77) {
                div.classList.add('starting-block');
            }

            // create the logs
            if (i >= 19 && i <= 36) {
                if (logCount >= 9) {
                    div.classList.add('log-right');
                    if (logCount == 9) {
                        logCount = 4;
                    }
                }
                else {
                    div.classList.add('log-left');
                }
                div.classList.add(logClasses[logCount % 5]);
                logCount++;
            }

            // create the car & roads
            if (i >= 46 && i <= 63) {
                if (carCount >= 9) {
                    div.classList.add('car-left');
                }
                else {
                    div.classList.add('car-right');
                }
                const carClass = carClasses[carCount % 3];
                div.classList.add(carClass);
                carCount++;
            }

            grid.appendChild(div);
        }
    }

    function cleanUp() {
        // reposition the frog
        squares[currentIndex].classList.remove('frog');
        currentIndex = 76;
        squares[currentIndex].classList.add('frog');

        // reset the time
        currentTime = 20;
        paused = true;
        clearInterval(timerId);

        // reset the display text
        startBtn.innerHTML = "Start";

        // disable frog movement
        document.removeEventListener('keyup', moveFrog);
    }

    startBtn.addEventListener('click', () => {
        if (!paused) {
            startBtn.innerHTML = "Start";
            paused = true;
            clearInterval(timerId);
            document.removeEventListener('keyup', moveFrog);
        }
        else {
            result.innerHTML = "";
            startBtn.innerHTML = "Pause";
            timerId = setInterval(allMove, 1000);
            paused = false;
            document.addEventListener('keyup', moveFrog);
        }
    })

});