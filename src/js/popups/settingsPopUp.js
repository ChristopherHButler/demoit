/* eslint-disable max-len */
import Layout from 'layout-architect';
import createPopup from './popup';
import { LAYOUT_BLOCKS, DEFAULT_LAYOUT } from '../layout';
import { IS_PROD } from '../constants';

const generateIframe = url => `<iframe src="${ url }" style="display: block; width:100%; height: 400px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"></iframe>`;

export default function settingsPopUp(
  enableDownload,
  { layout, theme },
  dependenciesStr,
  onDepsUpdated,
  onGeneralUpdate,
  defaultTab,
  version
) {
  return new Promise(done => createPopup({
    defaultTab: defaultTab || 0,
    buttons: [
      'General',
      'Dependencies',
      'Export/Share',
      'About'
    ],
    content: [
      `
        <p>
          Theme:
          <select data-export="themePicker">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </p>
        <p class="mt1">Layout:</p>
        <div class="mb1" data-export="layoutArchitectContainer"></div>
        <button class="save" data-export="saveGeneral">Save</button>
      `,
      `
        <textarea class="dependencies-list" data-export="dependenciesTextarea"></textarea>
        <p><small>(Separate your dependencies by a new line)</small></p>
        <button class="save" data-export="saveDependenciesButton">Save</button>
      `,
      `
        <h2>Embed</h2>
        <textarea data-export="iframeTextarea">${ generateIframe(window.location.href) }</textarea>
        ${ IS_PROD ? `
          <h2 class="mt1">Download/Offline mode</h2>
          <p>The archive contains all the files that you need to run the app locally. Including your dependencies.</p>
          <button class="save" data-export="downloadButton">Download zip file</button>` : '' }
      `,
      `
        <p>
          v${ version }<br />
          On the web: <a href="https://poet.krasimir.now.sh" target="_blank">poet.krasimir.now.sh</a><br />
          GitHub repo: <a href="https://github.com/krasimir/poet.krasimir.now.sh.feedback/issues" target="_blank">github.com/krasimir/poet.krasimir.now.sh.feedback</a>
        </p>
      `
    ],
    cleanUp() {
      done();
    },
    onRender({
      closePopup,
      saveGeneral,
      dependenciesTextarea,
      saveDependenciesButton,
      themePicker,
      iframeTextarea,
      layoutArchitectContainer,
      downloadButton
    }) {
      // general settings
      if (layoutArchitectContainer && themePicker) {
        const la = Layout(layoutArchitectContainer.e, LAYOUT_BLOCKS, layout);

        themePicker.e.value = theme || 'light';
        saveGeneral.onClick(() => {
          onGeneralUpdate(themePicker.e.value, la.get() || DEFAULT_LAYOUT);
          closePopup();
        });
      }
      // share
      if (iframeTextarea) {
        iframeTextarea.selectOnClick();
      }
      if (downloadButton) {
        enableDownload(downloadButton);
      }
      // managing dependencies
      if (dependenciesTextarea && saveDependenciesButton) {
        dependenciesTextarea.prop('value', dependenciesStr);
        saveDependenciesButton.onClick(() => {
          onDepsUpdated(dependenciesTextarea.prop('value').split(/\r?\n/));
          closePopup();
        });
      }
    }
  }));
};
