import type { LessonText } from '../../types';

export interface DomText extends LessonText {
	/** One side panel step per intro beat, in the same order. */
	steps: { title: string; body: string; tag?: string }[];
	/** Address bar over the page and the label over the tree. */
	pageLabel: string;
	treeLabel: string;
	/** Words on the little page. */
	page: { heading: string; product: string; button: string; help: string; added: string };
	/** Small badge on the node that has a listener. */
	listening: string;
}
