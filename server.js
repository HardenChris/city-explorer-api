'use strict'

require('dotenv').config();
const express = require('express')
const cors = require('cors');
const axios = require('axios')
const { response } = require('express');
const weather = require('./data/weather.json')


const app = express();

app.use(cors());

const PORT = process.env.PORT

app.get('/test', (req, res) => {res.status(200).send('Hello, I work and ready for lab!')});
app.get('/hello', (req, res) => {res.status(200).send('Added a hello page, Yay!')});
app.get('/weather', handleGetWeather);
app.get('/movies', handleGetMovies);
app.get('/*', (req, res) => res.status(404).send('not found'))


async function handleGetWeather (req, res) {
    const cityName = req.query.city
    const lat = req.query.lat
    const lon = req.query.lon
    const url=`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const results = await axios.get(url);
    console.log(results.data);
    const forecastData = results.data.data.map(weatherForecast => new WeatherForecast(weatherForecast));
    res.status(200).send(forecastData);
    console.log('weather function was ran')
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


async function handleGetMovies (req, res) {
    const cityName = req.query.city
    // const movieTitleSearch = req.query.city
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityName}&page=1&include_adult=false`;
    const response = await axios.get(url);
    console.log(response.data);
    const movieData = response.data.data.map(currMovie => new MoviesAlike(currMovie));
    res.status(200).send(movieData);
    console.log('weather function was ran')
    console.log(req.query)
    // try {
    //     const cityToSend = weather.find(city => {
    //         if((city.lat === lat && city.lon === lon) || city.city_name === cityName) {
    //             return true;
    //         }
    //         return false;
    //     });
    //     if (cityToSend) {
    //         const forecastData = cityToSend.data.map(city => new WeatherForecast(city));
    //         console.log(forecastData)
    //         res.status(200).send(forecastData)
    //     } else {
    //         res.status(404).send('City is not found')
    //     }
    // } catch (e) {
    //     res.status(500).send('server error')
    // }
}


// class MoviesAlike {
//     constructor(obj) {
//         this.date=obj.datetime;
//         this.min_temp = obj.min_temp;
//         this.max_temp = obj.max_temp;
//         this.description = obj.weather.description;
//     }
// }



app.listen(PORT, () => console.log(`I am listening on port: ${PORT}`));