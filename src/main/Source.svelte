<script>
  import {
    activeTip,
    newSource,
    sources
  } from '../store'
  import generateTip from '../store/helpers/generateTip'
  console.log(generateTip)
  const acknowledge = () => {
    const tip = generateTip(newSource)
    console.log('Tip:\n', tip)
    activeTip.update(t => t = tip)
    sources.update(s => s = s.concat(newSource))
    newSource.update(s => s = false)
  }
</script>

<div class='new-source'>
  <h2>You have a new source!</h2>
  <ul>
    <li>Name: {$newSource.name}</li>
    <li>Occupation: {$newSource.occupation}</li>
  </ul>
</div>

<div>
  <button on:click={() => acknowledge()}>
    Acknowledge
  </button>
</div>

<style>
  .new-source {
    border: 0.7rem solid #bada55;
    border-radius: 0.5rem;
  }
</style>