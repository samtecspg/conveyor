import { Dispatcher } from 'flux';
export const dispatcher = new Dispatcher();

export function dispatch(data) {
  dispatcher.dispatch(data);
}