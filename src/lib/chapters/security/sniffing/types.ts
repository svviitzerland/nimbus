import type { LessonText } from '../../types';

export interface SniffingText extends LessonText {
	/** Short names for the two acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string; // template with {n}
	nextAct: string;
	youLabel: string;
	serverLabel: string; // always nimbus.com
	routerLabel: string; // the real café WiFi box in act 1
	snooperLabel: string; // the stranger at the next table
	twinLabel: string; // the snooper's laptop acting as a fake hotspot
	/** Act 1, the same login sent twice. */
	sendHttp: string;
	sendHttps: string;
	loginTitle: string;
	userLabel: string;
	passLabel: string;
	loginBtn: string;
	loggedIn: string;
	/** The little window under the scene showing what the snooper captured. */
	captureTitle: string;
	captureEmpty: string;
	readableTag: string;
	scrambledTag: string;
	/** Act 2, the fake hotspot. */
	pickWifi: string;
	wifiReal: string;
	wifiTwin: string;
	strongSignal: string;
	openHttp: string;
	openHttps: string;
	blankPage: string;
	pageWelcome: string;
	tamperedTitle: string;
	tamperedBody: string;
	tamperedTag: string; // small label on the box the snooper added
	warnTitle: string;
	warnBody: string;
	warnBack: string;
	/** Human readable lines inside the capture window (raw packet lines live in the stage). */
	capture: {
		swapped: string;
		refused: string;
	};
	notes: {
		idle: string;
		http: string;
		https: string;
		pick: string;
		real: string;
		twin: string;
		mitmHttp: string;
		mitmHttps: string;
	};
}
