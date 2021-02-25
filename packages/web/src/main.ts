import App from './App.svelte';
import './utility/connectionsPinger';
import './commands/stdCommands';

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
});

export default app;
