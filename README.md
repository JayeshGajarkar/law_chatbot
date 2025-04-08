/* home.component.css */

.home-container {
  font-family: 'Segoe UI', sans-serif;
  color: white;
  background: linear-gradient(to right, #2563eb, #1e40af);
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 15px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 28px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.login-btn {
  background-color: white;
  color: #1e3a8a;
}

.login-btn:hover {
  background-color: #e0e7ff;
}

.signup-btn {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.signup-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1000px;
  width: 100%;
}

.info-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.info-card h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.info-card p {
  font-size: 1rem;
  line-height: 1.5;
}


<!-- home.component.html -->
<div class="home-container">
  <section class="hero">
    <h1>Welcome to InventoryPro</h1>
    <p class="subtitle">
      Your one-stop solution for managing products, orders, customers, and suppliers with ease.
    </p>
    <div class="button-group">
      <button class="btn login-btn">Login</button>
      <button class="btn signup-btn">Sign Up</button>
    </div>
  </section>

  <section class="info-section">
    <div class="info-card">
      <h2>Product Management</h2>
      <p>
        Easily add, update, and categorize products with detailed attributes, pricing, and stock levels.
      </p>
    </div>

    <div class="info-card">
      <h2>Order Management</h2>
      <p>
        Track customer orders, manage order statuses, and monitor fulfillment to ensure timely delivery.
      </p>
    </div>

    <div class="info-card">
      <h2>Customer Management</h2>
      <p>
        Manage customer profiles, purchase history, and preferences for better service and retention.
      </p>
    </div>

    <div class="info-card">
      <h2>Supplier Management</h2>
      <p>
        Maintain supplier details, monitor deliveries, and manage purchase orders efficiently.
      </p>
    </div>
  </section>
</div>
