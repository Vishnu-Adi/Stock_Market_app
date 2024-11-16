const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Order, Stock, Transaction, User } = require('./Schemas');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = 6001;

mongoose.connect('mongodb+srv://saiadithya2022:xT7lytRxwIu32IYs@stock-app.kmiyrfu.mongodb.net/?retryWrites=true&w=majority&appName=Stock-App', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');

    // Register user
    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        
        if (!username || !email || !usertype || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const existingUser = await User.findOne({ 
                $or: [
                    { email: email },
                    { username: username }
                ]
            });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                usertype,
                password: hashedPassword,
                balance: 0
            });

            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);

        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Login user
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            return res.json(user);

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Deposit money
    app.post('/deposit', async (req, res) => {
        const { user, depositAmount, depositMode } = req.body;

        if (!user || !depositAmount || !depositMode) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const userData = await User.findById(user);
            if (!userData) {
                return res.status(404).json({ message: 'User not found' });
            }

            const transaction = new Transaction({
                user: user,
                type: 'Deposit',
                paymentMode: depositMode,
                amount: depositAmount,
                time: new Date()
            });

            await transaction.save();
            userData.balance = parseInt(userData.balance) + parseInt(depositAmount);
            await userData.save();

            return res.json(userData);

        } catch (error) {
            console.error('Deposit error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Withdraw money
    app.post('/withdraw', async (req, res) => {
        const { user, withdrawAmount, withdrawMode } = req.body;

        if (!user || !withdrawAmount || !withdrawMode) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const userData = await User.findById(user);
            if (!userData) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (userData.balance < withdrawAmount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            const transaction = new Transaction({
                user: user,
                type: 'Withdraw',
                paymentMode: withdrawMode,
                amount: withdrawAmount,
                time: new Date()
            });

            await transaction.save();
            userData.balance = parseInt(userData.balance) - parseInt(withdrawAmount);
            await userData.save();

            return res.json(userData);

        } catch (error) {
            console.error('Withdrawal error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Buy stock
    app.post('/buyStock', async (req, res) => {
        const { user, symbol, name, stockType, stockExchange, price, count, totalPrice } = req.body;

        try {
            const userData = await User.findById(user);
            if (!userData) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (parseInt(userData.balance) < parseInt(totalPrice)) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            let stock = await Stock.findOne({ user: user, symbol: symbol });
            
            if (stock) {
                stock.price = (parseInt(stock.price) * parseInt(stock.count) + parseInt(price) * parseInt(count)) / 
                            (parseInt(stock.count) + parseInt(count));
                stock.count = parseInt(stock.count) + parseInt(count);
                stock.totalPrice = parseInt(stock.totalPrice) + parseInt(totalPrice);
                await stock.save();
            } else {
                stock = new Stock({
                    user, symbol, name, price, count, totalPrice, stockExchange
                });
                await stock.save();
            }

            userData.balance = parseInt(userData.balance) - parseInt(totalPrice);
            await userData.save();

            const order = new Order({
                user, symbol, name, stockType, price, count, totalPrice,
                orderType: 'Buy',
                orderStatus: 'Completed'
            });
            await order.save();

            return res.status(201).json({ message: "Transaction successful" });

        } catch (error) {
            console.error('Buy stock error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Sell stock
    app.post('/sellStock', async (req, res) => {
        const { user, symbol, name, stockType, price, count, totalPrice } = req.body;

        try {
            const stock = await Stock.findOne({ user: user, symbol: symbol });
            if (!stock) {
                return res.status(404).json({ message: 'Stock not found' });
            }

            const userData = await User.findById(user);
            if (!userData) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (parseInt(stock.count) < parseInt(count)) {
                return res.status(400).json({ message: 'Insufficient stocks' });
            }

            if (parseInt(stock.count) === parseInt(count)) {
                await Stock.deleteOne({ user: user, symbol: symbol });
            } else {
                stock.count = parseInt(stock.count) - parseInt(count);
                stock.totalPrice = parseInt(stock.totalPrice) - parseInt(totalPrice);
                await stock.save();
            }

            userData.balance = parseInt(userData.balance) + parseInt(totalPrice);
            await userData.save();

            const order = new Order({
                user, symbol, name, stockType, price, count, totalPrice,
                orderType: 'Sell',
                orderStatus: 'Completed'
            });
            await order.save();

            return res.status(201).json({ message: "Transaction successful" });

        } catch (error) {
            console.error('Sell stock error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get user
    app.get('/fetch-user/:id', async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        } catch (error) {
            console.error('Fetch user error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get all users
    app.get('/fetch-users', async (req, res) => {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (error) {
            console.error('Fetch users error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get transactions
    app.get('/transactions', async (req, res) => {
        try {
            const transactions = await Transaction.find();
            return res.json(transactions);
        } catch (error) {
            console.error('Fetch transactions error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get user transactions
    app.get('/transactions/:id', async (req, res) => {
        try {
            const transactions = await Transaction.find({ user: req.params.id });
            return res.json(transactions);
        } catch (error) {
            console.error('Fetch user transactions error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get orders
    app.get('/fetch-orders', async (req, res) => {
        try {
            const orders = await Order.find();
            return res.json(orders);
        } catch (error) {
            console.error('Fetch orders error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get stocks
    app.get('/fetch-stocks', async (req, res) => {
        try {
            const stocks = await Stock.find();
            return res.json(stocks);
        } catch (error) {
            console.error('Fetch stocks error:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});