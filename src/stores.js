import { writable, derived } from 'svelte/store';
import C from './constants'

export const babyName = writable('')
export const chance = writable(C.randomNumber())
export const feeling = writable('')
export const gameState = writable(C.gameStates.prestart)
export const name = writable('')
export const pronoun = writable(C.pronouns.neutral)

export const greeting = derived(
	name,
	$name => `Hi ${$name}, I'm dad!`
);

export const jokeGreeting = derived(
  feeling,
  $feeling => `Hi ${$feeling.toLocaleLowerCase()}, I'm dad!`
)