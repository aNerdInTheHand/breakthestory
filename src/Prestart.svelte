<script>
  import C from './constants'
  import { gameState } from './stores'
</script>

<div>
  <h1>Break The Story</h1>
  <p>You play as an aspiring football journalist aiming to make a name for yourself.</p>
  <p>
    You will be presented with stories from a whole range of people,
    from online punters who've seen star players in motorway service stations to players
    themselves. Just make sure you verify your sources...
  </p>
  <p>
    Once you have a story, you can either try and sell it to a tabloid or broadsheet newspaper,
    or break it yourself on social media. The more credible stories you break, the more likely
    respectable publications are to buy your latest gossip. The more followers you gain on
    social media, the more respect you'll gain for breaking news. But remember, the bigger you
    are, the harder you fall, so make sure you're confident in your facts before publishing.
  </p>
</div>

<div>
  <button on:click={() => gameState.update(g => g = C.gameStates.setup)}>
    Let's get started
  </button>
</div>

<style>
  div {
    align-content: center;
    align-items: center;
    width: 100%;
  }

  button {
    border-radius: 1rem;
    height: 2.5rem;
    max-width: 200px;
  }

  @media (min-width: 640px) {
    div {
      font-size: large;
    }
    button {
      border-radius: 1rem;
      height: 3.5rem;
      max-width: 250px;
    }
  }
</style>