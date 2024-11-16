import React, { useEffect, useState } from 'react'
import '../styles/StockChart.css'
import Chart from 'react-apexcharts'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Button, TextField, Select, MenuItem, Tabs, Tab, FormControl, InputLabel, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ChartContainer = styled(Paper)(({ theme }) => ({
  height: '600px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

const ActionPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '600px',
  overflow: 'auto'
}));

const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
    width: '100%',
  }
}));

const StockChart = () => {

  const [stockAction, setStockAction] = useState('buy');

  const {id} = useParams();
  const [stockValues, setStockValues] = useState([]);
  const [stockPrice, setStockPrice] = useState();
  const [stockExchange, setStockExchange] = useState('');

  const [buyQuantity, setBuyQuantity] = useState(0);
  const [buyType, setBuyType] = useState('Intraday');
  const [sellQuantity, setSellQuantity] = useState(0);
  const [sellType, setSellType] = useState('Intraday');


  const transformAndAppendData = apiResponse => {
    const close = parseFloat(apiResponse.close);
    const high = parseFloat(apiResponse.high);
    const low = parseFloat(apiResponse.low);
    const open = parseFloat(apiResponse.open);
  
    const datetime = new Date(apiResponse.datetime);
    const timestamp = datetime.getTime();

    const transformedObject = {
      x: timestamp,
      y: [open, high, low, close]
    };

    // Use the spread operator to append the transformed object to the state array
    setStockValues(prevData => [...prevData, transformedObject]);
  };


 
  const fetchPrice = async() =>{
    
      const optionsPrice = {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/price',
        params: {
          symbol: id,
          format: 'json',
          outputsize: '30'
        },
        headers: {
          'X-RapidAPI-Key': '9604ff284bmsh827f0b7588f623ep1d7c4cjsnb18f8e2728a9',
          'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
        }
      };
    try {
      const response = await axios.request(optionsPrice);
      setStockPrice( parseFloat(response.data.price));
    } catch (error) {
      console.error(error);
    }
  }
  

  useEffect(()=>{
    fetchStockData();
    fetchPrice();
  },[])



  const fetchStockData = async()=>{
    const optionsData = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/time_series',
      params: {
        symbol: id,
        interval: '1min',
        outputsize: '100',
        format: 'json'
      },
      headers: {
        'X-RapidAPI-Key': '9604ff284bmsh827f0b7588f623ep1d7c4cjsnb18f8e2728a9',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(optionsData);
      console.log(response.data.meta);
      setStockExchange(response.data.meta.exchange);
      const apiResponses = response.data.values;
      apiResponses.forEach(apiResponse => {
        transformAndAppendData(apiResponse);
      });
    } catch (error) {
      console.error(error);
    }
  }


  const series = [{
    data: stockValues
  }]
  const options = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: id + ' ' + stockExchange,
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }


  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();


  const buyStock = async (e)=>{
    e.preventDefault();

    const options = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/symbol_search',
  params: {
    symbol: id,
    outputsize: '1'
  },
      headers: {
        'X-RapidAPI-Key': '9604ff284bmsh827f0b7588f623ep1d7c4cjsnb18f8e2728a9',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      }
    };
    
    try {
      const res = await axios.request(options);
      await axios.post('http://localhost:6001/buyStock', {user: userId, symbol: id, name: res.data.data[0].instrument_name, stockType: buyType, stockExchange: stockExchange, price: stockPrice,  count: buyQuantity, totalPrice: stockPrice * buyQuantity}).then(
      (response)=>{
          setBuyQuantity(0);
          setBuyType(0);
          navigate('/history');
      }
    ).catch((error)=>{
      alert("Transaction failed!!");
    })
    } catch (error) {
      console.error(error);
    }
  }



  const sellStock = async (e)=>{
    e.preventDefault();

    const options = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/symbol_search',
  params: {
    symbol: id,
    outputsize: '1'
  },
      headers: {
        'X-RapidAPI-Key': '9604ff284bmsh827f0b7588f623ep1d7c4cjsnb18f8e2728a9',
        'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
      }
    };
    
    try {
      const res = await axios.request(options);
      await axios.post('http://localhost:6001/sellStock', {user: userId, symbol: id, name: res.data.data[0].instrument_name, stockType: sellType, price: stockPrice,  count: sellQuantity, totalPrice: stockPrice * sellQuantity}).then(
      (response)=>{
          setSellQuantity(0);
          setSellType(0);
          navigate('/history');
      }
    ).catch((error)=>{
      alert("Transaction failed!!");
    })
    } catch (error) {
      console.error(error);
    }
  }



  return (

    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ChartContainer>
            <Chart options={options} series={series} type="candlestick" height="100%" />
          </ChartContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionPanel>
            <Tabs 
              value={stockAction} 
              onChange={(e, val) => setStockAction(val)}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label={<Typography color="success.main">{`Buy @ $${stockPrice || ''}`}</Typography>} value="buy" />
              <Tab label={<Typography color="error.main">{`Sell @ $${stockPrice || ''}`}</Typography>} value="sell" />
            </Tabs>
            
            <FormContainer>
              {stockAction === 'buy' ? (
                <form onSubmit={buyStock}>
                  <FormControl fullWidth>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={buyType}
                      onChange={(e) => setBuyType(e.target.value)}
                      label="Product"
                    >
                      <MenuItem value="Intraday">Intraday</MenuItem>
                      <MenuItem value="Delivery">Delivery</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    label="Quantity"
                    type="number"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(e.target.value)}
                    fullWidth
                  />
                  
                  <TextField
                    label="Total Price"
                    type="number"
                    value={buyQuantity * stockPrice}
                    disabled
                    fullWidth
                  />
                  
                  <Button 
                    variant="contained" 
                    color="success" 
                    fullWidth 
                    type="submit"
                    sx={{ mt: 2 }}
                  >
                    Buy Now
                  </Button>
                </form>
              ) : (
                <form onSubmit={sellStock}>
                  <FormControl fullWidth>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={sellType}
                      onChange={(e) => setSellType(e.target.value)}
                      label="Product"
                    >
                      <MenuItem value="Intraday">Intraday</MenuItem>
                      <MenuItem value="Delivery">Delivery</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    label="Quantity"
                    type="number"
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(e.target.value)}
                    fullWidth
                  />
                  
                  <TextField
                    label="Total Price"
                    type="number"
                    value={sellQuantity * stockPrice}
                    disabled
                    fullWidth
                  />
                  
                  <Button 
                    variant="contained" 
                    color="error" 
                    fullWidth 
                    type="submit"
                    sx={{ mt: 2 }}
                  >
                    Sell Now
                  </Button>
                </form>
              )}
            </FormContainer>
          </ActionPanel>
        </Grid>
      </Grid>
    </Container>

  )
}

export default StockChart