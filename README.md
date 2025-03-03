# law_chatbot
 RAG based chatbot application;


const express = require('express');
const EventEmitter = require('events');

const app = express();
const port = 3000;
app.use(express.json());

const orderEmitter = new EventEmitter();
const orders = {}; // Store order status

// 1️⃣ Accept New Order (POST /order)
app.post('/order', (req, res) => {
    const { orderId, foodItem, customerName } = req.body;

    if (!orderId || !foodItem || !customerName) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Store the order as "processing"
    orders[orderId] = { foodItem, customerName, status: "Processing" };

    console.log(`Order received: ${orderId}`);

    // Simulate async order processing
    processOrder(orderId)
        .then(() => console.log(`Order ${orderId} is ready!`))
        .catch((err) => console.error(err));

    res.json({ message: `Order ${orderId} received!`, orderId });
});

// 2️⃣ Process Order Asynchronously
async function processOrder(orderId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            orders[orderId].status = "Ready";
            orderEmitter.emit('orderReady', orderId); // Emit event
            resolve();
        }, 5000); // 5 seconds processing time
    });
}

// Listen for order completion
orderEmitter.on('orderReady', (orderId) => {
    console.log(`Event: Order ${orderId} is ready!`);
});

// 3️⃣ Retrieve Order Status (GET /order/:id)
app.get('/order/:id', (req, res) => {
    const orderId = req.params.id;
    if (!orders[orderId]) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json({ orderId, status: orders[orderId].status });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

