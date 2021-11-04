import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    basepath: process.env.ASSET_PATH
  }
});

export default app;
