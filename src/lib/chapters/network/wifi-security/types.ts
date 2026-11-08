import type { LessonText } from '../../types';

export interface WifiSecurityText extends LessonText {
	routerTitle: string; // heading of the router settings card
	securityLabel: string; // label over the Open, WPA2, WPA3 picker
	modes: { open: string; wpa2: string; wpa3: string };
	modeHints: { open: string; wpa2: string; wpa3: string }; // one line under the picker
	passwordLabel: string;
	weakTag: string; // shown next to an easy to guess password
	strongTag: string; // shown next to a long one
	guestLabel: string; // the guest network switch
	applyBtn: string; // saves the settings and lets the snooper try
	snooperLabel: string; // heading of the snooper's screen
	snooperIdle: string; // before the first try
	/** What the snooper's screen prints. {pw} is replaced with the password. */
	snoop: {
		joinOpen: string;
		readPlain: string;
		captured: string;
		guessing: string;
		cracked: string;
		noLuck: string;
		noise: string;
		wpa3Live: string;
		wpa3Slow: string;
	};
	homeNet: string; // label over the home network group
	guestNet: string; // label over the guest network group
	devices: { laptop: string; tv: string; friend: string };
	noteGuestOff: string;
	noteGuestOn: string;
}
