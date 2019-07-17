import { fixture, assert, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import '../paper-fab-menu.js';

describe('<paper-fab-menu>', function() {
  async function basicFixture() {
    // Note, keep text node in this fixture (empty text node)
    return (await fixture(`<paper-fab-menu icon="add">
    <paper-fab mini title="Polymer" icon="polymer"></paper-fab>
    <paper-fab mini title="Favorites" icon="star"></paper-fab>

    </paper-fab-menu>`));
  }

  async function noChildrenFixture() {
    return (await fixture(`<paper-fab-menu icon="add"></paper-fab-menu>`));
  }

  describe('Basics', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Children are hidden', () => {
      const nodes = element.querySelectorAll('paper-fab');
      assert.equal(nodes[0].className.indexOf('opened'), -1);
    });

    it('Children are initially processed', () => {
      const nodes = element.querySelectorAll('paper-fab');
      assert.equal(nodes[0].getAttribute('role'), 'menuitem');
    });

    it('Added child is processed', async () => {
      const div = document.createElement('div');
      element.appendChild(div);
      await aTimeout(120);
      assert.equal(div.getAttribute('role'), 'menuitem');
      assert.equal(div.getAttribute('aria-hidden'), 'true');
    });
  });

  describe('toggle()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Toggles "opened" state', () => {
      element.toggle();
      assert.isTrue(element.opened);
    });
  });

  describe('_testOpen()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Clears __closingDebouncer', () => {
      element.opened = true; // it's just for coverage
      element.__closingDebouncer = 123;
      element._testOpen();
      assert.isUndefined(element.__closingDebouncer);
    });

    it('Clears timeout', () => {
      element.__closingDebouncer = 123;
      const spy = sinon.spy(window, 'clearTimeout');
      element._testOpen();
      window.clearTimeout.restore();
      assert.isTrue(spy.called);
    });

    it('Opens the menu', () => {
      element._testOpen();
      assert.isTrue(element.opened);
    });
  });

  describe('_testClose()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets __closingDebouncer', (done) => {
      element.opened = true;
      element._testClose();
      assert.typeOf(element.__closingDebouncer, 'number');
      setTimeout(() => done(), 20);
    });

    it('Does nothing when __closingDebouncer is already set', () => {
      element.__closingDebouncer = 1;
      element._testClose();
      assert.equal(element.__closingDebouncer, 1);
    });

    it('Closes the menu', async () => {
      element.opened = true;
      element._testClose();
      await aTimeout();
      assert.isFalse(element.opened);
    });

    it('Clears __closingDebouncer', async () => {
      element.opened = true;
      element._testClose();
      await aTimeout();
      assert.isUndefined(element.__closingDebouncer);
    });
  });

  describe('_detectClick()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Opens the element when the click is on the element', () => {
      element.click();
      assert.isTrue(element.opened);
    });

    it('Closes the element when opened and click is outside the element', () => {
      element.opened = true;
      document.body.click();
      assert.isFalse(element.opened);
    });

    it('Does nothing when not opened (outside click)', () => {
      document.body.click();
      assert.isUndefined(element.opened);
    });

    it('Does nothing when opened (element click)', () => {
      element.opened = true;
      element.click();
      assert.isTrue(element.opened);
    });

    it('Does nothing when clicked on child element', () => {
      element.opened = true;
      element.querySelector('paper-fab').click();
      assert.isTrue(element.opened);
    });
  });

  describe('_nodesAddedHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when no argument', () => {
      // Coverage
      element._nodesAddedHandler();
    });

    it('Does nothing when empty argument', () => {
      // Coverage
      element._nodesAddedHandler([]);
    });

    it('Adds "role" attribute to a node', () => {
      const node = document.createElement('div');
      element._nodesAddedHandler([node]);
      assert.equal(node.getAttribute('role'), 'menuitem');
    });

    it('Adds "aria-hidden" attribute to a node', () => {
      const node = document.createElement('div');
      element._nodesAddedHandler([node]);
      assert.equal(node.getAttribute('aria-hidden'), 'true');
    });

    it('Ignores non-element nodes', () => {
      const node = document.createElement('div');
      const txt = document.createTextNode('test');
      element._nodesAddedHandler([txt, node]);
      // no error on setting attribute on text node.
    });
  });

  describe('_processInitialNodes()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Nodes added declaratively have role attribute', () => {
      const node = element.querySelector('paper-fab');
      assert.equal(node.getAttribute('role'), 'menuitem');
    });

    it('Nodes added declaratively have aria-hidden attribute', () => {
      const node = element.querySelector('paper-fab');
      assert.equal(node.getAttribute('aria-hidden'), 'true');
    });
  });

  describe('_updateDelay()', () => {
    let element;
    let children;
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout();
      children = element.querySelectorAll('paper-fab');
    });

    it('Sets transitionDelay on each child', () => {
      element._updateDelay(children);
      assert.equal(children[0].style.transitionDelay, '25ms');
      assert.equal(children[1].style.transitionDelay, '75ms');
    });

    it('Adds "opened" class when opened', () => {
      element._updateDelay(children, true);
      assert.isTrue(children[0].classList.contains('opened'));
      assert.isTrue(children[1].classList.contains('opened'));
    });

    it('Updates aria-hidden attribute', () => {
      element._updateDelay(children, true);
      assert.equal(children[0].getAttribute('aria-hidden'), 'false');
      assert.equal(children[1].getAttribute('aria-hidden'), 'false');
    });

    it('Returns delay time', () => {
      const result = element._updateDelay(children, true);
      assert.equal(result, 125);
    });

    it('Removes opened class when closed state', () => {
      children[0].classList.add('opened');
      children[1].classList.add('opened');

      element._updateDelay(children, false);
      assert.isFalse(children[0].classList.contains('opened'));
      assert.isFalse(children[1].classList.contains('opened'));
    });

    it('Updates aria-hidden attribute when closed state', () => {
      children[0].setAttribute('aria-hidden', 'false');
      children[1].setAttribute('aria-hidden', 'false');

      element._updateDelay(children, false);
      assert.equal(children[0].getAttribute('aria-hidden'), 'true');
      assert.equal(children[1].getAttribute('aria-hidden'), 'true');
    });
  });

  describe('_openedTimeout()', () => {
    let element;
    beforeEach(async () => {
      element = await noChildrenFixture();
    });

    it('Sets childrenVisible to false when closed', async () => {
      element.opened = true;
      await aTimeout();
      element._openedTimeout([], false);
      await aTimeout(25);
      assert.isFalse(element.childrenVisible);
    });

    it('Keeps childrenVisible when opened', async () => {
      element.childrenVisible = true;
      element._openedTimeout([], true);
      await aTimeout(25);
      assert.isTrue(element.childrenVisible);
    });
  });

  describe('a11y', () => {
    a11ySuite('Normal state', `<paper-fab-menu icon="add">
    <paper-fab mini title="Polymer" icon="polymer"></paper-fab>
    <paper-fab mini title="Favorites" icon="star"></paper-fab>
    </paper-fab-menu>`);

    a11ySuite('Opened state', `<paper-fab-menu icon="add" opened>
    <paper-fab mini title="Polymer" icon="polymer"></paper-fab>
    <paper-fab mini title="Favorites" icon="star"></paper-fab>
    </paper-fab-menu>`);
  });
});
