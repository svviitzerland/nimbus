import type { LessonText } from '../../types';

export interface AgentsText extends LessonText {
	youLabel: string; // caption on the request card
	goal: string; // what the learner asked the agent
	modelLabel: string; // caption on the model card
	calendarLabel: string;
	emailLabel: string;
	day: string; // the day shown on the calendar tool
	free: string; // an empty calendar slot
	teamSync: string; // the meeting already at 10:00
	withRaka: string; // the meeting the agent books
	emailIdle: string;
	emailSent: string;
	/** Labels for each kind of line in the step log. */
	kinds: { think: string; call: string; result: string; answer: string };
	think1: string; // the agent plans to read the calendar
	think2: string; // the agent sees 10:00 is taken and picks 11:00
	finalAllow: string; // the agent's last message when booking was allowed
	finalDeny: string; // the agent's last message when booking was denied
	/** What the model card says it is doing right now. {tool} is a tool name. */
	status: {
		idle: string;
		thinking: string;
		calling: string;
		reading: string;
		waiting: string;
		done: string;
	};
	stepBtn: string;
	autoBtn: string;
	running: string;
	reset: string;
	approvalQ: string; // the agent asks before changing the calendar
	allow: string;
	deny: string;
	logLabel: string;
	logEmpty: string;
	stepCount: string; // template with {n}
}
