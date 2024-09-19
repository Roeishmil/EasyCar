let currentIndex = 0;
const slideInterval = 6000; // 6 seconds

console.log('index.js loaded');

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = slides.children.length;

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    slides.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Reset and start the progress bar for the current slide
    resetProgressBar();
    startProgressBar();
}

function changeSlide(step) {
    showSlide(currentIndex + step);
}

function resetProgressBar() {
    const progressBar = document.querySelectorAll('.progress-bar')[currentIndex];
    progressBar.style.width = '0%'; // Reset the width to 0%
    progressBar.style.transition = 'none'; // Disable transition temporarily
}

function startProgressBar() {
    const progressBar = document.querySelectorAll('.progress-bar')[currentIndex];
    setTimeout(() => {
        progressBar.style.transition = `width ${slideInterval}ms linear`;
        progressBar.style.width = '72%'; // Start the filling animation
    }, 50); // Small delay to ensure reset is applied
}

// Auto-slide
setInterval(() => { changeSlide(1); }, slideInterval);

// Start the initial progress bar animation
startProgressBar();


//JavaScript to initialize the map
// Initialize and add the map
function initMap() {
    // The location
    const location = { lat: 31.9669606, lng: 34.7650917 }; // Example coordinates
    // The map, centered at location
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: location,
    });
    // The marker, positioned at location
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  }


//Only add listener once orders button is available (when in main page)
const ordersButton = document.getElementById('orders');
if (ordersButton){
  // Updated event listener for the orders button

    orderButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent any default action
  
    const name = "eldar"; // The generic name you want to insert
  
    try {
      // Send the data to the server using fetch
      const response = await fetch('/insert', {
        method: 'POST', //means that data will be sent in the body of the request to the server
        headers: { //the data being sent is in JSON format
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name }) // Send the name in the body
      });
  
      const result = await response.json(); //converts the response from the server (which is also in JSON format) back into a JavaScript object for further use.
  
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

//Only add listener once loginsubmit button is available (when in login page)
const loginSubmitButton = document.getElementById('loginSubmitButton');
if (loginSubmitButton){
  // Add an event listener to the login button
  loginSubmitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      console.log('Login validation submition');
        // Get username and password from input fields
        const loginUsername = document.getElementById('loginUsername').value;
        const loginPassword = document.getElementById('loginPassword').value;

        // Make the POST request to your server with the login details
        const response = await fetch('/validateLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
        });

        const result = await response.json();

        if (result.success) {
            alert('Login successful! hello' + " " + loginUsername);
            window.location.href = 'index.html';
            // Redirect to another page or show a success message
        } 
        else {
            console.log('Login failed:', result.message);
            alert('Invalid login credentials.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred during login.');
    }
  });
}
//TODO validate signup input
const signupSubmitButton = document.getElementById('signupSubmitButton');
if (signupSubmitButton){
  // Add an event listener to the signup button
  console.log("pre event listener");
  signupSubmitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("eventListener.signUp");
    try {
      console.log('signUp validation submition');
        // Get username and password from input fields
        const signupUsername = document.getElementById('loginUsername').value;
        const signupPassword = document.getElementById('loginPassword').value;

        // Make the POST request to your server with the signup details
        const response = await fetch('/signupUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: signupUsername, password: signupPassword })
        });

        const result = await response.json();

        if (result.success) {
            console.log('signup successful!');
            alert('signup successful! '+ result.message + " " + "please login");
        } else {
          alert('signup failed: ' + result.message);
            
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred during signup.');
    }
  });
}


// Ensure that the script runs after the DOM is fully loaded


