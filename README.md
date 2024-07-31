Booking App Documentation
Overview
App Name: Booking App
Technology Stack: React, Express, MongoDB, Node.js, Amazon S3 Bucket, Figma

Description:
The Booking App is a platform that allows users to search and book services from various providers. It includes features for user authentication, product listing, service booking, and payment processing.

Frontend
Components
Header:

Home Button: Navigates to the home page.
Login/Register Buttons: Directs to login and registration pages.
Search Bar: Allows users to search for services with filters for date and time.
Navigation Bar: Appears when additional features are available.
Login Page:

Fields: Email, Password
Button: Login
Signup Page:

Fields: Name, Email, Password, Confirm Password
Button: Signup
Link: Login page redirect
Dashboard:

Displays a list of available services (e.g., hotels).
ViewPage:

Shows detailed information about a selected service.
Booking Page:

Fields: Date selection, service details, reviews
Button: Book Service
Payment Page:

Summary: Service details and cost
Fields: Card data for payment
Dashboard Product Adding Page:

Fields: Service details (e.g., hotel)
Button: Add Product
Image Upload: Save image to AWS S3 and link to MongoDB
Booking Confirmation Page:

Details: Booking summary and confirmation
