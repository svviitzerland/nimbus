import type { LessonText } from '../../types';

export interface WhatDevopsText extends LessonText {
	everyLabel: string; // heading over the release slider
	/** The five release rhythms, from once a year down to every day. */
	cadences: string[];
	devLabel: string;
	opsLabel: string;
	oneTeam: string; // replaces the two labels once the wall is gone
	wallLabel: string;
	changesTag: string; // template with {n}, caption on the release box
	changesOne: string; // the singular form, exactly one change
	waitLabel: string; // stat heading, how long users wait for a feature
	/** How long a finished feature waits for the next release, one per cadence. */
	waits: string[];
	findLabel: string; // stat heading, how long it takes to find the bug
	/** How long it takes to find the broken change, one per cadence. */
	finds: string[];
	shipBtn: string;
	againBtn: string;
	downTag: string;
	backTag: string; // the site is back up after the fix
	noteIdle: string;
	noteBig: string; // template with {n} and {t}, after shipping a big release
	noteSmall: string; // after shipping one tiny change
}
