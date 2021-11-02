<script>
  import C from './constants'
  import {
    gameState,
    name,
    socialHandle
  } from './store/store'
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

  <button
    disabled={!$name || !socialHandle}
    on:click={() => gameState.update(C.gameStates.inGame)}
    type='submit'
  >
    Start
  </button>
</div>
