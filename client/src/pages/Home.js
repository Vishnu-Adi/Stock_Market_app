import axios from 'axios';
import React, { useEffect, useState } from 'react';
// Remove unused imports
// import '../styles/Home.css';
// import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [allStocks, setAllStocks] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrending();
    fetchAllStocks();
  }, []);

  // Trending (top 25) stocks
  const fetchTrending = async () => {
    const optionsTrending = {
      method: 'GET',
      url: 'https://mboum-finance.p.rapidapi.com/v1/markets/options/most-active',
      params: { type: 'STOCKS' },
      headers: {
        'X-RapidAPI-Key': '9604ff284bmsh827f0b7588f623ep1d7c4cjsnb18f8e2728a9',
        'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(optionsTrending);
      console.log(response.data.body);
      setTrendingStocks(response.data.body);
    } catch (error) {
      console.error(error);
    }
  };

  // All the available stocks
  const fetchAllStocks = async () => {
    const optionsAll = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/stocks',
      params: {
        exchange: 'NASDAQ',
        format: 'json',
      },
      headers: {
        'X-RapidAPI-Key': '9604ff284bmsh827f0b7588f623ep1d7c4cjsnb18f8e2728a9',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(optionsAll);
      setAllStocks(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Top Stocks</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trendingStocks.map((stock) => (
          <div key={stock.symbol} className="bg-white shadow-md rounded-lg p-6">
            <div onClick={() => navigate(`/stock/${stock.symbol}`)}>
              <span>
                <h5 className="font-semibold">Name</h5>
                <p>{stock.symbolName}</p>
              </span>
              <span>
                <h5 className="font-semibold">NASDAQ</h5>
                <p>{stock.symbol}</p>
              </span>
              <span>
                <h5 className="font-semibold">ChangeInPrice</h5>
                <p className={parseFloat(stock.percentChange) > 0 ? 'text-green-500' : 'text-red-500'}>
                  $ ({stock.percentChange})
                </p>
              </span>
              <span>
                <h5 className="font-semibold">Price</h5>
                <p className={stock.priceChange > 0 ? 'text-green-500' : 'text-red-500'}>
                  $ ({stock.lastPrice})
                </p>
              </span>
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

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">All Stocks</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Stock Symbol..."
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-l px-4 py-2 focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
              Search
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allStocks.length === 0 && <div className="loading-spinner"></div>}

          {(search === '' ? allStocks : allStocks.filter(stock => stock.symbol.includes(search) || stock.name.includes(search))).map((stock) => (
            <div key={stock.symbol} className="bg-white shadow-md rounded-lg p-6">
              <span>
                <h5 className="font-semibold">Stock name</h5>
                <p>{stock.name}</p>
              </span>
              <span>
                <h5 className="font-semibold">Symbol</h5>
                <p>{stock.symbol}</p>
              </span>
              <span>
                <h5 className="font-semibold">Stock Type</h5>
                <p>{stock.type}</p>
              </span>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                View Chart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;