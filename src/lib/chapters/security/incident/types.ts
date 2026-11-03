import type { LessonText } from '../../types';

/** The five real steps, in the right order, plus two tempting traps. */
export type IncidentStep = 'check' | 'contain' | 'clean' | 'recover' | 'learn';
export type IncidentTrap = 'pay' | 'hide';

export interface IncidentText extends LessonText {
	alarmTitle: string; // the alarm banner headline
	alarmSub: string; // what is happening, in one line
	answerBtn: string; // starts the clock
	serversLabel: string; // caption over the row of servers
	damageLabel: string; // caption over the damage meter
	planLabel: string; // heading over the steps picked so far
	pickHint: string; // nudges the learner to pick the next step
	/** Every card, its short name and what it means in one line. */
	steps: Record<IncidentStep | IncidentTrap, { name: string; sub: string }>;
	stateHit: string; // a server the malware reached
	stateCut: string; // cut off from the network, contained
	stateClean: string; // the malware is gone, still offline
	stateBack: string; // restored and serving again
	restartBtn: string; // plays the drill again
	resultGood: string; // template with {n}, finished with few servers hit
	resultSlow: string; // template with {n}, finished but late
}
