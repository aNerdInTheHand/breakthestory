<script>
  import { newSource, sources } from './store'
  import Source from './main/Source.svelte'
</script>

<div>
  <h1 class='title'>Break The Story</h1>
  {#if $newSource}
    <Source />
  {/if}

  <p>Other stuff...</p>
</div>