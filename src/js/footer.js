import { getId, setId, serilizer } from './data';

export default class Footer {
  static dialogFormTemplate() {
    return `
    <div class="form-box">
      <form class="form-add">
        <textarea type="text" class="form" placeholder="Введите текст"></textarea>
        <div class="btn-box">
          <button class="btn">Создать</button>
          <span class="span-btn">&times</span>
        </div>
      </form>
    </div>
  `;
  }

  static pressAdd(currentEl) {
    const parentEl = currentEl.closest('section');
    const html = Footer.dialogFormTemplate();
    parentEl.insertAdjacentHTML('beforeend', html);
    return parentEl;
  }

  static pressButton(e) {
    e.preventDefault();
    const el = e.target;
    const formBox = el.closest('.form-box');
    const parentEl = el.closest('section');
    const form = formBox.querySelector('.form');
    const textOld = form.value;
    const text = textOld.replace(/\n/g, '<br>');
    const category = parentEl.getAttribute('name');
    const listCards = parentEl.querySelectorAll('.card-item');
    const queue = listCards.length + 1;
    const id = getId();
    const data = {
      id,
      category,
      text,
      queue,
    };
    const jsonCard = serilizer(data);
    localStorage.setItem(id, jsonCard);
    setId();
    const newId = getId();
    localStorage.setItem('key', newId);
  }

  static returnAddField(eventEl) {
    const parentEl = eventEl.closest('section');
    const form = parentEl.querySelector('.form-box');
    const addField = parentEl.querySelector('.add');
    form.remove();
    addField.style.display = '';
  }
}
