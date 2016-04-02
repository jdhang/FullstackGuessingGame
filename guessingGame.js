/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.
$(document).ready(function () {

  var playersGuess, // stores the Player's guess
  winningNumber = generateWinningNumber(), // generate a winning number
  prevGuesses = [], // array to store the previous guesses
  NUM_GUESSES = 5, // Max number of guesses a Player has
  remainingGuesses = NUM_GUESSES // Initialize the number of guesses a Player has left

  /* **** Guessing Game Functions **** */

  // Generate the Winning Number

  function generateWinningNumber(){
    return Math.floor(Math.random() * (101 - 1)) + 1
  }

  // Fetch the Players Guess

  function playersGuessSubmission(e){
    if (e.keyCode == 13 || e.type == "click") {
      e.preventDefault()
      playersGuess = parseInt($('#guess').val())
      $('#guess').val('')
      checkGuess()
    }
  }

  // Determine if the next guess should be a lower or higher number

  function lowerOrHigher(){
    if(playersGuess > winningNumber) {
      return "higher"
    } else if (playersGuess < winningNumber) {
      return "lower"
    } else {
      return "correct"
    }
  }

  // Determine if the next guess should be within X digits (as multiple of 5)

  function howFar() {
    return Math.ceil(Math.abs(playersGuess - winningNumber) / 5) * 5
  }

  // Check if the Player's Guess is valid and/or the winning number

  function checkGuess(){
    if(isGuessValid(playersGuess)) {
      addGuess(playersGuess)
      addToGuessTable(playersGuess, prevGuesses.length)
      if (correctGuess(playersGuess)) {
        disableButtons()
        notify(playersGuess + ' is the correct number!', 'correct')
      } else if (noMoreGuesses()) {
        disableButtons()
        notify('Game Over! No More Guesses!', 'incorrect')
      } else {
        notify(guessMessage() + ' Try Again!', 'incorrect')
      }
    }
  }

  // Checks to see if the Guess is a number, within the 1-100 range and not a
  // duplicate

  function isGuessValid (guess) {
    if(isNaN(guess)) {
      notify('Invalid Guess! Guess Again!', 'incorrect')
    } else if (guess > 100 || guess < 1) {
      notify('Out of Range Guess! Guess Again!', 'incorrect')
    } else if (prevGuesses.indexOf(guess) !== -1) {
        notify('Duplicate Guess!', 'incorrect')
    } else {
      return true
    }
    return false
  }

  // Adds the latest guess to an array of previous guesses
  function addGuess (guess) {
    prevGuesses.push(guess)
    remainingGuesses = parseInt(NUM_GUESSES - prevGuesses.length)
  }

  // Adds the latest guess to an HTML Guess table
  // Adds the direction of the latest guess to an HTML Guess table
  // Adds the distance of the latest guess to an HTML Guess table

  function addToGuessTable (guess, index) {
    $('#' + index + '_guess').html(guess)
    $('#' + index + '_dir').html(lowerOrHigher())
    $('#' + index + '_dist').html(howFar())
  }

  // Disables the submit and hint buttons

  function disableButtons () {
    $('#submit').prop('disabled', true)
    $('#hint').prop('disabled', true)
  }

  // Enables the submit and hint buttons

  function enableButtons () {
    $('#submit').prop('disabled', false)
    $('#hint').prop('disabled', false)
  }


  // Create a provide hint button that provides additional clues to the "Player"

  function provideHint(){
    if(remainingGuesses > 1) {
      var hints = []

      for(var i = 0; i < (remainingGuesses * 2) - 1; i++) {
        var hint = generateWinningNumber()
        while (hint === winningNumber || hints.indexOf(hint) !== -1) {
          hint = generateWinningNumber()
        }
        hints.push(hint)
      }
      hints.push(winningNumber)
      $('.hint-area').html('<h2 class="incorrect">Hints: [' + shuffle(hints).join(', ') + ']</h2>')
    } else {
      notify('It\'s your last guess! Can\'t give you the answer!', 'incorrect')
      $('#hint').prop('disabled', true)
    }
  }

  // Allow the "Player" to Play Again

  function playAgain(){
    winningNumber = generateWinningNumber()
    prevGuesses = []
    remainingGuesses = NUM_GUESSES
    $('.notification-area').html('<h1>.</h1>').css('visibility', 'hidden')
    $('.hint-area').html('<h1></h1>')
    enableButtons()
    clearGuessTable()
  }

  // Let the Player know if their guess was too high or low

  function guessMessage () {
    return "Your guess is " + lowerOrHigher() + " and within " + howFar() + " of the winning number."
  }

  // Populate notification area and makes it visible

  function notify (message, klass = ' ') {
    $('.notification-area').css('visibility','visible')
    $('.notification-area').html('<h2 class=' + klass + '>' + message + '</h2>')
  }

  // Checks if the guess is the correct number

  function correctGuess (guess) {
    return guess === winningNumber
  }

  // Checks if the Player has anymore guesses

  function noMoreGuesses () {
    return remainingGuesses <= 0
  }

  // Shuffle the hints array
  // source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length, tempValue, randomIndex

    // while there are still elements to shuffle
    while (0 !== currentIndex) {

      // pick a random element in the array
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1; // reduce number of elements in array to check

      // swap it with the current element
      tempValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = tempValue
    }

    // return shuffled array
    return array;
  }

  // Resets and empties the HTML Guess table of its values from the previous
  // game

  function clearGuessTable () {
    for(var i = 1; i < NUM_GUESSES + 1; i++) {
      $('#' + i + '_guess').html('-')
      $('#' + i + '_dir').html('-')
      $('#' + i + '_dist').html('-')
    }
  }

  /* **** Event Listeners/Handlers ****  */

  // Event listener on the ENTER key for the Player Guess Input
  $('#guess-form').on('keypress', playersGuessSubmission)

  // Event listener on the SUBMIT button for the Player Guess Input
  $('#submit').on('click', playersGuessSubmission)

  // Event listener on the HINT button for the Player requesting help
  $('#hint').on('click', provideHint)

  // Event listener on the PLAY AGAIN button for the Player to start a new game
  $('#playAgain').on('click', playAgain)
})
