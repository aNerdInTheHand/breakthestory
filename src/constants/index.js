const questions = require('./questions')

module.exports = {
  gameStates: {
    main: 'main',
    prestart: 'prestart',
    setup: 'setup'
  },
  questions,
  randomNumber: () => Math.floor(Math.random() * 100)
}