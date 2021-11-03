<script>
  import {
    earnings,
    followers
  } from '../store'
</script>

<div class='scores-container'>
  <div class='score-earnings'>
    <p>Earnings: £{$earnings}</p>
  </div>
  <div class='score-followers'>
    <p>Followers: {$followers}</p>
  </div>
</div>

<style>
  .scores-container {
    display: inline-flex;
  }
</style>