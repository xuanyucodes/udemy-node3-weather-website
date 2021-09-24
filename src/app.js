const express = require('express') 
const path = require('path') // to manipulate paths
const hbs = require('hbs')
const geocode = require('./geocode')
const forecast = require('./forecast')

const app = express() // initialise. no args needed.
const port = process.env.PORT || 3000 // port is either 3000 (locally) OR process.env.PORT that Heroku sets

// path definitions
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve. this makes the public folder the root folder
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Meade'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Andrew Meade',
        helpText: 'This is some helpful text.'
    })
})

app.get('/weather', (req, res) => { // a website has many routes. app.get(path, callback_fn) allows us to configure what the server should do when someone tries a specific path
    if (!req.query.address) {
        return res.send({
            error: 'You need to provide an address!'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                location,
                forecast,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    // res.send('Help article not found')
    res.render('404', {
        title: '404',
        name: 'Andrew Meade',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => { // 404 handling
    // res.send('My 404 page')
    res.render('404', {
        title: '404',
        name: 'Andrew Meade',
        errorMessage: 'Page not found.'
    })
})

// run it
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})

// https://xy-weather-application.herokuapp.com/