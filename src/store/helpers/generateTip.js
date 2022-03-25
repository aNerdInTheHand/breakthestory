const generateTip = ({
  C,
  chance
}) => source => {
  const tip = {
    detail: `${chance.name({ gender: 'male' })} is moving to ${chance.city()} FC`,
    source: source,
    isTrue: true,
    proof: 'Whatsapp screenshot'
  }
  return tip
}

export default generateTip