[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/paper-fab-menu.svg)](https://www.npmjs.com/package/@advanced-rest-client/paper-fab-menu)

[![Build Status](https://travis-ci.org/advanced-rest-client/paper-fab-menu.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/paper-fab-menu)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@advanced-rest-client/paper-fab-menu)

# <paper-fab-menu>

Material design:
[Floating Action Button](https://www.google.com/design/spec/components/buttons-floating-action-button.html)

A floating action button represents the primary action in an application.

Use the `<paper-fab-menu>` to display menu-like fab buttons and to promote actions.

### Example

```html
<paper-fab-menu icon="add">
  <paper-fab mini title="Favorites" icon="star"></paper-fab>
  <paper-fab mini title="Refresh" icon="refresh"></paper-fab>
  <paper-fab mini title="Text label" label="D"></paper-fab>
</paper-fab-menu>
```

### In a LitElement template

```javascript
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/paper-fab-menu/paper-fab-menu.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <paper-fab-menu icon="add">
      <paper-fab mini title="Favorites" icon="star"></paper-fab>
      <paper-fab mini title="Refresh" icon="refresh"></paper-fab>
      <paper-fab mini title="Text label" label="D"></paper-fab>
    </paper-fab-menu>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Styling
Style the menu using `<paper-fab>` variables.

The element uses `--paper-fab-menu-background-color` variable to set a
background color or the main `<paper-fab>` element.

### Development

```sh
git clone https://github.com/@advanced-rest-client/paper-fab-menu
cd paper-fab-menu
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
