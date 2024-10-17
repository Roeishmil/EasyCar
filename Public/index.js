let currentIndex = 0;
const slideInterval = 6000; // 6 seconds

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
    progressBar.style.width = '0%';
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
function initMap() {
    // The location
    const location = { lat: 31.9669606, lng: 34.7650917 }; //  coordinates
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


///////////////////////////////////////////////////////DOM JS Logic /////////////////////////////////////////////////////////////////

// Ensure that the script runs after the DOM is fully loaded 
window.addEventListener('DOMContentLoaded', function() {

  // Check if the user is logged in
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const username = sessionStorage.getItem('username');
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // will be true only if isAdmin
  const welcomeContainer = document.getElementById('welcomeContainer');

    if(isAdmin){
      document.getElementById('productButton').style.display = 'block';
      this.document.getElementById('manageUsersButton').style.display = 'block';
    }else{
      document.getElementById('productButton').style.display = 'none';
    }
  

  if (isLoggedIn === 'true' && username) {

      // Change the login button to signout
      const loginButton = document.getElementById('loginButton');
      loginButton.textContent = 'Sign Out';
      
      // Display the welcome message inside the header
      if (welcomeContainer) {
        welcomeContainer.textContent = `Welcome back, ${username}!`;
    }

      // Add event listener for signout button
      loginButton.addEventListener('click', function() {
          // Clear localStorage and redirect to login page
          sessionStorage.removeItem('isLoggedIn');
          sessionStorage.removeItem('username');
          sessionStorage.removeItem('isAdmin')
          sessionStorage.removeItem('userOrders')
          // Clear the welcome message if it's displayed
          if (welcomeContainer) {
            welcomeContainer.textContent = '';
          }
          
          
          alert('Signing out');
          window.location.href = 'index.html';          
          document.location.reload();
      });
  }
});

//Only add listener once orders button is available (when in main page)
const ordersButton = document.getElementById('orders');
if (ordersButton){
  // Updated event listener for the orders button
    ordersButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent any default action
    
    let currentUser = sessionStorage.getItem('username');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Check if the user is admin

  
    if(!currentUser){
      alert('Please login to view your orders');
      window.location.href='login.html';
      return;
    }

    let response;

    try {
      if (isAdmin) { //Get all user results
        // Send the data to the server using fetch      
         response = await fetch('/getAllOrders', {
          method: 'POST', //means that data will be sent in the body of the request to the server
          headers: { //the data being sent is in JSON format
            'Content-Type': 'application/json'
          },
        });
      }
      else{ //Get by user
      // Send the data to the server using fetch      
       response = await fetch('/getOrdersByUser', {
        method: 'POST', //means that data will be sent in the body of the request to the server
        headers: { //the data being sent is in JSON format
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentUser }) // Send the name in the body
      });
    }
  
      const result = await response.json(); //converts the response from the server (which is also in JSON format) back into a JavaScript object for further use.
      sessionStorage.setItem('userOrders',JSON.stringify(result));
      window.location.href = 'orders.html';
  
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

///////////////////////////////////////////////////////Login JS Logic /////////////////////////////////////////////////////////////////


//Only add listener once loginsubmit button is available (when in login page)
const loginSubmitButton = document.getElementById('loginSubmitButton');
if (loginSubmitButton){
  // Add an event listener to the login button
  loginSubmitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
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
          // Store the username in localStorage upon successful login
          sessionStorage.setItem('username', loginUsername);
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('isAdmin', result.isAdmin);
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



///////////////////////////////////////////////////////Sign up JS Logic /////////////////////////////////////////////////////////////////
const signupSubmitButton = document.getElementById('signupSubmitButton');
if (signupSubmitButton){
  // Add an event listener to the signup button
  console.log("pre event listener");
  signupSubmitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("eventListener.signUp");
    try {
        // Get username and password from input fields
        const signupUsername = document.getElementById('loginUsername').value.trim();
        const signupPassword = document.getElementById('loginPassword').value.trim();
        if(signupUsername === "" || signupPassword === ""){ // signup validation for empty input
          event.preventDefault();
          alert("Please fill in all fields");
          return;
        }

        // Make the POST request to your server with the signup details
        const response = await fetch('/signupUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: signupUsername, password: signupPassword, isAdmin: false })
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


///////////////////////////////////////////////////////Cart JS Logic /////////////////////////////////////////////////////////////////

// Initializing cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add an event listener to the cart button
const currentCart = document.getElementById('cartButton')
if(currentCart){
    counter = localStorage.getItem('cartCount');
    if(counter){
      document.getElementById('cartCount').textContent = counter;
    }
    else{
      document.getElementById('cartCount').textContent = 0;
    }
     
    currentCart.addEventListener('click', function() {
        // Redirect to a cart page (to be created) or show a modal with cart items
        window.location.href = 'cart.html'; 
    });

}


///////////////////////////////////////////////////////Add Product JS Logic /////////////////////////////////////////////////////////////////


// Get modal element and its components
const modal = document.getElementById('productModal');
const modalHeader = document.querySelector('.modal-header');
if (modal && modalHeader) {
  let isDragging = false;
  let offsetX, offsetY;

  // Start dragging when mouse is down on modal header
  modalHeader.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    modal.style.position = 'absolute'; // Ensure absolute positioning
    modal.style.cursor = 'move'; // Show move cursor
  });

  // Move modal as mouse moves
  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      let newLeft = e.pageX - offsetX;
      let newTop = e.pageY - offsetY;

      // Boundaries for modal (prevent from going off-screen)
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const modalWidth = modal.offsetWidth;
      const modalHeight = modal.offsetHeight;

      // Ensure modal stays within screen bounds
      newLeft = Math.max(0, Math.min(newLeft, windowWidth - modalWidth));
      newTop = Math.max(0, Math.min(newTop, windowHeight - modalHeight));

      modal.style.left = `${newLeft}px`;
      modal.style.top = `${newTop}px`;
    }
  });

  // Stop dragging when mouse is released
  document.addEventListener('mouseup', function () {
    isDragging = false;
    modal.style.cursor = 'default'; // Revert cursor
  });

  // Button to open modal
  const btn = document.getElementById('productButton');
  // Close button in the modal
  const span = document.getElementsByClassName('close')[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
    modal.style.top = "20px"; // Open near the top of the screen
    modal.style.left = "50%";
    modal.style.transform = "translateX(-50%)";
  }

  // Close modal when the "x" button is clicked
  span.onclick = function () {
    modal.style.display = "none";
  }

  // Close modal if user clicks outside of it (only if not dragging)
  window.onclick = function (event) {
    if (event.target == modal && !isDragging) {
      modal.style.display = "none";
    }
  }
}

// Handle Add Product form submission
const productForm = document.getElementById('productForm');
if(productForm){
    productForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Gather input values from the form
    const productData = {
      name: document.getElementById('productName').value.trim(),
      year: document.getElementById('productYear').value.trim(),
      mileage: document.getElementById('productMileage').value.trim(),
      price: document.getElementById('productPrice').value.trim(),
      description: document.getElementById('productDescription').value,
      manufacturer: document.getElementById('productManufacturer').value.trim(),
      quantity: document.getElementById('productQuantity').value.trim(),
      image: document.getElementById('productImage').value
    };

    try {
      // Make a POST request to the server to store the product in MongoDB
      const response = await fetch('/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (result) {
        alert('Product added successfully!');
        fetchCars();
        modal.style.display = "none"; // Close the modal
      } else {
        alert('Failed to add product frontend');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}