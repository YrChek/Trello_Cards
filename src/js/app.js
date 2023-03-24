import { setLocalStorageId } from './data';
import CardManager from './cardManager';
import Events from './events';

setLocalStorageId();

const cardManager = new CardManager();
// eslint-disable-next-line no-unused-vars
const events = new Events(cardManager);
cardManager.showCards();
