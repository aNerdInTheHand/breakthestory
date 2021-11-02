<script>
  import { sources } from '../store'
</script>

<div class='sources-source'>
  {#each $sources as source}
    <p>{source.name}</p>
    <p>{source.reliability}</p>
  {/each}
</div>

<style>
  .sources-source {
    border: 1px solid black;
  }
</style>