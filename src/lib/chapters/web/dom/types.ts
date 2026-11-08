import type { LessonText } from '../../types';

export type DomStep = 'find' | 'bubble' | 'listen';

export interface DomText extends LessonText {
	/** Short names for the three steps, shown in the stepper. */
	steps: Record<DomStep, string>;
	/** One instruction per step, shown above the page. */
	prompts: Record<DomStep, string>;
	/** Captions for the two views. */
	pageLabel: string;
	treeLabel: string;
	/** Words on the little page. */
	page: { heading: string; product: string; button: string; help: string; added: string };
	/** Label over the trail of nodes the click visited. */
	trailLabel: string;
	/** Tag on the node that has the listener. */
	listening: string;
	/** Result lines after a click in the last step, templates with {node}. */
	hit: string;
	miss: string;
	/** Empties the cart list again. */
	clear: string;
}
