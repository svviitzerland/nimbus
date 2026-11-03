import type { LessonText } from '../../types';

export interface DataText extends LessonText {
	catLabel: string; // the label "cat"
	notLabel: string; // the label "not a cat"
	setTitle: string; // template with {n}, the training photos still in the dataset
	testTitle: string; // caption over the new photos the model has never seen
	trainBtn: string;
	retrainBtn: string;
	reset: string;
	score: string; // template with {n}, how many of the 6 new photos it got right
	pickHint: string; // nothing selected yet
	chosen: string; // template with {n} and {label}, the selected photo
	blurChosen: string; // template with {label}, the blurry photo is selected
	swapBtn: string;
	removeBtn: string;
	photo: string; // template with {n}, aria label of a training photo
	newPhoto: string; // template with {n}, aria label of a new photo
	lookHint: string; // nudge to tap a new photo to see the example it copied
	copied: string; // template with {n}, the training photo a new photo was matched with
	stale: string; // the data changed since the last training
	guessed: string; // small caption before the model's guess on a new photo
}
