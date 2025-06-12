# 🛍️ Trend-Haven — Full Stack E-Commerce Website

**Trend-Haven** is a modern full-featured e-commerce platform where users can browse products, manage carts, and place orders — while admins manage the entire catalog, orders, users, and more through a secure dashboard.

---

## 🧩 Key Features

### 👤 User Side
- ✅ User Registration & Login
- 🔐 Change Password Functionality
- 🔎 Product Search by Keyword
- 🛒 Add to Cart & Place Order
- 💬 **TrendBot Chat Assistant** (Gemini API Integration) for fashion suggestions
- 🧾 View Order History
- 🧱 Route Protection for Authenticated Users
- 🚫 Cart & Order access restricted to logged-in users
- 📱 Fully Responsive Design

### 🛠️ Admin Panel
- 🧑‍💻 Secure Admin Login (Role-Based)
- 📦 Manage Categories & Subcategories
- ➕ Add, Update, Delete Products
- 📷 **Upload Product Images via Cloudinary**
- 🔎 Search & Manage Users
- 📊 View & Filter All Orders
- 🔄 Update Order Status (Pending → Shipped → Delivered)
- 🧾 View Order Details with Product Breakdown
- 🔒 All Admin Routes Fully Protected

### 🧠 Extra Highlights
- 💳 **Razorpay Payment Gateway Integration (LIVE)**
- 💬 **AI-based TrendBot** for personalized fashion advice
- 🌐 REST API Integration between Frontend & Backend
- 🛒 Persistent Cart using React State
- ✨ Smooth UI/UX with hover effects & animations
- 🧩 Modular Folder Structure for Clean Scalability

---

## 🧑‍💻 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | HTML, CSS, React.js       |
| Backend    | Node.js, Express.js       |
| Database   | MongoDB Atlas             |
| Auth       | Basic Auth (Session-based)|
| State Mgmt | React State               |
| Payments   | **Razorpay (Live)**       |
| Cloud      | **Cloudinary** for images |
| AI Chatbot | **Gemini API (TrendBot)** |

---

## 🗂️ Project Structure
<pre> Trend-Haven/ ├── client/ │ ├── node_modules/ │ ├── project pics/ │ ├── public/ │ ├── src/ │ │ ├── Components/ │ │ ├── App.css │ │ ├── App.js │ │ ├── App.test.js │ │ ├── index.css │ │ ├── index.js │ │ ├── logo.svg │ │ ├── reportWebVitals.js │ │ ├── setupTests.js │ ├── .env │ ├── package-lock.json │ ├── package.json │ ├── server/ │ ├── node_modules/ │ ├── public/ │ ├── .env │ ├── package-lock.json │ ├── package.json │ ├── server.js │ ├── .gitignore └── README.md </pre>

---

## 🚀 Installation & Setup
<pre>1️⃣ Clone the Repository
git clone https://github.com/harshulchawla1408/Trend-Haven.git
cd Trend_Haven

2️⃣ Install Dependencies for both client and server folders (In separate terminals)
cd client
npm install

cd server
npm install

3️⃣ Set Up Environment Variables

MONGO_URI=mongodb+srv://Harshul:1408@trend-haven.teqr517.mongodb.net/projectdb?retryWrites=true&w=majority&appName=Trend-Haven
CLOUDINARY_CLOUD_NAME=de2nvgvqw
CLOUDINARY_API_KEY=974177579554955
CLOUDINARY_API_SECRET=7FRqVdGojkLofVOYtZUgEro5qIQRAZORPAY_KEY_ID=rzp_live_mbV46CRmLqswSL
RAZORPAY_KEY_SECRET=phEoxTLx7h6tcNethMcHCQfc
GOOGLE_GEMINI_API_KEY=AIzaSyDhL7EtkmEHYngMjwNmLH5QHclaeRpQniI
REACT_APP_RAZORPAY_KEY_ID=rzp_live_mbV46CRmLqswSL

4️⃣ Run the Application
- 🔧 Start server: npm run dev
- 💻 Start client: npm start

Now, it will open http://localhost:3000 in your browser.</pre>

---

## 🌱 Future Improvements

- ✅ **Add JWT-based secure authentication**
- 🧠 **Add product reviews and ratings**
- 📊 **Build admin dashboard with order/product analytics**
- 📦 **Add inventory management with stock tracking**
- 🔔 **Email Notifications for Order Updates**

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

## 📃 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

---

Made with ❤️ by [Harshul Chawla](https://github.com/harshulchawla1408)

