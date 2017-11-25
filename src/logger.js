const bunyan = require('bunyan')
const PrettyStream = require('bunyan-prettystream')

const stream = new PrettyStream()
stream.pipe(process.stdout)

var logger = bunyan.createLogger({
  name: 'artemis',
  streams: [{ stream }]
})

module.exports = logger
