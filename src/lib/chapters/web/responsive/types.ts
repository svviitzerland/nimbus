import type { LessonText } from '../../types';

export interface ResponsiveText extends LessonText {
	/** One side panel step per intro beat, in the same order. */
	steps: { title: string; body: string; tag?: string }[];
	/** File name over the code and the address bar over the page. */
	cssLabel: string;
	previewLabel: string;
	/** Under the ruler, template with {n} for the current width in pixels. */
	widthLabel: string;
	/** Name of each screen size, shown next to the width. */
	sizes: { phone: string; tablet: string; laptop: string };
	/** Label of the optional slider on the last beat. */
	sliderLabel: string;
	/** Words on the nimbus.com page. */
	page: {
		menu: string;
		links: string[];
		heroTitle: string;
		heroText: string;
		cards: { title: string; text: string }[];
	};
}
