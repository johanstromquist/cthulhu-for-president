// Get the backend based on window host
const backend = window.location.hostname  ? 'https://johnmion.pythonanywhere.com' : 'http://127.0.0.1:5000';

// Get the wheel container and result elements
const wheelContainer = document.getElementById('wheel-container');
const resultNumber = document.getElementById('result-number');
const resultAnswer = document.getElementById('result-answer');
const resultKey = document.getElementById('result-key');

// Create the canvas element
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 500;
canvas.height = 500;

// Append the canvas to the wheel container
wheelContainer.appendChild(canvas);

// Define the wheel properties
const segments = 100;
const segmentAngle = (2 * Math.PI) / segments;
const wheelRadius = 240;
const colors = ['#1c3b5a', '#3a6893', '#4b5320', '#6c7a2e', '#aaddaa', '#eeffee'];

// Function to draw the wheel
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < segments; i++) {
    const angle = i * segmentAngle;
    const color = colors[i % colors.length];
    
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, wheelRadius, angle, angle + segmentAngle);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

let isSpinning = false;
// Function to spin the wheel
function spinWheel() {
    if (isSpinning) {
        return; // Prevent multiple spins while the wheel is already spinning
    }
    
    // Disable the spin button
    spinButton.disabled = true;

    const spins = Math.floor(Math.random() * 5) + 5; // Random number of spins (between 5 and 10)
    const degrees = Math.floor(Math.random() * 360); // Random degree to stop at
    const segmentIndex = Math.floor((degrees % 360) / (360 / segments)) + 1;
  
    let currentRotation = 0;
    let responseReceived = false;
    let slowDownStarted = false;
    let fullSpeedStartTime = Date.now();
    let slowDownAnimationId;
    let celebratoryEffectDisplayed = false;
    const fullSpeedDuration = 3000; // 3 seconds for full speed spin
  
    const spinAnimation = setInterval(() => {
      const elapsedTime = Date.now() - fullSpeedStartTime;
  
      if (elapsedTime < fullSpeedDuration) {
        currentRotation += 10; // Spin at full speed for the first 3 seconds
      } else if (!responseReceived) {
        currentRotation += 10; // Continue spinning at full speed until response is received
      } else if (!slowDownStarted) {
        slowDownStarted = true;
        const slowDownStart = Date.now();
        const slowDownDuration = 2000; // 2 seconds for slow-down effect
  
        slowDownAnimationId = setInterval(() => {
          const elapsedTime = Date.now() - slowDownStart;
          const progress = elapsedTime / slowDownDuration;
  
          if (progress >= 1) {
            clearInterval(slowDownAnimationId);
            clearInterval(spinAnimation);
  
            const resultQuestion = document.getElementById('resultQuestion');
            const resultAnswer = document.getElementById('resultAnswer');
  
            resultQuestion.textContent = question;
            resultAnswer.innerHTML = answer;

            // Check if the spin is 0 or 99
            if (spin === 0 || spin === 99 && !celebratoryEffectDisplayed) {
                celebratoryEffectDisplayed = true;
                // Display celebratory effect
                displayCelebratoryEffect();

                // Show email input for claiming reward
                showEmailInput();
            }

            // Re-enable the spin button after the animation is finished
            spinButton.disabled = false;

          } else {
            currentRotation += 10 * (1 - progress); // Gradually reduce rotation speed
          }
  
          canvas.style.transform = `rotate(${currentRotation}deg)`;
        }, 20);
      }
  
      canvas.style.transform = `rotate(${currentRotation}deg)`;
    }, 20);
  
    // Make a request to the backend API to get the result
    console.info(spinBackend = backend+"/spin");
    fetch(backend+'/spin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ segment: segmentIndex }),
    })
      .then(response => response.json())
      .then(data => {
        question = data.question;
        answer = data.answer.replace(/\n/g, '<BR/>');
        key = data.key;
        spin = data.spin; // Store the spin value

        responseReceived = true;
      })
      .catch(error => {
        console.error('Error:', error);
        // Re-enable the spin button in case of an error
        spinButton.disabled = false;        
      });
  }

// Function to display celebratory effect
function displayCelebratoryEffect() {
    const celebrationMessage = document.createElement('div');
    celebrationMessage.textContent = 'Congratulations! You won a reward!';
    celebrationMessage.classList.add('celebratory-message');
    document.body.appendChild(celebrationMessage);

    // Create a canvas element for the fireworks effect
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Firework class
    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];
            this.createParticles();
        }

        createParticles() {
            const particleCount = Math.random() * 50 + 50;
            for (let i = 0; i < particleCount; i++) {
                const particle = {
                    x: this.x,
                    y: this.y,
                    size: Math.random() * 3 + 1,
                    speed: Math.random() * 3 + 1,
                    angle: Math.random() * Math.PI * 2,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    opacity: 1
                };
                this.particles.push(particle);
            }
        }

        update() {
            this.particles.forEach(particle => {
                particle.x += Math.cos(particle.angle) * particle.speed;
                particle.y += Math.sin(particle.angle) * particle.speed;
                particle.opacity -= 0.01;
                particle.size *= 0.98;
            });

            this.particles = this.particles.filter(particle => particle.opacity > 0);
        }

        draw() {
            this.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            });
        }
    }

    // Create an array to store the fireworks
    const fireworks = [];

    // Function to create fireworks at random positions
    function createFireworks() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const firework = new Firework(x, y);
        fireworks.push(firework);
    }

    let animationFrameId;

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        fireworks.forEach(firework => {
            firework.update();
            firework.draw();
        });

        // Remove finished fireworks
        fireworks.forEach((firework, index) => {
            if (firework.particles.length === 0) {
                fireworks.splice(index, 1);
            }
        });

        // Create new fireworks
        if (Math.random() < 0.1) {
            createFireworks();
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Remove the celebratory message and canvas after a certain duration
    setTimeout(() => {
        celebrationMessage.remove();
        canvas.remove();
        cancelAnimationFrame(animationFrameId);
    }, 3000);
}

// Function to show email input for claiming reward
function showEmailInput() {
    const existingContainer = document.querySelector('.email-input-container');
    if (existingContainer) {
        return; // Return early if the email input container already exists
    }
    
    const emailInputContainer = document.createElement('div');
    emailInputContainer.classList.add('email-input-container');
    emailInputContainer.innerHTML = `
        <h3>Claim Your Reward</h3>
        <p>Enter your email address to claim your reward. Please note that only backers of the Kickstarter who have bought at least one pin are eligible and only one claim per person will be recognised. Your prize will be a random pin from the unlocked pins in the campaign. Your email must match your Kickstarter email to be acknowledged.</p>
        <input type="email" id="emailInput" placeholder="Enter your email">
        <button id="claimButton" class="glow-button">Claim Reward</button>
    `;

    const resultWrapper = document.getElementById('result-wrapper');
    resultWrapper.appendChild(emailInputContainer);

    const claimButton = document.getElementById('claimButton');
    claimButton.addEventListener('click', claimReward);
}

// Function to validate email address
function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to handle reward claiming
function claimReward() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    
    if (!isValidEmail(email)) {
        displayModal('Please enter a valid email address.');
        return;
    }
    
    // Make a request to the backend API to claim the reward
    fetch(`${backend}/claim`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: key, email: email }),
    })
        .then(response => response.json())
        .then(data => {
            // Display the response message in a modal box
            displayModal(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to display a modal box
function displayModal(message) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <p>${message}</p>
            <button id="closeModalButton">Close</button>
        </div>
    `;

    const closeModalButton = modal.querySelector('#closeModalButton');
    closeModalButton.addEventListener('click', () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Add click event listener to the spin button
const spinButton = document.getElementById('spin-button');
spinButton.addEventListener('click', spinWheel);

// Draw the initial wheel
drawWheel();