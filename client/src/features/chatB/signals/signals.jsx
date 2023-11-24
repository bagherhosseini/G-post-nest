import { signal } from '@preact/signals-react';

//id signals
export const myId = signal(null);
export const userId = signal('');

//message signals
export const messages = signal([]);
export const filePreviewURL = signal('');

//call signals
export const stream = signal(null);
export const myStream = signal(null);
export const userStream = signal(null);
export const outGoingCall = signal(false);
export const inCommingCall = signal(false);
export const callAccepted = signal(false);
export const callerSignal = signal(null);
export const isVideoCall = signal(false);

export const activePeers = signal();
