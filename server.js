'use strict'

require('dotenv').config();
const express = require('express')
const cors = require('cors');
const { response } = require('express');
const weather = require('./data/weather.json')


const app = express();

app.use(cors());

const PORT = process.env.PORT

app.get('/test', (req, res) => {res.send('Hello, I work and ready for lab!')});
app.get('/weather', handleGetWeather);
app.get('/*', (req, res) => res.status(404).send('not found'))


function handleGetWeather (req, res) {
    console.log('weather function was ran')
    const cityName = req.query.city
    const lat = req.query.lat
    const lon = req.query.lon
    console.log(req.query)
    try {
        const cityToSend = weather.find(city => {
            if((city.lat === lat && city.lon === lon) || city.city_name === cityName) {
                return true;
            }
            return false;
        });
        if (cityToSend) {
            const forecastData = cityToSend.data.map(city => new WeatherForecast(city));
            console.log(forecastData)
            res.status(200).send(forecastData)
        } else {
            res.status(404).send('City is not found')
        }
    } catch (e) {
        res.status(500).send('server error')
    }
}

class WeatherForecast {
    constructor(obj) {
        this.min_temp = obj.min_temp;
        this.max_temp = obj.max_temp;
        this.description = obj.weather.description
    }
}



app.listen(PORT, () => console.log(`I am listening on port: ${PORT}`));