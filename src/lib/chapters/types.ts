import type { Component } from 'svelte';

export type Mood =
	| 'calm'
	| 'happy'
	| 'thinking'
	| 'surprised'
	| 'worried'
	| 'excited'
	| 'wink'
	| 'idea'
	| 'sad';

/**
 * Every interactive stage receives its (already language-resolved) text plus
 * two callbacks: `oncomplete` (unlock "Next") and `onstate` (tell Nim what to say).
 * Stages cast `text` to their own specific text interface, e.g. `text as ServerText`.
 */
export type StageProps = {
	text: LessonText;
	oncomplete?: () => void;
	onstate?: (s: string) => void;
	/** Current narrative beat index, so a stage can play an intro on a specific beat. */
	beat?: number;
	/** Lock or unlock the Next button (e.g. while an intro animation is playing). */
	onlock?: (locked: boolean) => void;
	/** Ask the player to show (un-dim) the stage even when it is not the last beat. */
	onshow?: (visible: boolean) => void;
};

/** Base shape shared by every lesson's text. */
export interface LessonText {
	title: string;
	/** Narrative beats, paged one by one with the Next button so text never gets too long. */
	intro: string[];
	/** token -> Nim's reaction line, shown when the user performs an action on the stage. */
	reactions: Record<string, string>;
}

/** Text shared by the small, self contained experiment workbenches. */
export interface ExperimentText extends LessonText {
	labLabel: string;
	goal: string;
	tasks: string[];
	hintLabel: string;
	hint: string;
	scope: string;
	labels: Record<string, string>;
}

export interface ServerText extends LessonText {
	you: string;
	server: string;
	open: string;
	request: string;
	response: string;
	count: string; // template with {n}
}

export interface CloudText extends LessonText {
	homeTitle: string;
	homeSub: string;
	cloudTitle: string;
	cloudSub: string;
	homePoints: string[];
	cloudPoints: string[];
	onpremTerm: string;
	cloudTerm: string;
	offline: string;
}

export interface RegionText extends LessonText {
	users: string;
	readoutPrompt: string;
	pickProvider: string;
	drag: string;
	flatLabel: string;
	globeLabel: string;
	ms: string;
	verdicts: { instant: string; fast: string; ok: string; slow: string; laggy: string };
	compare: { near: string; far: string; hint: string };
}

export interface CableText extends LessonText {
	users: string;
	prompt: string;
	again: string;
	phases: { leaving: string; undersea: string; arrived: string };
	cablesNote: string;
	routeNote: string;
	credit: string;
	compare: { near: string; far: string; hint: string };
	dests: Record<string, string>;
}

export interface AZText extends LessonText {
	worldHint: string;
	back: string;
	serverLabel: string;
	place: string;
	trigger: string;
	statusUp: string;
	statusDown: string;
	activeZones: string;
	regions: Record<string, string>;
	strikeLabel: string;
	news: { src: string; head: string; url: string }[];
	/** The uptime card on the SLA beats, one row per number of nines. */
	slaTitle: string;
	sla: { pct: string; down: string }[];
	slaRule: string; // the memory line under the card
}

export interface FailoverText extends LessonText {
	primaryLabel: string;
	standbyLabel: string;
	serving: string;
	standbyState: string;
	failingOver: string;
	kill: string;
	addHint: string;
	statusUp: string;
	statusDown: string;
	regions: Record<string, string>;
}

export interface RequestJourneyText extends LessonText {
	/** The button that plays the journey, and the one that plays it again. */
	watch: string;
	again: string;
	/** What the phone itself shows, drawn onto its screen inside the 3D scene. */
	screen: {
		site: string;
		button: string;
		sending: string;
		/** The page that arrives at the end, drawn as a real page on the phone. */
		page: { title: string; body: string; cta: string; cardA: string; cardB: string };
	};
	/** How the phone reaches the first hop, home WiFi or mobile data. */
	modes: { wifi: string; cell: string };
	/**
	 * Station names, used only by the plain list shown where WebGL is unavailable.
	 * 'tower' takes the router's place on mobile data.
	 */
	stations: {
		phone: string;
		router: string;
		tower: string;
		isp: string;
		net: string;
		server: string;
	};
}

export interface LaptopServerText extends LessonText {
	laptopLabel: string;
	friendLabel: string;
	worldLabel: string;
	houseLabel: string;
	lanLabel: string;
	ipLabel: string;
	tryLan: string;
	goPublic: string;
	probIp: string;
	probSleep: string;
	probSlow: string;
	recover: string;
	statusLocal: string;
	statusOk: string;
	statusLost: string;
	statusDown: string;
	statusSlow: string;
	noteIdle: string;
	noteLan: string;
	notePublic: string;
	noteIp: string;
	noteSleep: string;
	noteSlow: string;
}

export interface TunnelingText extends LessonText {
	laptopLabel: string;
	localChip: string;
	relayLabel: string;
	relaySub: string;
	friendLabel: string;
	publicUrl: string;
	startTunnel: string;
	visit: string;
	closeLaptop: string;
	reset: string;
	tunnelOff: string;
	tunnelOn: string;
	noteIdle: string;
	noteOn: string;
	noteVisit: string;
	noteClosed: string;
}

export interface VirtualMachineText extends LessonText {
	hostLabel: string;
	hostCpu: string;
	hostRam: string;
	virtLayer: string;
	virtSub: string;
	singleLabel: string;
	singleSub: string;
	addVm: string;
	vmName: string; // template with {n}
	vmSub: string;
	perVm: string;
	usedLabel: string; // template with {n}
	fullLabel: string;
	prompt: string;
}

export interface CliGuiText extends LessonText {
	taskLabel: string; // the shared goal chip, shown above both panels
	guiTab: string; // toggle label
	cliTab: string; // toggle label
	// GUI: a small Windows desktop
	homeCrumb: string; // breadcrumb root, e.g. "Home"
	folderName: string; // the folder to open, e.g. "Documents"
	files: string[]; // what is inside the folder
	guiHint: string; // shown before the folder is opened
	guiOpened: string; // caption once the folder is open
	backLabel: string; // explorer back button
	// CLI: a real, typeable terminal
	promptUser: string; // user@host shown in the prompt, e.g. "nim@nimbus"
	cliHint: string; // muted first line in the terminal
}

export interface RemoteAccessText extends LessonText {
	serverLabel: string;
	dcLabel: string;
	homeLabel: string;
	lockedNote: string;
	idleNote: string;
	pickSsh: string;
	pickRdp: string;
	sshHost: string;
	sshPrompt: string;
	sshCmd: string; // the connect command, typed first
	sshConnecting: string;
	sshOk: string;
	/** Commands typed one by one once logged in. */
	sshSession: { cmd: string; out: string[] }[];
	rdpTitle: string;
	rdpHost: string;
	connecting: string;
	rdpHint: string;
	/** The SSH key pair shown on the key beats, before you connect. */
	keysTitle: string;
	privateKey: string;
	privateFile: string; // file name of the private key, on your laptop
	privateNote: string;
	publicKey: string;
	publicFile: string; // file name of the public key, copied to the server
	publicNote: string;
}

export interface CloudServicesText extends LessonText {
	screenTitle: string; // shown on the screen, e.g. "Cloud services"
	screenSub: string; // small subtitle under it
	openBtn: string; // powers the screen on to reveal the catalog
	/** The IaaS, PaaS, SaaS chart on the service model beats. */
	layers: string[]; // bottom to top, machine, system, platform, app
	youLabel: string; // legend, the part you look after
	providerLabel: string; // legend, the part the provider looks after
	pizza: string[]; // one line per column on the pizza beat
	serverlessNote: string; // footnote under the chart
}

export interface PortText extends LessonText {
	addrLabel: string; // "one address"
	address: string; // the server address shown on the building
	tapHint: string; // shown before any door is opened
	/** Each numbered door (port) and the service waiting behind it. */
	ports: { port: string; name: string; desc: string }[];
}

export interface ApiText extends LessonText {
	frontendLabel: string; // column heading over the phone
	frontendSub: string; // small caption, "what you see"
	backendLabel: string; // column heading over the server
	backendSub: string; // small caption, "where data lives"
	apiLabel: string; // label over the wire between them
	appTitle: string; // header inside the phone app
	tableLabel: string; // the backend table name, e.g. "products"
	emptyHint: string; // the phone screen before it has fetched anything
	fetchBtn: string; // the button that asks the API for data
	reqLabel: string; // the chip travelling to the backend
	respLabel: string; // the chip coming back
	/** The data, held by the backend and shown on the phone once it asks. */
	products: { id: number; name: string; price: number }[];
}

export interface ApiStyleText extends LessonText {
	/** Which API style this lesson focuses on, drives the animation in ApiStyleStage. */
	style: 'rest' | 'graphql' | 'grpc' | 'websocket' | 'webhook';
	clientLabel: string;
	serverLabel: string;
	replayBtn: string; // replays the style's animation on the last beat
}

export interface VersionControlText extends LessonText {
	docLabel: string; // caption over the document
	commitBtn: string; // the button that snapshots the document
	historyLabel: string; // heading over the snapshot list
	snapshotLabel: string; // template with {n}, e.g. "Snapshot {n}"
	/** The commit message shown for each snapshot, in order. Length caps how many commits fit. */
	commitMsgs: string[];
	latestChip: string; // marks the newest snapshot
	viewingChip: string; // template with {n}, shown while browsing an old snapshot
	backLatest: string; // returns from an old snapshot to the newest
}

export interface GitRemoteText extends LessonText {
	laptopLabel: string; // "your laptop"
	gitChip: string; // the small "Git" tag on the laptop
	remoteLabel: string; // the host name, e.g. "GitHub"
	remoteSub: string; // small caption under it, "an online place"
	mateLabel: string; // the teammate's laptop
	commitBtn: string; // snapshot locally
	pushBtn: string; // send commits to the remote
	cloneBtn: string; // teammate copies the remote down
	again: string; // reset the demo
	localChip: string; // "only on your laptop"
	onlineChip: string; // "online, shareable"
}

export interface GitHostsText extends LessonText {
	sameGitChip: string; // "they all speak the same Git"
	exploreHint: string; // nudge to tap each host
	/** Each hosting service, its one line pitch, and a few traits. */
	hosts: { id: string; name: string; tagline: string; traits: string[] }[];
	whyBtn: string; // reveals the "why GitHub" panel
	whyLabel: string; // heading of that panel
	whyPoints: string[]; // the reasons most people land on GitHub
}

export type Lesson = {
	/** A hands on simulation, available alongside Nim from the first beat. */
	playable?: boolean;
	id: string;
	mood: Mood;
	/** Optional mood per narrative beat (visual, language independent). Falls back to `mood`. */
	moods?: Mood[];
	/** Optional mood per reaction token (e.g. a sad face when the site goes down). */
	reactionMood?: Record<string, Mood>;
	/** Optional sub-section label. Consecutive lessons sharing it group under a header in the menu. */
	section?: string;
	stage: Component<StageProps>;
	/** Same shape per language. Resolve with `lesson.text[lang]`. */
	text: { id: LessonText; en: LessonText };
};

export interface ChapterSummary {
	title: string;
	sub: string;
	items: string[];
	nextNote: string;
	restart: string;
}

export type Chapter = {
	id: string;
	number: number;
	/** A gateway chapter (like the provider picker) renders without the "Bab N" prefix. */
	unnumbered?: boolean;
	title: { id: string; en: string };
	lessons: Lesson[];
	summary: { id: ChapterSummary; en: ChapterSummary };
};

export interface SecurityCatalogText extends ExperimentText {
	cases: {
		id: string;
		title: string;
		scene: string;
		request: string;
		control: string;
		before: string;
		after: string;
		explanation: string;
	}[];
}

export interface CvssText extends LessonText {
	labels: Record<string, string>;
	cases: Record<
		'invoice' | 'admin' | 'public',
		{ name: string; title: string; brief: string; result: string }
	>;
	versions: Record<'2.0' | '3.0' | '3.1' | '4.0', string>;
	metrics: Record<string, string>;
}
