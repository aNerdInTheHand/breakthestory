<script>
  import {
    activeTip,
    newSource,
    sources
  } from './store'
  import Scores from './main/Scores.svelte'
  import Source from './main/Source.svelte'
  import Sources from './main/Sources.svelte'
  import Tip from './main/Tip.svelte'
  console.log($activeTip)
  const tipActive = $activeTip !== {}
</script>

<div>
  <h1 class='title'>Break The Story</h1>
  
  <Scores />

  {#if $newSource}
    <Source />
  {/if}

  {#if $activeTip}
    <Tip />
  {/if}

  {#if $sources.length > 0}
    <Sources />
  {/if}

  <div class='debug'>
    <h2>Store contents</h2>
    <ul>
      <li>activeTip: {tipActive}</li>
      <li>newSource: {$newSource.name}</li>
      {#each $sources as source}
        <li>{source.name}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .debug {
    border: 1px solid black;
  }
</style>