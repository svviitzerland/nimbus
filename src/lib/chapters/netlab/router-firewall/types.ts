import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterFirewallText extends RouterLabText {
	// missions are the four tests, in order: Sari to the game, Sari to nimbus.com,
	// Sari to Winbox, the admin to Winbox
	runBtn: string; // runs every test
	running: string; // the button while tests run
	staffName: string; // Sari, the staff laptop
	adminName: string; // Budi, the admin laptop
	netLabel: string; // the far server box, the internet
	builderTitle: string; // title bar of the Winbox style window
	chainLabel: string;
	srcLabel: string;
	targetLabel: string;
	actionLabel: string;
	anyone: string; // src-address left empty
	targets: { game: string; winbox: string; any: string };
	actions: { accept: string; drop: string };
	addBtn: string;
	rulesTitle: string;
	emptyRules: string; // no rules yet, everything is accepted
	defaultRow: string; // the implicit last line, accept everything else
	packetsLabel: string; // column header for hit counters
	upLabel: string; // aria labels for the row buttons
	downLabel: string;
	removeLabel: string;
	logTitle: string; // the command log under the window
}
