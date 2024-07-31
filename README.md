Backend

API Endpoints
Authentication Routes:

POST signupRoute.post("/signup", signUpController.signup);: Logs in a user.
POST signupRoute.post("/login", signUpController.login); Registers a new user.
Product Listing:

GET /api/products: Retrieves a list of services.
POST /api/products: Adds a new service.
Product Details:

GET /api/products/:id: Retrieves details of a specific service.
Booking:
productRoute.put("/update-product", uploadMiddleware.array('images'), productController.update);
productRoute.delete("/delete-product/:id", productController.remove);
productRoute.post("/create-product", uploadMiddleware.array('files', 3), productController.create);
productRoute.get("/get-products", productController.getAllProducts);
productRoute.post("/get-product", productController.getProducts);

POST /api/bookings: Creates a new booking.
billingRoute.post("/book-entity",verifyToken, bookingsController.createBooking);
billingRoute.post("/get-bookings/:id",verifyToken, bookingsController.getBookings);
Payment:

POST /api/payments: Processes payment for a booking.
billingRoute.post("/get-billing-history",verifyToken, billingController.getBilling);

Database


MongoDB: Used for storing user data, service details, booking information, and payment data.
AWS S3 Bucket: Used for uploading and storing images associated with services.
Key Features
User Authentication: Login and signup functionality.
Database Management: Handling of service listings, user profiles, and bookings.
Payment Data Storing: Storing payment information securely.
Image Uploading and Storing: Uploading images to AWS S3 and linking to MongoDB.
Billing Data Storing: Storing billing details for transactions.
User Profile Management: Managing user information and preferences.
Product Listing: Displaying available services for booking.

State Management
Redux: Used for managing the state of the application, including user authentication status, service data, and booking details.

API Handling
Interceptor: Handles API requests and responses, ensuring proper communication between the frontend and backend.
