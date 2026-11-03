import type { LessonText } from '../../types';

export interface SupervisedText extends LessonText {
	modeSup: string; // toggle, with labels
	modeUnsup: string; // toggle, without labels
	genres: [string, string, string]; // chill, dance, rock, the tags people gave the songs
	xAxis: string; // tempo, slow to fast
	yAxis: string; // energy, calm to loud
	supHint: string; // tap to drop a new song
	supAnswer: string; // template with {label}, what the nearest songs say
	newSong: string; // aria label for the dropped song
	unsupHint: string; // nobody tagged these, pick how many groups
	groups: string; // caption before the group count picker
	findBtn: string;
	round: string; // template with {n}, while it searches
	found: string; // template with {k} and {n}, after it settles
	groupName: string; // template with {n}
	reset: string;
}
