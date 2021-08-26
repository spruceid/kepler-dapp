<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .tooltip {
    @apply invisible absolute;
  }

  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
  html,
  body {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    margin: 0px;
    padding: 0px;
    font-size: 16px;
    background: #ecf2fe;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 600;
    color: #222222;
  }

  body {
    color: #222222;
  }

  a {
    text-decoration: none;
    color: #1a75ff;
  }
  td,
  th {
    font-family: 'Inter';
    font-weight: 400;
  }

  pre {
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }

  /**
  Custom scrollbar settings
  */
  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: #ccc;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #888;
  }
  ::-webkit-scrollbar {
    height: 6px;
    border-radius: 8px;
    width: 6px;
    background-color: #ccc;
  }
</style>

<script lang="ts">
  import { Router, Route } from 'svelte-navigator';
  import { Splash } from './routes';
</script>

<Router>
  <Route path="/">
    <Splash />
  </Route>
</Router>
