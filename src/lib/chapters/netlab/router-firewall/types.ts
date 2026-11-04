import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterFirewallText extends RouterLabText {
	gameLabel: string; // the game server out on the internet
	tagGame: string; // packet label for game traffic
	tagWinbox: string; // packet label for a Winbox login attempt
	rulesLabel: string; // heading of the small rule list under the drawing
	/** Plain words for the three rules, in list order (game, Budi may, nobody else may). */
	rules: [string, string, string];
	// Muted "#" lines the terminal prints next to real output
	hintOrder: string; // read from the top, first match wins
}
