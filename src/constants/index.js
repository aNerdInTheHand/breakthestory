const stories = require('./stories')

module.exports = {
  gameStates: {
    main: 'main',
    prestart: 'prestart',
    setup: 'setup'
  },
  stories,
  randomNumber: () => Math.floor(Math.random() * 100)
}