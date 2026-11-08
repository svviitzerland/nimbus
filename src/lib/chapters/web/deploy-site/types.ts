import type { LessonText } from '../../types';

export type DeployHost = 'platform' | 'vps';

export interface DeploySiteText extends LessonText {
	certLabel: string;
	certNote: string;

	/** The headline editor. */
	headlineLabel: string;
	startHeadline: string; // what nimbus.com says before your first deploy
	newHeadline: string; // prefilled suggestion for your change
	/** The host picker. */
	hostLabel: string;
	hosts: Record<DeployHost, { name: string; sub: string }>;
	pushBtn: string;
	/** On a VPS you run each step yourself, these are the buttons for them. */
	vpsSteps: string[];
	vpsHint: string;
	/** Actor captions. */
	laptopLabel: string;
	serverLabel: string;
	phoneLabel: string;
	/** Status line under the scene. */
	idleNote: string;
	buildingNote: string;
	vpsNote: string;
	liveNote: string;
	updated: string; // small tag on the phone after a deploy
}
