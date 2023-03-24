import { serilizer, deserializer } from './data';

export default class CardManager {
  constructor() {
    this.listTodo = [];
    this.listProgress = [];
    this.listDone = [];
    this.sectionTodo = document.querySelector('.todo');
    this.sectionProgress = document.querySelector('.progress');
    this.sectionDone = document.querySelector('.done');

    this.readingDB = this.readingDB.bind(this);
    this.sortTodoList = this.sortTodoList.bind(this);
    this.sortProgressList = this.sortProgressList.bind(this);
    this.sortDoneList = this.sortDoneList.bind(this);
    this.showCards = this.showCards.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.revisionAllCards = this.revisionAllCards.bind(this);
  }

  static cardTemplate(id, ctegory, text, queue) {
    return `
    <div id="${id}" data-ctegory="${ctegory}" data-queue="${queue}" class="card-item">
      <p>${text}</p>
      <div class="card-item-del">&times</div>
    </div>
    `;
  }

  static displayСards(cardBox, id, category, text, queue) {
    const html = CardManager.cardTemplate(id, category, text, queue);
    cardBox.insertAdjacentHTML('beforeend', html);
  }

  static delCards(cardBox) {
    const childs = cardBox.querySelectorAll('.card-item');
    if (childs.length) childs.forEach((el) => el.remove());
  }

  readingDB() {
    this.listTodo = [];
    this.listDone = [];
    this.listProgress = [];
    const keys = Object.keys(localStorage);
    if (keys.length > 0) {
      keys.forEach((key) => {
        const json = localStorage.getItem(key);
        const obj = deserializer(json);
        if (obj.category === 'todo') this.listTodo.push(obj);
        if (obj.category === 'progress') this.listProgress.push(obj);
        if (obj.category === 'done') this.listDone.push(obj);
      });
    }
  }

  sortTodoList() {
    if (this.listTodo.length) {
      this.listTodo.sort((a, b) => Number(a.queue) - Number(b.queue));
      return true;
    }
    return false;
  }

  sortProgressList() {
    if (this.listProgress.length) {
      this.listProgress.sort((a, b) => Number(a.queue) - Number(b.queue));
      return true;
    }
    return false;
  }

  sortDoneList() {
    if (this.listDone.length) {
      this.listDone.sort((a, b) => Number(a.queue) - Number(b.queue));
      return true;
    }
    return false;
  }

  showCards() {
    this.readingDB();
    const todo = this.sectionTodo.querySelector('.card-box');
    const progress = this.sectionProgress.querySelector('.card-box');
    const done = this.sectionDone.querySelector('.card-box');
    CardManager.delCards(todo);
    CardManager.delCards(progress);
    CardManager.delCards(done);
    if (this.sortTodoList()) {
      this.listTodo.forEach((obj) => {
        CardManager.displayСards(todo, obj.id, obj.category, obj.text, obj.queue);
      });
    }
    if (this.sortProgressList()) {
      this.listProgress.forEach((obj) => {
        CardManager.displayСards(progress, obj.id, obj.category, obj.text, obj.queue);
      });
    }
    if (this.sortDoneList()) {
      this.listDone.forEach((obj) => {
        CardManager.displayСards(done, obj.id, obj.category, obj.text, obj.queue);
      });
    }
  }

  deleteCard(elCard) {
    const key = Number(elCard.getAttribute('id'));
    localStorage.removeItem(key);
    this.showCards();
  }

  static revisionSectionCards(grouCards, category) {
    grouCards.forEach((elem, index) => {
      const el = elem;
      const p = el.querySelector('p');
      const text = p.innerHTML;
      const id = Number(el.getAttribute('id'));
      el.dataset.ctegory = category;
      const queue = index + 1;
      el.dataset.queue = queue;
      const data = {
        id,
        category,
        text,
        queue,
      };
      const jsonCard = serilizer(data);
      localStorage.setItem(id, jsonCard);
    });
  }

  revisionAllCards() {
    const todo = this.sectionTodo.querySelector('.card-box');
    const progress = this.sectionProgress.querySelector('.card-box');
    const done = this.sectionDone.querySelector('.card-box');
    const groupNewTasks = todo.querySelectorAll('.card-item');
    const groupCurrentTasks = progress.querySelectorAll('.card-item');
    const groupСompleted = done.querySelectorAll('.card-item');
    if (groupNewTasks.length) {
      CardManager.revisionSectionCards(groupNewTasks, 'todo');
    }
    if (groupCurrentTasks.length) {
      CardManager.revisionSectionCards(groupCurrentTasks, 'progress');
    }
    if (groupСompleted.length) {
      CardManager.revisionSectionCards(groupСompleted, 'done');
    }
    this.showCards();
  }
}
