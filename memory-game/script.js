document.addEventListener('DOMContentLoaded',()=>{

    // generate cards

    const imageFiles = ['angular.png', 'react.png', 'vue.png', 'aurelia.png', 'passport.png', 'backbone.png'];
    const pairs = imageFiles.length;

    const parentDiv = document.getElementById('game');

    // image element for the JS badge - the back side of every card
    var badgeImg = document.createElement('img');
    badgeImg.src = `images/js.png`;
    badgeImg.classList.add('back');

    for(var i=0; i<pairs; i++) {

        // container element for each card - contains two images
        var div = document.createElement('div');
        div.classList.add('card');

        // attach pair recogniser ID
        div.dataset.pair = i;

        var frontImg = document.createElement('img');
        frontImg.src = `images/${imageFiles[i]}`;
        frontImg.classList.add('front');

        div.appendChild(frontImg);
        div.appendChild(badgeImg.cloneNode(true));
        parentDiv.appendChild(div.cloneNode(true));
        parentDiv.appendChild(div.cloneNode(true));
    }

    document.querySelectorAll('.card').forEach(card=>{

        // attach event listener
        card.addEventListener('click', flipCard);
        
        // assign random order for shuffle
        card.style.order = Math.floor(Math.random() * 12);
    });
});

var hasFlipped = false;
var locked = false; // whether cards can be flipped or not
var first, second; // flipped cards

function resetBoard() {
    locked = false;
    hasFlipped = false;
    first = null;
    second = null;
}

// check if flipped cards match, take apt action & reset board

function checkForMatch() {

    if(first.dataset.pair === second.dataset.pair) {

        // remove listeners so they are out of play
        first.removeEventListener('click', flipCard);
        second.removeEventListener('click', flipCard);

        resetBoard();
    }
    else {

        // disable card clicking in between wrong pair selection and board reset
        locked = true;

        setTimeout(()=>{

            // flip back the cards after a short delay
            first.classList.remove('flip');
            second.classList.remove('flip');

            resetBoard();
        }, 1500);
    }
}

// flip a card

function flipCard() {

    // if card flipping is allowed
    if(!locked) {

        // flip the card
        this.classList.add('flip');

        // if this is the first card to be flipped
        if(!hasFlipped) {
            hasFlipped = true;
            first = this;
        }

        // if a card has already been flipped
        else if(this != first) {
            hasFlipped = false;
            second = this;
            checkForMatch();
        }
    }    
}
