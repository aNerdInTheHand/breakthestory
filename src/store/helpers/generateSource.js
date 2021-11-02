import C from '../../constants'
import Chance from 'chance'
const chance = new Chance()
const name = chance.name()
const reliability = chance.natural({ min: 1, max: 100 })
export default () => {
  const source = {
    name,
    reliability
  }

  return source
}