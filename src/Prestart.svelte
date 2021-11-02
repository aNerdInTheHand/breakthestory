<script>
  import C from './constants'
  import { gameState } from './store'
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
  <p>
    Before you start, some boring technical stuff:
  </p>
  <div>
    <ul>
      <li>
        You can't save your game - if you refresh your browser, you'll start a new game
      </li>
      <li>
        This site does not currently use cookies
      </li>
      <li>
        This site does not currently mine Dogecoin on your GPU
      </li>
      <li>
        If you're enjoying playing you can give me some money (link to follow)
      </li>
    </ul>
  </div>
</div>

<div>
  <button on:click={() => gameState.update(g => g = C.gameStates.setup)}>
    Let's get started
  </button>
</div>
