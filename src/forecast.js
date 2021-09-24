const request = require('request')
const chalk = require('chalk')

const forecast = (lat, log, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=0bb888cf802b7c1fcb3a7b9d45f8ffee&query=${lat},${log}`
    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('Erroneous errors.', undefined)
        } else if (body.error) {
            callback(chalk.bgRed(body.error.info), undefined)
        } else {
            const data = body.current
            callback(undefined, `${body.location.name}, ${body.location.country}. ${data.weather_descriptions[0]}. It is currently ${data.temperature} degrees out. It feels like ${data.feelslike} degrees out.`)
        }
    })
}

module.exports = forecast