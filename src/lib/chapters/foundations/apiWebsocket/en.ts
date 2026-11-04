import type { ApiStyleText } from '../../types';

export const en: ApiStyleText = {
	title: 'WebSocket',
	intro: [
		'WebSocket is different again. A line between frontend and backend is opened once, then left open, and messages can travel both ways.',
		'Because it stays open, the server can push news at any time without being asked, and you can send at any time too. Watch messages flow back and forth.',
		'Use WebSocket when you need live updates in both directions, like chat, notifications, or players in the same game.',
		'[fyi] Before WebSocket, to keep a screen updated an app had to ask the server again and again every few seconds, called polling. Wasteful and late. WebSocket lets the server push on its own when something is new, so it is lean and immediate.'
	],
	reactions: {},
	style: 'websocket',
	clientLabel: 'Frontend',
	serverLabel: 'Backend',
	replayBtn: 'Replay'
};
