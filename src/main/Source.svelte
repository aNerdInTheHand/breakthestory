<script>
  import { newSource } from '../store'
</script>

<div class='new-source'>
  <h2>You have a new source!</h2>
  <ul>
    <li>Name: {$newSource.name}</li>
    <li>Occupation: {$newSource.occupation}</li>
  </ul>
</div>

<div>
  <button on:click={() => newSource.update(s => s = false)}>
    Acknowledge
  </button>
</div>

<style>
  .new-source {
    border: 0.7rem solid #bada55;
    border-radius: 0.5rem;
  }
</style>