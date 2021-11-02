<script>
  import Main from './Main.svelte'
  import Prestart from './Prestart.svelte'
  import Setup from './Setup.svelte'
  import Start from './Start.svelte'
  export let C
  import {
    chance,
    gameState
  } from './store/store'
</script>

<main>
  {#if $gameState === C.gameStates.prestart}
    <Prestart/>
  {/if}

  {#if $gameState === C.gameStates.setup}
    <Setup/>
  {/if}

  {#if $gameState === C.gameStates.main}
    <Main/>
  {/if}

	<p class='footer'>Break The Story by aNerdInTheHand © 2021.</p>
</main>

<style>
	main {
    align-content: center;
    align-items: center;
    max-width: 400px;
		margin: 0 auto;
    padding: 1em;
		text-align: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: 800px; /* breaks centring */
		}
	}

  .footer {
    position: fixed;
    bottom: 0;
  }
</style>