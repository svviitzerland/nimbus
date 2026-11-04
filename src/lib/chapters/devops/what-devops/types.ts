import type { LessonText } from '../../types';

export interface WhatDevopsText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	devLabel: string;
	opsLabel: string;
	oneTeam: string; // the band under both teams once the wall is gone
	blameDev: string; // speech bubble over the laptop when the release breaks
	blameOps: string; // speech bubble over the servers when the release breaks
	bigBox: string; // written on the giant release box
	oneChange: string; // shown when a tiny box breaks the site
	fixed: string; // shown when the fixed tiny box lands
	yearLabel: string; // caption over the release timeline
	modeLabel: string; // caption over the optional toggle
	oldBtn: string;
	newBtn: string;
}
