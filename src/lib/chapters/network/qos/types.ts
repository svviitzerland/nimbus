import type { LessonText } from '../../types';

export interface QosText extends LessonText {
	qosLabel: string; // the QoS switch
	on: string;
	off: string;
	/** Flow names, in order: video call, game, download. */
	flows: string[];
	priorityBtn: string; // template with {p}, the button that cycles a flow's priority
	/** Priority names, in order: low, normal, high. */
	priorities: string[];
	smooth: string;
	stutter: string;
	lag: string; // game ping too high
	delay: string; // template with {n}, milliseconds
	speed: string; // template with {n}, megabits per second
	dropped: string; // template with {n}
	routerLabel: string;
	queueLabel: string; // caption over the router's waiting line
	lineLabel: string; // the office line out to the internet, with its size
	noteOff: string; // first in, first out
	noteOn: string; // highest priority leaves first
}
