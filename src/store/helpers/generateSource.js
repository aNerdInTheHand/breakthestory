import C from '../../constants'
import Chance from 'chance'
const chance = new Chance()
const reliability = chance.natural({ min: 1, max: 100 })
export default () => {
  const source = {
    name: chance.name(),
    reliability
  }

  return source
}