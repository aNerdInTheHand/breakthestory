const questions = require('./questions')

module.exports = {
  feelings: ['- Pick one -', 'Awful', 'Could be better', 'Ok', 'Pretty good thanks', 'Amazing'],
  gameStates: {
    main: 'main',
    inGame: 'inGame',
    prestart: 'prestart',
    setup: 'setup'
  },
  pronouns: [
    'Female',
    'Male',
    'Neutral'
  ],
  questions,
  randomNumber: () => Math.floor(Math.random() * 100)
}