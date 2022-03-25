import { writable, derived } from 'svelte/store'
import C from '../constants'
import details from './details'
import generateSource from './helpers/generateSource'
import initGenerateTip from './helpers/generateTip'
import Chance from 'chance'
const chance = new Chance()

const firstSource = generateSource()

// scores
export const earnings = writable(0)
export const followers = writable(10)
export const storiesSoldBroadsheet = writable(0)
export const storiesSoldMagazine = writable(0)
export const storiesSoldTabloid = writable(0)
// end scores

export const activeTip = writable('')
export const randomNumber = writable(C.randomNumber())
export const gameState = writable(C.gameStates.prestart)
export const generateTip = initGenerateTip({ C, chance })
export const name = details.name
export const socialHandle = details.socialHandle
export const newSource = writable(generateSource())
export const sources = writable([firstSource])

export const greeting = derived(
	name,
	$name => `Hi ${$name}, I'm dad!`
);
