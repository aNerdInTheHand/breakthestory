import { writable } from 'svelte/store'

const name = writable('')
const socialHandle = writable('')

export default {
  name,
  socialHandle
}