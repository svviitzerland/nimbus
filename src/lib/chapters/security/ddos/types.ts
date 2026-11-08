import type { LessonText } from '../../types';

export interface DdosText extends LessonText {
	startBtn: string; // starts the pretend flood
	stopBtn: string; // calms everything down again
	sizeLabel: string; // caption above the botnet size slider
	rateToggle: string; // the rate limit switch
	cdnToggle: string; // the CDN shield switch
	on: string;
	off: string;
	visitorsLabel: string; // the real people trying to visit
	botsLabel: string; // template with {n}, the hijacked devices
	cdnLabel: string; // the shield of edge servers
	serverLabel: string; // the nimbus.com server
	rps: string; // template with {n}, requests per second arriving
	served: string; // template with {n}, share of real visitors getting in
	calm: string; // shown before the flood starts
	states: { up: string; slow: string; down: string };
	numberLocale: string; // how big numbers are written, e.g. 10,000 or 10.000
}
