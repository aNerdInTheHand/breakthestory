<script>
  import { activeTip } from '../store'
</script>

<div class='active-tip'>
  <h2>New tip</h2>
  <p>A source has a new tip for you...</p>
  <p class='tip-source'>
    Source: {$activeTip}
    Tips given: {$activeTip}
  </p>
  <p class='tip-detail'>
    {$activeTip.detail}
    {$activeTip.proof}
  </p>
</div>

<style>
  .active-tip {
    border: 1rem solid #bada55;
  }
</style>