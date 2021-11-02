import { writable, derived } from 'svelte/store'
import C from '../constants'
import details from './details'
import generateSource from './helpers/generateSource'

const firstSource = generateSource()
export const chance = writable(C.randomNumber())
export const feeling = writable('')
export const gameState = writable(C.gameStates.prestart)
export const name = details.name
export const socialHandle = details.socialHandle
export const newSource = writable(generateSource())
export const sources = writable([firstSource])

export const greeting = derived(
	name,
	$name => `Hi ${$name}, I'm dad!`
);

export const jokeGreeting = derived(
  feeling,
  $feeling => `Hi ${$feeling.toLocaleLowerCase()}, I'm dad!`
)