import type { LessonText } from '../../types';

export type LabOption = 'mikrotik' | 'cisco';

export interface LabPickText extends LessonText {
	/** Under the two cards before one is picked. */
	hint: string;
	/** Tag on the picked card. */
	pickedTag: string;
	/** Under the cards once one is picked, a reminder that the other lab is always there. */
	note: string;
	options: Record<LabOption, { name: string; os: string; points: string[] }>;
}
