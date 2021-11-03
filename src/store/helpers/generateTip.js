const generateTip = source => {
  console.log('here')
  console.log(source)
  const tip = {
    detail: 'Baconface is moving to Lorem Ipsum United',
    source,
    isTrue: true,
    proof: 'Whatsapp screenshot'
  }
  console.log('Tip:\n', tip)
  return tip
}

export default generateTip