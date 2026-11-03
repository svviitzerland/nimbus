import type { LessonText } from '../../types';

export interface PredictText extends LessonText {
	tabReg: string; // phone tab for the regression model
	tabCls: string; // phone tab for the classification model
	regTitle: string;
	clsTitle: string;
	regKind: string; // badge, the answer is a number
	clsKind: string; // badge, the answer is a group
	regX: string; // axis, house size
	regY: string; // axis, price
	clsX: string; // axis, links in the email
	clsY: string; // axis, exclamation marks
	regHint: string; // tap to add a house
	askSize: string; // aria label of the size slider
	regAnswer: string; // template with {size} and {price}
	regNeed: string; // not enough houses to draw a line
	spam: string;
	ham: string; // not spam
	addAs: string; // caption before the label picker
	clsHint: string; // drag the new email
	clsAnswer: string; // template with {label}
	newEmail: string; // aria label of the draggable email
	clear: string;
}
