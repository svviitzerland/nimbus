import type { LessonText } from '../../types';
import type { GuideStepText } from '$lib/components/stages/netguide/types';

export interface CablingText extends LessonText {
	/** The side panel, one step per beat (same length as intro). */
	steps: GuideStepText[];
	copper: string; // label over the copper LAN cable
	fibre: string; // label over the glass fibre
	pairLabel: string; // caption inside the copper close up, "twisted pair"
	glassLabel: string; // caption inside the fibre close up, "light in glass"
	youLabel: string; // the sending laptop
	farLabel: string; // the machine at the other end
	distLabel: string; // heading over the distance slider on the last beat
	okTag: string; // chip at the far end when the signal arrives
	brokenTag: string; // chip at the far end when copper gives up
	limitTag: string; // the 100 metre mark on the ruler
}
