import type { LessonText } from '../../types';

export interface CablingText extends LessonText {
	copper: { name: string; sub: string }; // the LAN cable, carries electricity
	fibre: { name: string; sub: string }; // the glass strand, carries light
	distLabel: string; // heading over the distance slider
	/** One place per distance step, in order (10 m, 50 m, 100 m, 300 m, 5 km, 60 km). */
	places: string[];
	sendBtn: string;
	fileLabel: string; // the file being sent
	youLabel: string; // the sending laptop
	farLabel: string; // the machine at the other end
	signalLabel: string; // heading over the signal meter
	limitLabel: string; // the threshold mark on that meter
	okNote: string; // template with {t}
	failNote: string; // the file arrived broken
	times: { copper: string; fibre: string }; // how long the 1 GB file takes, fills {t}
	idleNote: string; // before the first send
}
