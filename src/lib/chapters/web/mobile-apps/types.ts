import type { LessonText } from '../../types';

export type MobileWay = 'native' | 'cross' | 'web';
export type MobileSheet = 'kotlin' | 'swift' | 'dart' | 'html';

export interface MobilePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface MobileAppsText extends LessonText {
	/** One panel per scene of the guided picture (eight scenes). */
	panels: MobilePanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** Heading over each of the three lanes. */
	ways: Record<MobileWay, string>;
	/** The language written on each code sheet. */
	sheets: Record<MobileSheet, string>;
	/** Small captions under the devices. */
	devices: { android: string; iphone: string; phone: string; laptop: string };
	/** How many codebases each way needs, shown under its lane. */
	counts: Record<MobileWay, string>;
	/** One example job that fits each way, shown on the choosing scene. */
	examples: Record<MobileWay, string>;
	/** The rule of thumb line under the picture. */
	rule: string;
	/** The optional button on the last beat, and its label once it has been used up. */
	featureBtn: string;
	featureDone: string;
}
