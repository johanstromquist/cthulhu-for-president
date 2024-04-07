// Set the target date and time for the countdown (when the Kickstarter closes)
var targetDate = new Date("2024-04-21T23:59:59").getTime();

// Update the countdown every second
var countdownTimer = setInterval(function() {
    // Get the current date and time
    var now = new Date().getTime();

    // Calculate the remaining time
    var remainingTime = targetDate - now;

    // Calculate days, hours, minutes, and seconds
    var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Display the countdown timer
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

    // If the countdown is finished, hide the countdown container
    if (remainingTime < 0) {
        clearInterval(countdownTimer);
        document.querySelector(".countdown-container").classList.add("hidden");
    }
}, 1000);