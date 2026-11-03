import type { LessonText } from '$lib/chapters/types';

/** The concepts every provider lesson maps, one slot each on the architecture board. */
export type SlotKey =
	| 'dns'
	| 'cdn'
	| 'lb'
	| 'network'
	| 'firewall'
	| 'vm'
	| 'container'
	| 'function'
	| 'files'
	| 'sql'
	| 'nosql'
	| 'iam'
	| 'keys'
	| 'monitor';

/** The board is built layer by layer, from the front door down to the ops tools. */
export const LAYERS: SlotKey[][] = [
	['dns', 'cdn', 'lb'],
	['network', 'firewall'],
	['vm', 'container', 'function'],
	['files', 'sql', 'nosql'],
	['iam', 'keys', 'monitor']
];

/** The path a visitor's request lights up once the whole board is built. */
export const VISIT_PATH: SlotKey[] = [
	'dns',
	'cdn',
	'lb',
	'network',
	'firewall',
	'vm',
	'sql',
	'files',
	'monitor'
];

/** Text shared by the three provider lessons (each lesson keeps its own copy of it). */
export interface ProviderBoardText extends LessonText {
	boardTitle: string; // e.g. "nimbus.com on AWS"
	youLabel: string; // the visitor's phone at the top of the board
	layers: string[]; // one name per layer in LAYERS
	concepts: Record<SlotKey, string>; // the concept name shown on each slot
	trayLabel: string; // heading over the service tiles
	pickHint: string; // before a tile is picked
	placeHint: string; // template with {s}, after a tile is picked
	missTag: string; // flashed on a slot that does not fit
	layerTag: string; // template with {n} and {t}, the progress chip
	liveBtn: string; // sends a visitor through the finished board
	noteDone: string; // all slots filled, before the visitor
	noteLive: string; // after the visitor made it through
}
