import update from 'react-addons-update';

import {ROOM_FULL_SYNC} from './shared/room';
import {SOCKET_ROOM_EVENT} from './socket';

// ------------------------------------
// Constants
// ------------------------------------
export const SPOTIFY_AUTH_REQUIRED = 'SPOTIFY_AUTH_REQUIRED';
export const SPOTIFY_AUTH_INIT = 'SPOTIFY_AUTH_INIT';
export const SPOTIFY_AUTH_OK = 'SPOTIFY_AUTH_OK';
export const SPOTIFY_API_REQUEST_START = 'SPOTIFY_API_REQUEST_START';
export const SPOTIFY_API_REQUEST_OK = 'SPOTIFY_API_REQUEST_OK';
export const SPOTIFY_API_REQUEST_RETRY = 'SPOTIFY_API_REQUEST_RETRY';
export const SPOTIFY_API_REQUEST_ERROR = 'SPOTIFY_API_REQUEST_ERROR';
export const SPOTIFY_PROFILE_REQUEST = 'SPOTIFY_PROFILE_REQUEST';
export const SPOTIFY_PLAYER_STATE_REQUEST = 'SPOTIFY_PLAYER_STATE_REQUEST';
export const SPOTIFY_PLAYER_STATE_UPDATE = 'SPOTIFY_PLAYER_STATE_UPDATE';

export const actions = {
	SPOTIFY_AUTH_REQUIRED,
	SPOTIFY_AUTH_INIT,
	SPOTIFY_AUTH_OK,
	SPOTIFY_API_REQUEST_START,
	SPOTIFY_API_REQUEST_OK,
	SPOTIFY_API_REQUEST_RETRY,
	SPOTIFY_API_REQUEST_ERROR,
	SPOTIFY_PROFILE_REQUEST,
	SPOTIFY_PLAYER_STATE_REQUEST,
	SPOTIFY_PLAYER_STATE_UPDATE
};

// ------------------------------------
// Default spotify state
// ------------------------------------
const defaultState = {
	isFetching: false,
	accessToken: null,
	refreshToken: null,
	isLoggedIn: false,
	player: {},
	tracks: {}  // tracks stored by key object key 'id'
};

// ------------------------------------
// Action Creators
// ------------------------------------
export const spotifyAuthRequired = () => ({
	type: SPOTIFY_AUTH_REQUIRED
});

export const spotifyAuthInit = ({accessToken, refreshToken}) => ({
	type: SPOTIFY_AUTH_INIT,
	payload: {accessToken, refreshToken}
});

export const spotifyAuthOK = (profile) => ({
	type: SPOTIFY_AUTH_OK,
	payload: {profile}
});

export const spotifyProfileRequest = () => ({
	type: SPOTIFY_PROFILE_REQUEST
});

export const spotifyPlayerStateRequest = () => ({
	type: SPOTIFY_PLAYER_STATE_REQUEST
});

export const spotifyPlayerStateUpdate = (playerState) => ({
	type: SPOTIFY_PLAYER_STATE_UPDATE,
	payload: {playerState}
});

// ------------------------------------
// Action Handlers
// ------------------------------------
const mergeTracks = ({state, tracks}) => {
	let existingTracks = state.tracks;
	const updateCommand = {};
	// don't want to overwrite tracks if already have more info
	for (let track of tracks) {
		if (existingTracks[track.id]) {
			track = {...existingTracks[track.id], ...track};
		}
		updateCommand[track.id] = {$set: track};
	}
	return {
		...state,
		tracks: update(state.tracks, updateCommand)
	};
};

const ACTION_HANDLERS = {
	[SPOTIFY_AUTH_INIT]: (state, {payload}) => ({
		...state,
		accessToken: payload.accessToken,
		refreshToken: payload.refreshToken
	}),
	[SPOTIFY_AUTH_OK]: (state, {payload}) => ({
		...state,
		isLoggedIn: true
	}),
	[SPOTIFY_PLAYER_STATE_UPDATE]: (state, {payload}) => {
		const {item} = payload.playerState;
		const newState = {
			...state,
			player: payload.playerState
		};

		// this might be a new track that we haven't seen before, check if it's in our
		// track state already
		if (item && item.type !== 'track') {
			// we're only set up to deal with spotify playing tracks
			throw new Error(`Unexpected spotify player item type (${item.type})`);
		}

		if (!state.tracks[item.id]) {
			// add track to state
			newState.tracks = update(state.tracks, {[item.id]: {$set: item}});
		} else {
			// update existing info with our info (we may have requested more details already, so
			// don't want to overwrite the existing track.
			newState.tracks[item.id] = {...newState.tracks[item.id], ...item};
		}
		return newState;
	},
	[ROOM_FULL_SYNC]: (state, {payload}) => {
		// merge any track data from room sync
		return mergeTracks({state, tracks: payload.fullSync.tracks});
	},
	[SOCKET_ROOM_EVENT]: (state, {payload}) => {
		// merge any track data from adds / votes if present
		if (payload.tracks) {
			return mergeTracks({state, tracks: payload.tracks});
		}
		return state;
	}
};

// ------------------------------------
// Reducer
// ------------------------------------

export default function spotifyReducer(state = defaultState, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}
