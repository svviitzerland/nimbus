import type { LessonText } from '../../types';

export type HttpMissionId = 'read' | 'send' | 'missing' | 'broken';
export type HttpPath = '/' | '/about' | '/messages' | '/pricing' | '/report';

export interface HttpText extends LessonText {
	urlParts: { scheme: string; domain: string; path: string; query: string };

	/** Heading over the mission list. */
	missionsLabel: string;
	/** One line per mission, in order. */
	missions: Record<HttpMissionId, string>;
	/** Labels over the method switch, the path chips, and the message box. */
	methodLabel: string;
	pathLabel: string;
	bodyLabel: string;
	/** What the message box holds at the start. */
	bodyDefault: string;
	/** Short description under each path chip. */
	pathHints: Record<HttpPath, string>;
	/** The send button, and its label while a request is in flight. */
	send: string;
	sending: string;
	youLabel: string;
	serverLabel: string;
	/** Captions over the raw request and response. */
	requestLabel: string;
	responseLabel: string;
	/** Shown in the response card before anything came back. */
	waiting: string;
	/** What the phone screen shows for each answer. */
	screen: {
		home: string;
		about: string;
		aboutText: string;
		messages: string;
		created: string;
		notFound: string;
		broken: string;
		notAllowed: string;
	};
	/** One line explaining the first digit of the status code. */
	statusNotes: { ok: string; client: string; server: string };
	/** Shown once every mission is done. */
	allDone: string;
}
