// ==UserScript==
// @name        WBA chunks sorter
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:8888/
// @match       file:///*wba-report*
// @grant       none
// @version     1.0
// @author      -
// @description Sort chunks on Webpack bundle analyzer result page
// ==/UserScript==

sortChunks();

async function sortChunks() {
  await sleep(3000);
  runAfterCloseSidebar(() => document.querySelector('.Sidebar__toggleButton').click());
  await sleep(300);
  document.querySelector('.Sidebar__pinButton').click();
  
  const list = document.createElement('div')
  const items = document.querySelectorAll('.CheckboxList__item');
  
  [...items].sort((a, b) => {
    const textA = a.querySelector('.Checkbox__itemText').innerText;
    const textB = b.querySelector('.Checkbox__itemText').innerText;

    if (textA.includes('All')) return -1;
    if (textB.includes('All')) return 1;
    if (textA.includes('/main')) return -1;
    if (textB.includes('/main')) return 1;
    if (textA.includes('/runtime-main')) return 1;
    if (textB.includes('/runtime-main')) return -1;

    const re = /static\/js\/([0-9]+)\./;
    const numberA = +textA.match(re)[1];
    const numberB = +textB.match(re)[1];

    return numberA - numberB;
  }).forEach(item => {
    list.appendChild(item);
  });

  const container = document.querySelector('.CheckboxList__container');

  container.replaceChild(list, container.lastChild);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAfterCloseSidebar(fn) {
  if (!document.querySelector('.Sidebar__pinButton')) {
    fn();
  } else {
    await sleep(300);
    runAfterCloseSidebar(fn);
  }
}
