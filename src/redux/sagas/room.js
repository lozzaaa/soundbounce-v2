import {take, put} from 'redux-saga/effects';
import {actions as socketActions} from '../modules/socket';
import {push} from 'react-router-redux';

function * watchForSocketRoomJoinOk() {
	while (true) {
		const {payload} = yield take(socketActions.SOCKET_ROOM_JOIN_OK);
		const {roomId} = payload;
		// now navigate to the room
		yield put(push(`/room/${roomId}`));
	}
}

function * watchForSocketRoomEvent() {
	while (true) {
		const {payload} = yield take(socketActions.SOCKET_ROOM_EVENT);
		// dispatch this redux action that we received over the socket
		yield put(payload.reduxAction);
	}
}

export default function * socketInit() {
	try {
		yield [
			watchForSocketRoomJoinOk(),
			watchForSocketRoomEvent()
		];
	} catch (err) {
		console.log('unhandled room saga error: ' + err);
	}
}
