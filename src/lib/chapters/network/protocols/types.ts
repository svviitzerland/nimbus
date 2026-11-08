import type { LessonText } from '../../types';

export interface ProtocolsText extends LessonText {
	laptopLabel: string;
	serverLabel: string; // the nimbus.com server
	doorsLabel: string; // caption over the row of port doors
	taskLabel: string; // template with {n} and {total}
	pickLabel: string; // prompt over the protocol chips
	/** The protocol chips. `id` is the reaction token, `port` the door it knocks on. */
	protocols: { id: string; name: string; port: number }[];
	/**
	 * The jobs, in order. `answer` is the right protocol id, `close` an optional protocol that
	 * works but is unsafe (its id is emitted as the token), `hint` is shown after a wrong pick.
	 */
	tasks: { text: string; answer: string; close?: string; hint: string }[];
	wrongNote: string; // template with {name}, shown on the stage after a wrong pick
	doneNote: string; // shown when every task is done
	againBtn: string; // replays the round
}
