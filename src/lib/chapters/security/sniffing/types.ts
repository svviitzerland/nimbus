import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/attacks2/types';

/** How the login travels, a readable postcard (http) or a sealed envelope (https). */
export type SniffMode = 'http' | 'https';

export interface SniffingText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	youLabel: string;
	routerLabel: string; // the café WiFi box
	serverLabel: string; // always nimbus.com
	snooperLabel: string; // the stranger at the next table
	twinLabel: string; // the snooper's laptop posing as a hotspot
	engineerLabel: string; // the same laptop, used by an engineer on their own network
	notSecure: string; // tag in the address bar when there is no padlock
	loginBtn: string;
	/** The snooper's screen. */
	snoop: { title: string; waiting: string; recording: string; readable: string; noise: string };
	/** The rule of thumb line under the picture. */
	rule: string;
	/** Caption and buttons of the optional switch on the last beat. */
	pickLabel: string;
	modes: Record<SniffMode, string>;
}
