# EasyCar

## Made by:
- Reef Kugler - 213231871
- Roei Shmil - 211645643
- Eldar Aboudi - 316097138



## Project Overview

**EasyCar** is a fully functional web-based application designed for browsing and purchasing vehicles. The system features car listings, detailed descriptions, and a dynamic chart for sales visualization. It follows the MVC architecture and integrates a MongoDB database to manage users, vehicle inventory, and orders.



## Key Features

### 1. **Vehicle Listings & Filtering**
   - Users can view available stock, filter cars by name, year, manufacturer, and price, and access detailed descriptions for each vehicle.
   - The car listing system is integrated with a MongoDB database, allowing dynamic population of available stock.

### 2. **Dynamic Car Details**
   - Detailed car descriptions, including images, price, mileage, and manufacturer, are dynamically fetched from the database, ensuring accurate information for each vehicle.
   - Clicking on a "View Vehicle" button leads to a detailed car page, using the URL to transfer data, ensuring a clean and efficient flow.

### 3. **Shopping Cart and Checkout**
   - Users can add cars to their cart and proceed to checkout. The cart is stored locally and submitted to the server when the user checks out, with orders being stored in the MongoDB database.
   - The system ensures only logged-in users can place orders, maintaining a robust authentication flow.

### 4. **Order History**
   - Users can view their order history, with all data dynamically fetched from MongoDB.
   - Admin users can view all orders made on the system, categorized by user.

### 5. **Sales Visualization (D3.js)**
   - Integrated D3.js chart shows the number of orders made daily over the past week.
   - The chart uses real-time data from MongoDB to dynamically visualize sales trends.

### 6. **Admin Features**
   - Admin users can manage the platform by adding new vehicles to the stock and managing user roles.
   - They can delete users or promote users to admin status directly from the **Manage Users** page.

### 7. **Google Maps Integration**
   - The project integrates Google Maps API to display a map in the footer, showing the dealership's location.
   - This enhances the user experience by providing a visual and interactive element to locate the dealership.



## Technologies Used

### Frontend:
- **HTML/CSS/JavaScript**: For building the user interface and handling frontend logic.
- **D3.js**: Used for creating dynamic data visualizations (sales chart).
- **Google Maps API**: Integrated for an interactive map showing the dealership's location.


### Backend:
- **Node.js**: Server-side JavaScript runtime environment.
- **Express.js**: Web framework for routing and handling API requests.
- **MongoDB**: NoSQL database used for managing user data, orders, and vehicle inventory.

### Database:
- **MongoDB Atlas**: The application is connected to MongoDB Atlas for managing:
  - **User Accounts**: Securely storing usernames, passwords, and roles.
  - **Vehicle Inventory**: Cars are fetched dynamically from the 'products' collection.
  - **Orders**: All placed orders are stored in the 'orders' collection, with history accessible to users and admins.



## MVC Architecture

The project follows the MVC pattern:

- **Model**: MongoDB database operations, including adding cars, fetching stock, handling user accounts, and managing orders.
- **View**: HTML pages rendering the car listings, cart, and admin management views.
- **Controller**: JavaScript/Node.js managing user interactions, communicating with the backend API, and ensuring data is correctly fetched and displayed.


