import type { LessonText } from '../../types';

export type MobileWay = 'native' | 'cross' | 'web';
export type MobileClient = 'game' | 'startup' | 'menu';

export interface MobileAppsText extends LessonText {
	/** Short names for the two acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string;
	nextAct: string;
	/** Act one, building the nimbus app three ways. */
	buildPrompt: string;
	ways: Record<MobileWay, { name: string; sub: string; note: string }>;
	/** Captions for the three places the app runs. */
	android: string;
	iphone: string;
	browser: string;
	/** The code each way needs, shown as chips over the devices. */
	codeLabel: string; // template with {n}, how many codebases
	codeLabelOne: string;
	/** The three bars. */
	speedLabel: string;
	reachLabel: string;
	effortLabel: string;
	/** Act two, helping clients choose. */
	clientPrompt: string;
	clients: Record<MobileClient, { who: string; need: string }>;
	rightTag: string;
	wrongTag: string;
	nextClient: string;
	progress: string; // template with {n} and {total}
	doneLine: string;
}
