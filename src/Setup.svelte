<script>
  import C from './constants'
  import {
    gameState,
    name,
    socialHandle,
    sources
  } from './store'
</script>

<div>
  <h2>Fill in your details:</h2>
  <div class='form-container'>
    <p>What's your name?</p>
    <input type='text' bind:value={$name} />
  </div>
  
  <div class='form-container'>
    <p>What's your social handle?</p>
    @<input type='text' bind:value={$socialHandle} />
  </div>

  {#each $sources as source}
    <p>{source.name}</p>
    <p>{source.reliability}</p>
  {/each}

  <button
    disabled={!$name || !socialHandle}
    on:click={() => gameState.update(g => g = C.gameStates.main)}
  >
    Start
  </button>
</div>
