import Footer from './footer';

export default class Events {
  constructor(cardManager) {
    this.cardManager = cardManager;
    this.main = document.querySelector('main');
    this.doc = document.documentElement;
    this.allAdd = document.querySelectorAll('.add');
    this.addTodo = this.allAdd[0];
    this.addProgress = this.allAdd[1];
    this.addDone = this.allAdd[2];
    this.cardItemDel = undefined;
    this.clickMouseX = 0;
    this.clickMouseZ = 0;
    this.offsetElX = 0;
    this.offsetElZ = 0;
    this.actualElement = undefined;

    this.pressAdd = this.pressAdd.bind(this);
    this.mousedownMouse = this.mousedownMouse.bind(this);
    this.mouseupMouse = this.mouseupMouse.bind(this);
    this.positionSelect = this.positionSelect.bind(this);
    this.mousemoveMouse = this.mousemoveMouse.bind(this);
    this.mouseoverMouse = this.mouseoverMouse.bind(this);
    this.displayItemDel = this.displayItemDel.bind(this);
    this.delCard = this.delCard.bind(this);
    this.pressBtn = this.pressBtn.bind(this);
    this.insertElement = this.insertElement.bind(this);

    this.addTodo.addEventListener('click', this.pressAdd);
    this.addProgress.addEventListener('click', this.pressAdd);
    this.addDone.addEventListener('click', this.pressAdd);
    this.main.addEventListener('mousedown', this.mousedownMouse);
    this.main.addEventListener('mouseover', this.mouseoverMouse);
  }

  pressAdd(e) {
    const el = e.target;
    el.style.display = 'none';
    const parentEl = Footer.pressAdd(el);
    const btn = parentEl.querySelector('.btn');
    const close = parentEl.querySelector('.span-btn');
    btn.addEventListener('click', this.pressBtn);
    close.addEventListener('click', Events.pressClose);
  }

  pressBtn(e) {
    Footer.pressButton(e);
    Footer.returnAddField(e.target);
    this.cardManager.showCards();
  }

  static pressClose(e) {
    const el = e.target;
    Footer.returnAddField(el);
  }

  mousedownMouse(e) {
    // e.preventDefault();
    const el = e.target;
    if (el.classList.contains('card-item')) {
      this.cardItemDel = el.querySelector('.card-item-del');
      this.cardItemDel.style.display = 'none';
      this.doc.style.cursor = 'grabbing';
      this.actualElement = el;
      this.actualElement.classList.add('dragged');
      this.clickMouseZ = e.clientY;
      this.clickMouseX = e.clientX;
      this.parentClicElement = el.closest('section');

      this.doc.addEventListener('mouseup', this.mouseupMouse);
      this.doc.addEventListener('mousemove', this.mousemoveMouse);
      this.main.removeEventListener('mouseover', this.mouseoverMouse);
    }
  }

  mouseupMouse() {
    if (this.actualElement) {
      this.actualElement.classList.remove('dragged');
      this.actualElement.style.top = '';
      this.actualElement.style.left = '';
      this.actualElement = undefined;
      this.cardItemDel.style.display = '';
      this.doc.style.cursor = '';
      this.clickMouseZ = 0;
      this.offsetElZ = 0;
      this.offsetElX = 0;
      this.parentClicElement = undefined;
      this.cardManager.revisionAllCards();
      this.doc.removeEventListener('mouseup', this.mouseupMouse);
      this.doc.removeEventListener('mousemove', this.mousemoveMouse);
      this.main.addEventListener('mouseover', this.mouseoverMouse);
    }
  }

  mousemoveMouse(e) {
    e.preventDefault();
    this.actualElement.style.top = `${e.clientY - this.clickMouseZ - this.offsetElZ}px`;
    this.actualElement.style.left = `${e.clientX - this.clickMouseX - this.offsetElX}px`;
    this.positionSelect(e);
  }

  mouseoverMouse(e) {
    const el = e.target;
    if (el.classList.contains('card-item')) {
      this.cardItem = el;
      this.cardItemDel = el.querySelector('.card-item-del');
      this.cardItemDel.style.display = 'flex';
      this.cardItemDel.addEventListener('click', this.delCard);
      el.addEventListener('mouseleave', this.displayItemDel);
    }
  }

  insertElement(currentElement, whereInsert, whatInsert) {
    const beforeZ = this.actualElement.offsetTop;
    const beforeX = this.actualElement.offsetLeft;
    currentElement.insertAdjacentElement(whereInsert, whatInsert);
    const afterZ = this.actualElement.offsetTop;
    const afterX = this.actualElement.offsetLeft;
    this.offsetElZ += afterZ - beforeZ;
    this.offsetElX += afterX - beforeX;
  }

  positionSelect(mouseEvent) {
    const targetElement = mouseEvent.target;
    if (targetElement.classList.contains('card-item')) {
      const halfTargetElement = targetElement.offsetTop + targetElement.offsetHeight / 2;
      if (mouseEvent.clientY < halfTargetElement) {
        this.insertElement(targetElement, 'beforebegin', this.actualElement);
        return;
      }
      if (mouseEvent.clientY > halfTargetElement) {
        this.insertElement(targetElement, 'afterend', this.actualElement);
        return;
      }
    }
    if (targetElement.closest('section')) {
      if (!(targetElement.closest('section') === this.parentClicElement)) {
        this.parentClicElement = targetElement.closest('section');
        const cardBox = this.parentClicElement.querySelector('.card-box');
        const child = cardBox.lastElementChild;
        if (!child) {
          this.insertElement(cardBox, 'beforeend', this.actualElement);
          return;
        }
        const top = child.offsetTop;
        const height = child.offsetHeight;
        const maxheight = top + height;
        if (mouseEvent.clientY > maxheight) {
          this.insertElement(cardBox, 'beforeend', this.actualElement);
        }
      }
    }
  }

  delCard() {
    this.cardManager.deleteCard(this.cardItem);
  }

  displayItemDel() {
    this.cardItemDel.style.display = '';
  }
}
