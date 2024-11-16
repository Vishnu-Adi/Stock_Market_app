const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true },
    balance: {type: Number, default: 0}
});

const transactionSchema = new mongoose.Schema({
    user: {type: String, required: true},
    type: {type: String, required: true},
    paymentMode: {type: String, required: true},
    amount: {type: Number, required: true},
    time: {type: String}
})

const stocksSchema = new mongoose.Schema({
    user:{type: String},
    symbol: {type: String},
    name: {type: String},
    price: {type: Number},
    count: {type: Number},
    totalPrice: {type: Number},
    stockExchange: {type: String}
})

const ordersSchema = new mongoose.Schema({
    user: {type: String},
    symbol: {type: String},
    name: {type: String},
    price:{type: Number},
    count: {type: Number},
    totalPrice: {type: Number},
    stockType: {type: String}, //   intraday / delivery
    orderType: {type: String}, //   buy / sell
    orderStatus: {type: String}
})

const User = mongoose.model('users', userSchema);
const Transaction = mongoose.model('transactions', transactionSchema);
const Stock = mongoose.model('stocks', stocksSchema);
const Order = mongoose.model('orders', ordersSchema);

module.exports = { User, Transaction, Stock, Order };