import type { LessonText } from '$lib/chapters/types';

export type ProviderId = 'aws' | 'gcp' | 'azure';

/** The concepts every provider lesson maps, one tile each on the architecture board. */
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

/** The real service name each provider puts on each idea. */
export const SERVICES: Record<ProviderId, Record<SlotKey, string>> = {
	aws: {
		dns: 'Route 53',
		cdn: 'CloudFront',
		lb: 'Elastic Load Balancing',
		network: 'VPC',
		firewall: 'Security Groups',
		vm: 'EC2',
		container: 'ECS',
		function: 'Lambda',
		files: 'S3',
		sql: 'RDS',
		nosql: 'DynamoDB',
		iam: 'IAM',
		keys: 'KMS',
		monitor: 'CloudWatch'
	},
	gcp: {
		dns: 'Cloud DNS',
		cdn: 'Cloud CDN',
		lb: 'Cloud Load Balancing',
		network: 'VPC',
		firewall: 'Firewall rules',
		vm: 'Compute Engine',
		container: 'Cloud Run',
		function: 'Cloud Functions',
		files: 'Cloud Storage',
		sql: 'Cloud SQL',
		nosql: 'Firestore',
		iam: 'IAM',
		keys: 'Cloud KMS',
		monitor: 'Cloud Monitoring'
	},
	azure: {
		dns: 'Azure DNS',
		cdn: 'Front Door',
		lb: 'Load Balancer',
		network: 'VNet',
		firewall: 'NSG',
		vm: 'Virtual Machines',
		container: 'Container Apps',
		function: 'Functions',
		files: 'Blob Storage',
		sql: 'Azure SQL',
		nosql: 'Cosmos DB',
		iam: 'Entra ID',
		keys: 'Key Vault',
		monitor: 'Azure Monitor'
	}
};

/**
 * What the board does on each beat. Every provider lesson uses the same ten beats, so the
 * visual and Nim's story always line up.
 */
export type Phase =
	| { kind: 'meet' }
	| { kind: 'layer'; layer: number }
	| { kind: 'ingat' }
	| { kind: 'others' }
	| { kind: 'live' };

export const PHASES: Phase[] = [
	{ kind: 'meet' },
	{ kind: 'meet' },
	{ kind: 'layer', layer: 0 },
	{ kind: 'layer', layer: 1 },
	{ kind: 'layer', layer: 2 },
	{ kind: 'layer', layer: 3 },
	{ kind: 'layer', layer: 4 },
	{ kind: 'ingat' },
	{ kind: 'others' },
	{ kind: 'live' }
];

/** Text shared by the three provider lessons (each lesson keeps its own copy of it). */
export interface ProviderBoardText extends LessonText {
	/** The side panel, one entry per beat (ten, matching PHASES). */
	steps: { tag: string; title: string; body: string }[];
	boardTitle: string; // e.g. "nimbus.com on AWS"
	youLabel: string; // the visitor's phone at the top of the board
	layers: string[]; // one name per layer in LAYERS
	concepts: Record<SlotKey, string>; // the plain idea shown on the front of each tile
	sameIdea: string; // caption over the three providers' names for the sticky idea
	playBtn: string; // optional, try the matching yourself
	trayLabel: string; // heading over the service tiles while matching
	pickHint: string; // before a tile is picked
	placeHint: string; // template with {s}, after a tile is picked
	missTag: string; // flashed on a tile that does not fit
	noteLive: string; // after the visitor made it through in the matching game
}
