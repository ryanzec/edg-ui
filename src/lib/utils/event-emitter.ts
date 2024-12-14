import mitt from 'mitt';
import type { User } from '$lib/data-models/user';

export enum GlobalEvent {
  USER_SAVED = 'user-saved',
}

export type EventEmitterEvents = { [GlobalEvent.USER_SAVED]: { user: User } };

const eventEmitter = mitt<EventEmitterEvents>();

export default eventEmitter;
