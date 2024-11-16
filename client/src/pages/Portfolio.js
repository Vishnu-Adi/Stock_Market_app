import React, { useEffect, useState } from 'react';
// Remove unused imports
// import '../styles/Portfolio.css';
// import { BiSearch } from 'react-icons/bi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {

  const [stocks, setStocks] = useState([]);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();


  useEffect(()=>{
    fetchStocks();
  }, [])

  const fetchStocks = async () =>{
    await axios.get('http://localhost:6001/fetch-stocks').then(
      (response)=>{
        setStocks(response.data.reverse());
      }
    ).catch((err)=>{
      console.log(err);
    })
  }  


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold">My Portfolio</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Stock Symbol..."
            className="border rounded-l px-4 py-2 focus:outline-none"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
            Search
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stocks.filter(stock => stock.user === userId).map((stock) => (
          <div key={stock._id} className="bg-white shadow-md rounded-lg p-6">
            <h6 className="text-gray-500">{stock.stockExchange}</h6>
            <div className="mt-4">
              <p><strong>Symbol:</strong> {stock.symbol}</p>
              <p><strong>Stock:</strong> {stock.name}</p>
              <p><strong>Stocks Bought:</strong> {stock.count}</p>
              <p><strong>Price:</strong> $ {stock.price}</p>
              <p><strong>Total Value:</strong> $ {stock.totalPrice}</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                View Chart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;