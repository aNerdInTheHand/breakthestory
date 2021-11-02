<script>
  import { newSource, sources } from './store'
  import Source from './main/Source.svelte'
  import Sources from './main/Sources.svelte'
</script>

<div>
  <h1 class='title'>Break The Story</h1>
  {#if $newSource}
    <Source />
  {/if}

  {#if $sources.length > 0}
    <Sources />
  {/if}

  <p>Other stuff...</p>
</div>