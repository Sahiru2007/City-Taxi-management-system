Certainly! Here is a more detailed `README.md` file that includes features, technologies, installation, configuration, and diagrams:


# City Taxi Management System

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Twilio Setup](#twilio-setup)
  - [Stripe Setup](#stripe-setup)
  - [Google Maps API Setup](#google-maps-api-setup)
- [Usage](#usage)
- [System Architecture](#system-architecture)
  - [Architecture Diagram](#architecture-diagram)
  - [UML Diagrams](#uml-diagrams)
- [Contributing](#contributing)
- [License](#license)

## Project Description
City Taxi Management System is a web-based reservation system for City Taxi (PVT) Ltd. The system enhances service efficiency, improves customer satisfaction, and maintains a competitive edge in the transportation market. Key features include online booking, real-time driver tracking, automated payment calculation, and user-friendly interfaces for passengers, drivers, and administrators.

## Features
- **Online Booking**: Passengers can book taxis online through a user-friendly interface.
- **Real-Time Driver Tracking**: Passengers and administrators can track drivers in real-time.
- **Automated Payment Calculation**: The system calculates fare automatically and integrates with Stripe for secure payments.
- **User Management**: Registration and account management for passengers and drivers.
- **SMS Notifications**: Real-time updates and notifications via SMS using Twilio.
- **Admin Dashboard**: Comprehensive dashboard for administrators to manage the system.

## Technologies Used
- **Frontend**: React, HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Gateway**: Stripe
- **SMS Service**: Twilio
- **Mapping Service**: Google Maps API
- **Version Control**: Git
- **IDE**: Visual Studio Code

## Installation

### Prerequisites
- Node.js and npm installed on your machine
- MongoDB installed and running

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahiru2007/city-taxi-management-system.git
   cd city-taxi-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/CityTaxi
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   STRIPE_SECRET_KEY=your_stripe_secret_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

## Configuration

### Twilio Setup
1. **Sign Up**: Go to [Twilio](https://www.twilio.com/) and create an account.
2. **Get Credentials**: After signing up, get your Account SID and Auth Token from the Twilio Console.
3. **Phone Number**: Purchase a Twilio phone number from which SMS will be sent.
4. **Add to .env**: Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` to your `.env` file.

### Stripe Setup
1. **Sign Up**: Go to [Stripe](https://stripe.com/) and create an account.
2. **Get Secret Key**: From the Stripe Dashboard, get your Secret Key.
3. **Add to .env**: Add `STRIPE_SECRET_KEY` to your `.env` file.

### Google Maps API Setup
1. **Sign Up**: Go to [Google Cloud Platform](https://cloud.google.com/) and create a project.
2. **Enable APIs**: Enable the Maps JavaScript API and Places API for your project.
3. **Get API Key**: From the Google Cloud Console, get your API Key.
4. **Add to .env**: Add `GOOGLE_MAPS_API_KEY` to your `.env` file.

## Usage
1. **Start the Development Server**
   ```bash
   npm start
   ```

2. **Open the Application**
   Go to `http://localhost:3000` in your browser.

3. **Admin Login**
   Use the admin credentials to log in to the admin dashboard and manage the system.

## System Architecture

### Architecture Diagram
<img width="869" alt="Screenshot 2024-06-24 at 22 48 43" src="https://github.com/Sahiru2007/City-Taxi-management-system/assets/75121314/c46942cd-91b6-448c-b371-ddb69463a613">

### ER Diagram
<img width="1305" alt="Screenshot 2024-06-24 at 22 50 03" src="https://github.com/Sahiru2007/City-Taxi-management-system/assets/75121314/2e242d4c-4b87-46dd-8d16-4301c5741215">

### UML Diagrams

#### Use Case Diagram
![Use Case Diagram](path/to/use-case-diagram.png)
<img width="620" alt="Screenshot 2024-06-24 at 22 49 03" src="https://github.com/Sahiru2007/City-Taxi-management-system/assets/75121314/c8ff96ac-0102-489a-9159-003fe61dce10">

#### Class Diagram
<img width="1528" alt="Screenshot 2024-06-24 at 22 49 39" src="https://github.com/Sahiru2007/City-Taxi-management-system/assets/75121314/5fe3d0ed-2a16-4252-9a1d-847515f5df0a">

#### Sequence Diagram
![Sequence Diagram](path/to/sequence-diagram.png)

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code follows the project's coding standards and includes appropriate tests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```

