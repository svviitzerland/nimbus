import type { LessonText } from '../../types';

export interface DeployPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface DeploySiteText extends LessonText {
	/** One panel per scene of the guided picture (nine scenes, one per beat). */
	panels: DeployPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** Captions next to the four actors. */
	labels: { laptop: string; repo: string; host: string; phone: string };
	/** Small words on the three arrows, and on the test checkpoint. */
	arrows: { push: string; build: string; live: string; tests: string };
	/** Headlines the site shows, oldest first. Keep them short (about 16 letters). */
	headlines: string[];
	/** What the phone says while the laptop sleeps. */
	unreachable: string;
	/** Little tag above the server, it is always on. */
	alwaysOn: string;
	/** Small tag on the phone right after a deploy. */
	updated: string;
	/** The two kinds of host, shown under the server on the hosts scene. */
	hosts: { platform: string; vps: string };
	/** What you type on a VPS. Real commands, shown as they are. */
	vpsCommands: string[];
	/** The rule of thumb line under the picture. */
	rule: string;
	/** The optional button on the last beat. */
	pushBtn: string;
	pushing: string;
}
