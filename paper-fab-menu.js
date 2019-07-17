/**
@license
Copyright 2018 Pawel Psztyc, The ARC team

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-fab/paper-fab.js';
/**
 * Material design:
 * [Floating Action Button](https://www.google.com/design/spec/components/buttons-floating-action-button.html)
 *
 * A floating action button represents the primary action in an application.
 *
 * Use the `<paper-fab-menu>` to display menu-like fab buttons and to promote actions.
 *
 * ### Example
 *
 * ```html
 * <paper-fab-menu color="teal" icon="add">
 *  <paper-fab mini icon="star"></paper-fab-menu-item>
 *  <paper-fab mini icon="star"></paper-fab-menu-item>
 *  <paper-fab mini icon="star"></paper-fab-menu-item>
 * </paper-fab-menu>
 * ```
 *
 * ### Styling
 * Style the menu using `<paper-fab>` variables.
 *
 * The element uses `--paper-fab-menu-background-color` variable to set a
 * background color or the main `<paper-fab>` element.
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 */
class PaperFabMenu extends LitElement {
  static get styles() {
    return css`:host {
      width: 60px;
    }

    .main-items ::slotted(a) {
      display: block;
      text-decoration: none;
    }

    .main-items ::slotted(*) {
      margin: 4px;
      transition: 200ms transform cubic-bezier(0.165, 0.84, 0.44, 1);
      transform: scale(0);
    }

    .main-items ::slotted(.opened) {
      transform: scale(1) !important;
    }

    .main-items {
      display: flex;
      flex-direction: column;
      flex: 1;
      flex-basis: 0.000000001px;
      align-self: center;
      flex-basis: 0%;
    }

    .main-items.fix-safari {
      flex-basis: auto;
    }

    .menu-fab-button {
      display: flex;
      flex-direction: column;
      align-self: center;
    }

    .paper-fab-menu-container {
      display: flex;
      flex-direction: column;
    }

    :host(:not([childrenvisible])) .main-items {
      display: none;
    }

    paper-fab {
      background-color: var(--paper-fab-menu-background-color, var(--accent-color));
      transition: 200ms transform;
      transform : rotate(0deg);
    }

    :host([opened]) paper-fab {
      transform : rotate(45deg);
    }`;
  }

  render() {
    const { icon, opened } = this;
    return html`<div class="paper-fab-menu-container">
      <div class="main-items">
        <slot id="items" slot="content"></slot>
      </div>
      <div class="menu-fab-button">
        <paper-fab tabindex="0" .icon="${icon}" ?opened="${opened}"></paper-fab>
      </div>
    </div>`;
  }

  static get properties() {
    return {
      // True when the menu is opened.
      opened: { type: Boolean, reflect: true },
      // The icon to render. It's binded to `paper-fab`'s icon property.
      icon: String,
      // If true then the children container is displayed.
      childrenVisible: {
        type: Boolean,
        reflect: true
      }
    };
  }

  get opened() {
    return this._opened;
  }

  set opened(value) {
    if (this._setChanged('opened', value)) {
      this._openedChanged(value);
      // Polymer copatibility
      this.dispatchEvent(new CustomEvent('opened-changed', { detail: { value } }));
    }
  }

  constructor() {
    super();
    this._detectClick = this._detectClick.bind(this);
    this._testOpen = this._testOpen.bind(this);
    this._testClose = this._testClose.bind(this);

    const config = { attributes: false, childList: true, subtree: false };
    this._observer = new MutationObserver((mutations) => this._childrenUpdated(mutations));
    this._observer.observe(this, config);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mouseover', this._testOpen);
    this.addEventListener('mouseout', this._testClose);
    document.body.addEventListener('click', this._detectClick);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menubar');
    }
    this.setAttribute('aria-haspopup', 'true');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseover', this._testOpen);
    this.removeEventListener('mouseout', this._testClose);
    document.body.removeEventListener('click', this._detectClick);
  }

  firstUpdated() {
    this._processInitialNodes();
    this._openedChanged(this.opened);
  }

  _childrenUpdated(mutations) {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        this._nodesAddedHandler(mutation.addedNodes);
      }
    }
  }

  _setChanged(prop, value) {
    const key = `_${prop}`;
    const old = this[key];
    if (value === old) {
      return false;
    }
    this[key] = value;
    if (this.requestUpdate) {
      this.requestUpdate(prop, old);
    }
    return true;
  }

  // Toogles the menu
  toggle() {
    this.opened = !this.opened;
  }

  /**
   * Tests if the menu should be opened and opens it if nescesary.
   */
  _testOpen() {
    if (this.__closingDebouncer) {
      clearTimeout(this.__closingDebouncer);
      this.__closingDebouncer = undefined;
    }
    if (!this.opened) {
      this.opened = true;
    }
  }

  /**
   * Tests if the menu should be closed and closes it if nescesary
   */
  _testClose() {
    if (this.__closingDebouncer) {
      return;
    }
    this.__closingDebouncer = setTimeout(() => {
      this.opened = false;
      this.__closingDebouncer = undefined;
    });
  }

  /**
   * Renders the mennu opened / closed
   * @param {Boolean} opened Current menu state
   */
  _openedChanged(opened) {
    const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
    if (!slot) {
      return;
    }
    const children = Array.from(slot.assignedNodes());
    if (opened) {
      children.reverse();
      this.childrenVisible = true;
    }
    setTimeout(() => this._openedTimeout(children, opened));
  }

  _openedTimeout(children, opened) {
    const delayTime = this._updateDelay(children, opened);
    if (!opened) {
      setTimeout(() => {
        this.childrenVisible = false;
      }, delayTime);
    }
  }
  /**
   * Updates animation delay time attribute in distributed children.
   * @param {Array<Element>} children
   * @param {Boolean} opened
   * @return {Number} Time of the latest delay set on the children animations.
   */
  _updateDelay(children, opened) {
    let time = 25;
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      if (child.nodeType !== 1) {
        continue;
      }
      child.style.transitionDelay = time + 'ms';
      if (opened) {
        child.classList.add('opened');
        child.setAttribute('aria-hidden', 'false');
      } else {
        child.classList.remove('opened');
        child.setAttribute('aria-hidden', 'true');
      }
      time += 50;
    }
    return time;
  }
  /**
   * Closes menu when click is detected outside this control.
   * @param {MouseEvent} e
   */
  _detectClick(e) {
    let path = e.path;
    if (!path && e.composedPath) {
      path = e.composedPath();
    }
    if (!path || !path.length) {
      return;
    }
    let isMainButton = false;
    for (let i = 0, len = path.length; i < len; i++) {
      if (path[i] === this) {
        isMainButton = true;
      }
    }
    if (isMainButton) {
      if (!this.opened) {
        this.opened = true;
      }
      return;
    }
    if (this.opened) {
      this.opened = false;
    }
  }
  /**
   * MutationObserver initialized in the constructor does not
   * triggers changes when the element is initialized. This
   * function processes nodes set up declaratively when the element is still
   * initializing.
   */
  _processInitialNodes() {
    const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
    const children = slot.assignedNodes();
    this._nodesAddedHandler(children);
  }
  /**
   * Adds `role` and `aria-hidden` attribbutes to passed nodes.
   * @param {Array<Node>} nodes List of nodes to process.
   */
  _nodesAddedHandler(nodes) {
    if (!nodes || !nodes.length) {
      return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (node.nodeType !== 1) {
        continue;
      }
      node.setAttribute('role', 'menuitem');
      node.setAttribute('aria-hidden', 'true');
    }
  }
}
window.customElements.define('paper-fab-menu', PaperFabMenu);
