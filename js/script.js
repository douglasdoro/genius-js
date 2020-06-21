(() => {
    const btnPlay = document.querySelector('#btn-play');
    const gameContainer = document.querySelector('#game-panel');
    const levelInfo = document.querySelector("#level");

    let elementColors = [];
    let colorSequence = [];
    let colorPlayerSequence = [];
    let level = 0;

    loadElementsColor();
    loadRecord();

    btnPlay.addEventListener('click', () => {
        btnPlay.classList.add('hidden');
        play();
    });

    gameContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'DIV' &&
            colorSequence.length > 0) {
            addPlayerChoice(e.target.dataset.color);
            checkResult();
            animateColor(e.target.dataset.color, true);
        }
    });

    function loadElementsColor() {
        document.querySelectorAll(".btn-game")
        .forEach(el => {
            elementColors.push(el);
        });
    }

    function play() {
        let count = 0;
        let refreshId = setInterval(() => {

            if (!colorSequence.length) {
                addNewColorToSequence();
                clearInterval(refreshId);
                return;
            }

            if (colorSequence.length > count) {
                animateColor(colorSequence[count], true);
                count++;
                return;
            }

            if (colorSequence.length == level) {
                addNewColorToSequence();
                clearInterval(refreshId);
                //console.log(colorSequence);
            }
        }, 1000);
    }

    function addNewColorToSequence() {
        let color = getRadonColor();
        animateColor(color, true);
        colorSequence.push(color);
    }

    function checkResult() {
        if (colorPlayerSequence.length == colorSequence.length) {
            if (colorPlayerSequence.join('') === colorSequence.join('')) {
                level++;

                levelInfo.classList.remove('hidden');
                levelInfo.querySelector('span').textContent = level;

                setRecord(level);

                colorPlayerSequence = [];
                win();
                play();
            } else {
                level = 0;
                clearSequences();
                levelInfo.classList.add('hidden');
                btnPlay.classList.remove('hidden');

                closingAnimation();


            }
        }
    }

    function addPlayerChoice(color) {
        colorPlayerSequence.push(color);
    }

    function clearSequences() {
        colorSequence = [];
        colorPlayerSequence = [];
    }

    function getRadonColor() {
        let element = elementColors[Math.floor(Math.random() * elementColors.length)];
        return element.dataset.color;

    }

    function animateColor(color, play) {
        if (play) {
            let audio = document.querySelector(`#audio-${color}`);
            audio.play();
        }

        let htmlEl = elementColors.find(e => e.dataset.color == color);

        htmlEl.classList.add('fadeIn');

        setTimeout(() => {
            htmlEl.classList.remove('fadeIn');
        }, 500);
    }

    function closingAnimation() {
        let audio = document.querySelector("#audio-lose");
        audio.play();

        let count = 0;
        let timesRun = 0;
        let refreshId = setInterval(() => {
            animateColor(elementColors[count].dataset.color, false);

            if (count == elementColors.length - 1) {
                count = 0;
            } else {
                count++;
            }

            if (timesRun == 7) {
                clearInterval(refreshId);
            }
            timesRun++;
        }, 300);
    }

    function win() {
        for (i = 0; i < elementColors.length; i++) {
            animateColor(elementColors[i].dataset.color, false);
        }
    }

    function loadRecord() {
        if (localStorage.getItem("record") != null) {
            document.querySelector("#record")
                .innerText = localStorage.record;
        } else {
            document.querySelector("#record")
                .innerText = 0;
        }
    }

    function setRecord(newRecord) {
        if (localStorage.getItem("record") == null)
            localStorage.setItem("record", 0);

        let actualRecord = parseInt(localStorage.record);

        if (newRecord > actualRecord) {
            localStorage.setItem("record", newRecord);
            loadRecord();
        }
    }

})();