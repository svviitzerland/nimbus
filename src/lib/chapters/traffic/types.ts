import type { LessonText } from '../types';

export interface ReverseProxyText extends LessonText {
	promptLabel: string;
	youLabel: string;
	proxyLabel: string;
	proxySub: string;
	publicAddr: string;
	idleHint: string;
	hiddenLabel: string;
	// kind drives what the phone renders: 'page' | 'json' | 'image'
	routes: { path: string; label: string; backend: string; btn: string; kind: string }[];
	routedNote: string; // template with {n}
}

export interface LoadBalancerText extends LessonText {
	startSale: string;
	addServer: string;
	killServer: string;
	reset: string;
	balancerLabel: string;
	balancerNote: string;
	serverLabel: string; // template with {n}
	crowdOne: string;
	crowdMany: string;
	promptStart: string;
	promptOverload: string;
	promptBalanced: string;
	promptDone: string;
	statusUp: string;
	statusOver: string;
	statusDown: string;
	siteFast: string;
	siteSlow: string;
	siteDown: string;
	loadLabel: string;
	/** The stateless scene on the session beats. */
	youLabel: string; // over the phone
	loggedIn: string;
	loggedOut: string;
	memoryLabel: string; // a server remembering you in its own memory
	unknownLabel: string; // a server that has never seen you
	storeLabel: string; // the shared session store
	storeNote: string;
}

export interface ScalingText extends LessonText {
	tabVertical: string;
	tabHorizontal: string;
	hintVertical: string;
	hintHorizontal: string;
	trafficLabel: string;
	levelCalm: string;
	levelBusy: string;
	levelFlood: string;
	statusOk: string;
	statusOver: string;
	promptRaise: string;
	promptRescue: string;
	promptDone: string;
	specCpu: string;
	specRam: string;
	specDisk: string;
	perMachineSpec: string;
	capacity: string; // template with {n}
	upgrade: string;
	downgrade: string;
	maxedOut: string;
	siteDown: string;
	addMachine: string;
	removeMachine: string;
	balancerLabel: string;
	machineLabel: string; // template with {n}
	tradeoffVertical: string;
	tradeoffHorizontal: string;
}

export interface AutoScalingText extends LessonText {
	trafficLabel: string;
	plusLabel: string;
	minusLabel: string;
	balancerLabel: string;
	ruleTitle: string;
	cpuLabel: string;
	condUp: string;
	actUp: string;
	condDown: string;
	actDown: string;
	addEvent: string;
	removeEvent: string;
	costLabel: string; // template with {n}
	promptRaise: string;
	promptWatch: string;
	promptDrop: string;
	promptDone: string;
}

export interface CdnText extends LessonText {
	cdnOn: string;
	cdnOff: string;
	statusOff: string;
	statusOn: string; // template with {n}
	originLabel: string;
	edgeLabel: string;
	visitorsLabel: string;
	servedOrigin: string;
	servedEdge: string; // template with {city}
	hitChip: string;
	verdictFast: string;
	verdictOk: string;
	verdictSlow: string;
	readoutPrompt: string;
	compare: { off: string; on: string; hint: string };
	ms: string;
	cities: Record<string, string>;
}
