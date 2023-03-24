let id = 1;

export function serilizer(data) {
  return JSON.stringify(data);
}

export function deserializer(json) {
  return JSON.parse(json);
}

export function setLocalStorageId() {
  if (localStorage.getItem('key')) {
    id = Number(localStorage.getItem('key'));
  } else {
    localStorage.setItem('key', 1);
    id = 1;
  }
}

export function setId() {
  id += 1;
}

export function getId() {
  return id;
}
