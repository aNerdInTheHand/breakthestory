<script>
  import C from '../constants'
  import {
    babyName,
    gameState,
    pronoun
  } from '../stores'
  console.log($pronoun)
</script>

<div>
  <h2>Let's get some key details.</h2>
  <p>What is the baby's name?</p>
  <input type='text' bind:value={$babyName} />

  <p>What pronoun would you like to use?</p>
  <select bind:value={$pronoun}>
    {#each C.pronouns as pronoun}
      <option value={pronoun}>
        {pronoun}
      </option>
    {/each}
  </select>

  <button
    disabled={!$babyName || !pronoun}
    on:click={() => gameState.update(C.gameStates.inGame)}
    type='submit'
  >
    Start
  </button>
</div>

<style>
  div {
    align-content: center;
    align-items: center;
    max-width: 300px;
  }
</style>