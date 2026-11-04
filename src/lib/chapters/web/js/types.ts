import type { LessonText } from '../../types';

export interface JsText extends LessonText {
	/** One side panel step per intro beat, in the same order. */
	steps: { title: string; body: string; tag?: string }[];
	/** First line of the script, shown as a code comment. */
	comment: string;
	/** File name, address bar, and the console under the preview. */
	jsLabel: string;
	previewLabel: string;
	consoleLabel: string;
	consoleEmpty: string;
	/** Words on the little shop page. */
	page: { product: string; price: string; button: string; cart: string };
	/** The optional switch on the last beat, one tap adds 1 or 2. */
	stepLabel: string;
}
