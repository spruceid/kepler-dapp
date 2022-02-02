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
    height: 100%;
    margin: 0px;
    padding: 0px;
    font-size: 16px;
    background: #ecf2fe;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    @apply text-white font-satoshi;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-extrabold;
    @apply text-white;
    @apply font-satoshi;
  }

  h1 {
    font-size: 84px;
    line-height: 129px;
    letter-spacing: -4.5%;
  }

  h2 {
    font-size: 66px;
    line-height: 101px;
    letter-spacing: -3%;
  }

  h3 {
    font-size: 52px;
    line-height: 80px;
    letter-spacing: -1.5%;
  }

  h4 {
    font-size: 48px;
    line-height: 63px;
    letter-spacing: -1%;
  }

  h5 {
    font-size: 32px;
    line-height: 49px;
    letter-spacing: -0.5%;
  }

  h6 {
    font-size: 24px;
    line-height: 37px;
    letter-spacing: -0.5%;
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

  tr.hover-show td div div.hover-show {
    visibility: hidden;
  }

  tr.hover-show:hover td div div.hover-show {
    visibility: visible;
  }
	
	.tab-list .selected {
		@apply bg-green;
	}
  .tab-list button {
    @apply rounded-2xl text-white h-10.5 py-2 px-5 flex items-center justify-center min-w-26;
  }
  input::focus {
    outline: none!important;
  }
</style>

<script lang="ts">
  import { Router, Route } from 'svelte-navigator';
  import { Splash, Home } from './routes';

  import { CaptchaModal, FileUploadModal } from 'src/modals';
  export let basepath = '/';
</script>

<CaptchaModal />
<!-- <FileUploadModal /> -->

<Router basepath={basepath}>
  <Route path="/index.html">
    <Splash />
  </Route>
  <Route path="/app">
    <Home />
  </Route>
</Router>
