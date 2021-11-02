import { writable } from 'svelte/store'

const name = writable('Bort')
const socialHandle = writable('borty69')

export default {
  name,
  socialHandle
}