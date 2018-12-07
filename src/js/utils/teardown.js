import { el } from './element';

export default function teardown(clearConsole) {
  return async function teardown() {
    clearConsole();
    
    const output = el.withFallback('.output');

    if (typeof ReactDOM !== 'undefined') {
      ReactDOM.unmountComponentAtNode(output.e);
    }

    output.content('<div class="hint">&lt;div id="output" /&gt;</div>');
  }
}