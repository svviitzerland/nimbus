import type { LessonText } from '../../types';

export type ResponsiveMissionId = 'phone' | 'tablet' | 'laptop' | 'fixed';

export interface ResponsiveText extends LessonText {
	/** Heading over the mission list. */
	missionsLabel: string;
	/** One line per mission, in order. */
	missions: Record<ResponsiveMissionId, string>;
	/** Label for the width slider, and the preset buttons. */
	widthLabel: string;
	presets: { phone: string; tablet: string; laptop: string };
	/** The switch that turns the responsive rules on and off. */
	toggleLabel: string;
	on: string;
	off: string;
	/** Caption over the media query cards, and the address bar. */
	rulesLabel: string;
	previewLabel: string;
	/** What each layout is called in the readout. */
	layouts: { phone: string; tablet: string; laptop: string; fixed: string };
	/** Words on the nimbus.com page. */
	page: {
		menu: string;
		links: string[];
		heroTitle: string;
		heroText: string;
		cta: string;
		cards: { title: string; text: string }[];
	};
	/** Shown once every mission is done. */
	allDone: string;
}
