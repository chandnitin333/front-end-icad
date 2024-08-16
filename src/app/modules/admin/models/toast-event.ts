import { EventTypes } from './events-type';

export interface ToastEvent {
  type: EventTypes;
  title: string;
  message: string;
}