import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { PageObject, selector } from 'qunit-dom-page-object/test-support';

module('Integration | page object', function(hooks) {
  setupRenderingTest(hooks);

  test('page objects provide the correct root', async function() {
    class Page extends PageObject {
      target = selector('[data-target]')
    }
    let page = new Page();

    let div = document.createElement('div');
    div.setAttribute('data-target', '');

    document.body.append(div);
    try {
      await render(hbs`<div data-target>Hello world</div>`);
      page.target.assert.exists({ count: 1});
      page.target.assert.hasText('Hello world');
    } finally {
      div.remove();
    }
  });

  test('selector nodes match one element', async function() {
    class Page extends PageObject {
      target = selector('[data-target]')
    }
    let page = new Page();

    await render(hbs`
      <div></div>
      <div data-target>Hello world</div>
    `);
    page.target.assert.exists({ count: 1});
    page.target.assert.hasText('Hello world');
  });

  test('selector nodes match multiple element', async function() {
    class Page extends PageObject {
      target = selector('[data-target]')
    }
    let page = new Page();

    await render(hbs`
      <div></div>
      <div data-target></div>
      <div data-target></div>
    `);
    page.target.assert.exists({ count: 2 });
  });

  test('indexing works', async function() {
    class Page extends PageObject {
      target1 = selector('[data-target1]')
      target2 = selector('[data-target2]')
    }
    let page = new Page();

    await render(hbs`
      <div data-target1>One</div>
      <div data-target2>Two</div>
      <div data-target1>Three</div>
      <div data-target2>Four</div>
    `);

    page.target1[0].assert.exists();
    page.target1[0].assert.hasText('One');
    page.target1[1].assert.exists();
    page.target1[1].assert.hasText('Three');
    page.target2[0].assert.exists();
    page.target2[0].assert.hasText('Two');
    page.target2[1].assert.exists();
    page.target2[1].assert.hasText('Four');
  });

  test('nesting works', async function() {
    class Page extends PageObject {
      target1 = selector('[data-target1]', class {
        target2 = selector('[data-target2]')
      })
    }
    let page = new Page();

    await render(hbs`
      <div data-target1>
        <div data-target2>Hello world</div>
      </div>
      <div data-target2></div>
    `);

    page.target1.target2.assert.exists({ count: 1 });
    page.target1.target2.assert.hasText('Hello world');
  });

  test('nesting and indexing work', async function() {
    class Page extends PageObject {
      target1 = selector('[data-target1]', class {
        target2 = selector('[data-target2]', class {
          target3 = selector('[data-target3]')
        })
      })
    }
    let page = new Page();

    await render(hbs`
      <div data-target1 id="a">
        <div data-target2 id="a.a">
          <div data-target3 id="a.a.a"></div>
          <div data-target3 id="a.a.b"></div>
        </div>
        <div data-target2 id="a.b">
          <div data-target3 id="a.b.a"></div>
        </div>
      </div>
      <div data-target1 id="b">
        <div data-target2 id="b.a">
          <div data-target3 id="b.a.a"></div>
          <div data-target3 id="b.a.b"></div>
        </div>
      </div>
    `);

    page.target1.assert.exists({ count: 2 });
    page.target1[0].assert.hasAttribute('id', 'a');
    page.target1[1].assert.hasAttribute('id', 'b');

    page.target1[0].target2.assert.exists({ count: 2 });
    page.target1[0].target2[0].assert.hasAttribute('id', 'a.a');
    page.target1[0].target2[1].assert.hasAttribute('id', 'a.b');

    page.target1[0].target2[0].target3.assert.exists({ count: 2 });
    page.target1[0].target2[0].target3[0].assert.hasAttribute('id', 'a.a.a');
    page.target1[0].target2[0].target3[1].assert.hasAttribute('id', 'a.a.b');

    page.target1[0].target2[1].target3.assert.exists({ count: 1 });
    page.target1[0].target2[1].target3[0].assert.hasAttribute('id', 'a.b.a');

    page.target1[1].target2.assert.exists({ count: 1 });
    page.target1[1].target2[0].assert.hasAttribute('id', 'b.a');

    page.target1[1].target2[0].target3.assert.exists({ count: 2 });
    page.target1[1].target2[0].target3[0].assert.hasAttribute('id', 'b.a.a');
    page.target1[1].target2[0].target3[1].assert.hasAttribute('id', 'b.a.b');
  });

  test('non-existent dom nodes work', async function() {
    class Page extends PageObject {
      target1 = selector('[data-target1]', class {
        target2 = selector('[data-target2]')
      })
      target4 = selector('[data-target4]', class {
        target5 = selector('[data-target5]')
      })
    }
    let page = new Page();

    await render(hbs`
      <div data-target4>
        <div data-target5></div>
      </div>
    `);

    page.target1.assert.doesNotExist();
    page.target1[1].assert.doesNotExist();
    page.target1.target2.assert.doesNotExist();
    page.target1.target2[1].assert.doesNotExist();
    page.target1[1].target2[1].assert.doesNotExist();

    // selectors that do match, but index too high
    page.target4[1].assert.doesNotExist();
    page.target4.target5[1].assert.doesNotExist();
    page.target4[0].target5[1].assert.doesNotExist();
    page.target4[1].target5[1].assert.doesNotExist();
  });

  test('the element property works', async function(assert) {
    class Page extends PageObject {
      target1 = selector('[data-target1]', class {
        target2 = selector('[data-target2]', class {
          target3 = selector('[data-target3]')
        })
      })
    }
    let page = new Page();

    await render(hbs`
      <div data-target1 id="a">
        <div data-target2 id="a.a"></div>
        <div data-target2 id="a.b"></div>
      </div>
    `);

    assert.equal(page.target1.element.id, 'a');
    assert.equal(page.target1[0].element.id, 'a');

    assert.equal(page.target1.target2.element.id, 'a.a');
    assert.equal(page.target1.target2[0].element.id, 'a.a');
    assert.equal(page.target1[0].target2[0].element.id, 'a.a');

    assert.equal(page.target1.target2[1].element.id, 'a.b');
    assert.equal(page.target1[0].target2[1].element.id, 'a.b');
  });

  test('extensions can provide properties, getters, and methods', async function(assert) {
    class Extension {
      button = selector('button')

      concatString = 'world'

      get concatMessage() {
        return `${this.element.getAttribute('message')} ${this.concatString}`;
      }

      async clickButton() {
        await click(this.button.element);
      }
    }

    class Page extends PageObject {
      target1 = selector('[data-target1]', class {
        target2 = selector('[data-target2]', Extension)
        target2Sub = selector('[data-target2]', class extends Extension {
          concatString = 'space'
        })
      })
    }
    let page = new Page();

    let onClickCallCount = 0;
    this.onClick = () => {
      onClickCallCount += 1;
    };

    await render(hbs`
      <div data-target1>
        <div data-target2 message="hello">
          <button type="button" {{on "click" this.onClick}}></button>
        </div>
      </div>
    `);

    assert.equal(page.target1.target2.concatString, 'world');
    assert.equal(page.target1.target2.concatMessage, 'hello world');
    await page.target1.target2.clickButton();
    assert.equal(onClickCallCount, 1);

    assert.equal(page.target1.target2Sub.concatString, 'space');
    assert.equal(page.target1.target2Sub.concatMessage, 'hello space');
    await page.target1.target2.clickButton();
    assert.equal(onClickCallCount, 2);
  });
});
