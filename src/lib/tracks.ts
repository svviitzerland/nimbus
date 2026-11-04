// NOTE: stages import this file (through path.svelte.ts), and the chapter registry imports the
// stages, so nothing here may touch `chapters` while the module is being evaluated. Only call
// getChapter inside functions.
//
// Learning tracks (jalur). A track lines up modules (src/lib/modules.ts) for one goal, and every
// module is an ordered list of lessons from the shared pool in src/lib/chapters. Lessons are never
// duplicated: a lesson finished in one track counts as done in every track that contains it,
// because progress is keyed by `chapter/lesson`.
//
// `general` (Dari Nol) blends every lesson of every track into one path. Topic tracks open with a few Basecamp modules (only the foundations that topic needs),
// then go deep on their own subject. Planned lessons are `soon` items, so the menu and cross links
// can already point at them before they are built.
import { getChapter } from './chapters';
import { getModule, modules, type Module, type TrackItem } from './modules';

export type { TrackItem } from './modules';
export type TrackId = 'general' | 'network' | 'web' | 'cloud' | 'security' | 'ai';
type L10n = { id: string; en: string };

export interface TrackGroup {
	title: L10n;
	/** Basecamp groups hold borrowed foundation lessons, not the track's own subject. */
	basecamp?: boolean;
	/** Chapter number to show in the menu badge (General only). */
	number?: number;
	/** Set when the group is one option of a learner choice (see Module.variant). */
	variant?: { choice: string; option: string };
	items: TrackItem[];
}

export interface Track {
	id: TrackId;
	color: string;
	title: L10n;
	tagline: L10n;
	/** The whole track is still being built, so it can be previewed but not started. */
	soon?: boolean;
	/** Module ids, in order. Basecamp modules first. */
	modules: string[];
	/** Resolved for display and navigation (one group per module, or per chapter in General). */
	groups: TrackGroup[];
}

type TrackDef = Omit<Track, 'groups'>;

function fromModules(def: TrackDef): Track {
	const groups = def.modules.map((id) => {
		const mod = getModule(id);
		if (!mod) throw new Error(`Track ${def.id} lists unknown module ${id}`);
		return { title: mod.title, basecamp: mod.basecamp, variant: mod.variant, items: mod.items };
	});
	return { ...def, groups };
}

// Dari Nol covers every lesson of every track in one blended path, grouped into chapters (Bab)
// by what is easiest to learn next, not by subject. A key is a lesson path (`chapter/lesson`) or
// the id of a planned lesson. Branch only modules (the cloud providers) stay out, and Dari Nol ends at
// the crossroads, where the learner branches into one track. The order reads like a story, each
// chapter using only what came before (computer, code, internet, web, apps, Git, going online,
// servers, cloud, networks, the lab, security, DevOps, AI). Some lessons refer back to earlier
// ones ("remember latency in the Cloud chapter"), so keep those after the lesson they mention.
const GENERAL: { id: string; en: string; keys: string[] }[] = [
	{
		id: 'Komputer',
		en: 'Computers',
		keys: ['basics/history', 'basics/hardware', 'basics/binary', 'basics/os']
	},
	{
		id: 'Kode',
		en: 'Code',
		keys: [
			'basics/program',
			'basics/languages',
			'basics/compiler',
			'basics/runtime',
			'foundations/cli-gui'
		]
	},
	{
		id: 'Internet',
		en: 'The Internet',
		keys: [
			'foundations/server',
			'foundations/request-journey',
			'network/lan-wan',
			'network/devices',
			'network/cabling',
			'network/wifi',
			'cloud/cable',
			'network/ip-address',
			'networking/dns',
			'foundations/port'
		]
	},
	{
		id: 'Cara Data Berjalan',
		en: 'How Data Travels',
		keys: [
			'networking/layers',
			'network/protocols',
			'network/mac',
			'network/subnet',
			'network/dhcp',
			'network/nat',
			'network/ipv6',
			'network/routing',
			'network/dynamic-routing'
		]
	},
	{
		id: 'Web',
		en: 'The Web',
		keys: [
			'web/http',
			'web/browser',
			'web/html',
			'web/css',
			'web/js',
			'web/dom',
			'web/responsive',
			'web/a11y',
			'web/ui-ux',
			'web/design-to-code'
		]
	},
	{
		id: 'Aplikasi dan Backend',
		en: 'Apps and Backends',
		keys: [
			'web/why-framework',
			'web/components',
			'web/rendering',
			'web/build-tools',
			'web/backend-what',
			'foundations/api',
			'foundations/apiRest',
			'foundations/apiGraphql',
			'foundations/apiGrpc',
			'foundations/apiWebsocket',
			'foundations/apiWebhook',
			'web/auth',
			'web/backend-frameworks',
			'web/jobs'
		]
	},
	{
		id: 'Data',
		en: 'Data',
		keys: [
			'resilience/database',
			'web/sql',
			'web/sql-commands',
			'web/relations',
			'web/db-index',
			'web/transaction',
			'web/oltp-olap',
			'web/cache'
		]
	},
	{
		id: 'Git dan Kerja Bareng',
		en: 'Git and Teamwork',
		keys: ['compute/version-control', 'compute/git-vs-github', 'compute/git-hosts']
	},
	{
		id: 'Online kan Situsmu',
		en: 'Put Your Site Online',
		keys: [
			'foundations/laptop-server',
			'foundations/tunneling',
			'web/domain-hosting',
			'web/deploy-site',
			'web/mobile-apps',
			'web/pwa'
		]
	},
	{
		id: 'Server dan Linux',
		en: 'Servers and Linux',
		keys: [
			'foundations/virtual-machine',
			'linux/linux-files',
			'linux/permissions',
			'linux/packages',
			'linux/services',
			'linux/shell-script'
		]
	},
	{
		id: 'Cloud',
		en: 'Cloud',
		keys: [
			'cloud/cloud',
			'cloud/remote-access',
			'cloud/services',
			'cloud/region',
			'resilience/availability-zone',
			'resilience/failover',
			'devops/backup',
			'resilience/storage-types'
		]
	},
	{
		id: 'Lalu Lintas',
		en: 'Traffic',
		keys: [
			'trafficflow/ingress-egress',
			'trafficflow/bandwidth-throughput',
			'trafficflow/bottleneck',
			'network/qos',
			'traffic/reverse-proxy',
			'traffic/load-balancer',
			'traffic/scaling',
			'traffic/auto-scaling',
			'traffic/cdn'
		]
	},
	{
		id: 'Jaringan Pribadi',
		en: 'Private Networks',
		keys: [
			'networking/vpc',
			'networking/firewall',
			'network/vlan',
			'network/vpn',
			'network/wifi-security'
		]
	},
	{
		id: 'Lab Jaringan',
		en: 'Network Lab',
		keys: [
			'netlab/lab-pick',
			'netlab/router-intro',
			'netlab/router-ip',
			'netlab/router-nat',
			'netlab/router-firewall',
			'netlab/router-queue',
			'netlab/router-hotspot',
			'netlab/cisco-intro',
			'netlab/cisco-ip',
			'netlab/cisco-nat',
			'netlab/cisco-acl',
			'netlab/cisco-vlan',
			'netlab/cisco-ssh',
			'network/ping',
			'network/wireshark',
			'network/troubleshoot'
		]
	},
	{
		id: 'Dasar Keamanan',
		en: 'Security Basics',
		keys: [
			'security/cia',
			'security/threats',
			'security/hat-colors',
			'networking/iam',
			'security/hashing',
			'security/mfa',
			'security/sso',
			'networking/shared-responsibility'
		]
	},
	{
		id: 'Kriptografi',
		en: 'Cryptography',
		keys: [
			'networking/encryption',
			'security/keys',
			'security/tls',
			'security/signature',
			'security/blockchain'
		]
	},
	{
		id: 'Serangan dan Pertahanan',
		en: 'Attacks and Defense',
		keys: [
			'security/sniffing',
			'security/phishing',
			'security/brute-force',
			'security/web-attacks',
			'security/malware',
			'security/ddos',
			'security/hardening',
			'security/ids',
			'security/detection',
			'security/incident',
			'security/pentest',
			'security/ctf'
		]
	},
	{
		id: 'Komputasi dan DevOps',
		en: 'Compute and DevOps',
		keys: [
			'compute/container',
			'compute/microservices',
			'compute/serverless',
			'devops/what-devops',
			'compute/cicd',
			'devops/iac',
			'devops/config-mgmt',
			'devops/kubernetes',
			'devops/release',
			'compute/monitoring',
			'devops/logs',
			'devops/on-call',
			'compute/cost'
		]
	},
	{
		id: 'Dasar AI',
		en: 'AI Basics',
		keys: [
			'ai/what-is-ai',
			'ai/data',
			'ai/training',
			'ai/predict',
			'ai/supervised',
			'ai/overfitting',
			'ai/evaluation',
			'ai/inference'
		]
	},
	{
		id: 'Deep Learning dan AI Generatif',
		en: 'Deep Learning and Generative AI',
		keys: [
			'ai/neural-net',
			'ai/learning-loop',
			'ai/vision',
			'ai/gpu',
			'ai/llm',
			'ai/prompting',
			'ai/embeddings',
			'ai/rag',
			'ai/fine-tuning',
			'ai/agents',
			'ai/image-gen',
			'ai/ai-api',
			'ai/ai-cloud',
			'ai/ai-safety',
			'ai/ai-ethics'
		]
	},
	{
		id: 'Persimpangan',
		en: 'Crossroads',
		keys: ['capstone/crossroads']
	}
];

/** Every item by key: lesson paths map to themselves, planned ids to their soon item. */
const ITEMS = new Map<string, TrackItem>();
for (const mod of modules)
	for (const it of mod.items) ITEMS.set(typeof it === 'string' ? it : it.soon, it);

const general: Track = {
	id: 'general',
	color: '#2e6fe0',
	title: { id: 'Dari Nol', en: 'From Zero' },
	tagline: {
		id: 'Belum tahu mau mulai dari mana? Ikuti aku, semua topik kita pelajari satu per satu dari dasar banget.',
		en: 'Not sure where to start? Follow me and we cover every topic one by one, from the very basics.'
	},
	modules: [],
	groups: GENERAL.map((g, i) => ({
		title: { id: g.id, en: g.en },
		number: i + 1,
		items: g.keys.map((k) => {
			// a lesson that lives only in Dari Nol (like the crossroads) is listed by its path
			// (no chapter lookup here, this runs while the chapter registry may still be loading)
			const it = ITEMS.get(k) ?? (k.includes('/') ? k : undefined);
			if (!it) throw new Error(`Dari Nol lists unknown lesson ${k}`);
			return it;
		})
	}))
};

const topicTracks: TrackDef[] = [
	{
		id: 'network',
		color: '#3a9c64',
		title: { id: 'Jaringan', en: 'Network' },
		tagline: {
			id: 'Cara data berpindah dari HP kamu ke server di ujung dunia, sampai ngatur router sendiri.',
			en: 'How data travels from your phone to a server across the world, up to running your own router.'
		},
		modules: [
			'internet',
			'net-basics',
			'addressing',
			'delivery',
			'capacity',
			'net-guard',
			'lab',
			'lab-mikrotik',
			'lab-cisco',
			'net-tools'
		]
	},
	{
		id: 'web',
		color: '#e27a36',
		title: { id: 'Web', en: 'Web' },
		tagline: {
			id: 'Dari halaman yang kamu lihat sampai server dan database di belakangnya.',
			en: 'From the page you see to the server and database behind it.'
		},
		modules: [
			'code',
			'internet',
			'web-how',
			'frontend',
			'design',
			'frameworks',
			'backend',
			'database',
			'git',
			'go-live',
			'mobile'
		]
	},
	{
		id: 'cloud',
		color: '#2a9fb0',
		title: { id: 'Cloud & DevOps', en: 'Cloud & DevOps' },
		tagline: {
			id: 'Sewa server, sebar ke seluruh dunia, otomatiskan rilisnya, dan tetap hemat.',
			en: 'Rent servers, spread them worldwide, automate every release, and stay on budget.'
		},
		modules: [
			'internet',
			'net-essentials',
			'cloud-basics',
			'linux',
			'resilience',
			'storage',
			'capacity',
			'scale',
			'cloud-net',
			'run-code',
			'git',
			'devops',
			'operations',
			'providers'
		]
	},
	{
		id: 'security',
		color: '#d3584a',
		title: { id: 'Keamanan', en: 'Security' },
		tagline: {
			id: 'Cara penyerang berpikir, cara data dikunci, dan cara menjaga sistem tetap aman.',
			en: 'How attackers think, how data gets locked, and how to keep a system safe.'
		},
		modules: [
			'internet',
			'net-essentials',
			'sec-mindset',
			'identity',
			'crypto',
			'attacks',
			'defense',
			'sec-practice'
		]
	},
	{
		id: 'ai',
		color: '#cf5a92',
		title: { id: 'AI & ML', en: 'AI & ML' },
		tagline: {
			id: 'Dari machine learning sampai chatbot, cara mesin belajar dari contoh.',
			en: 'From machine learning to chatbots, how a machine learns from examples.'
		},
		modules: ['internet', 'ai-intro', 'ml', 'deep-learning', 'genai', 'ai-real']
	}
];

/** All tracks, in the order the picker shows them. General first, it is Nim's pick. */
export const tracks: Track[] = [general, ...topicTracks.map(fromModules)];

export function getTrack(id?: string | null): Track | undefined {
	return tracks.find((t) => t.id === id);
}

export type LessonRef = { chapterId: string; lessonId: string };

export function parseRef(item: string): LessonRef | undefined {
	const [chapterId, lessonId] = item.split('/');
	const c = getChapter(chapterId);
	if (!c || !c.lessons.some((l) => l.id === lessonId)) return undefined;
	return { chapterId, lessonId };
}

/** Learner choices, e.g. `{ lab: 'cisco' }`. Missing choices fall back to the first option. */
export type Choices = Record<string, string>;

/** Which choice option each item belongs to, for items inside a variant module. */
const VARIANT_OF = new Map<string, { choice: string; option: string }>();
const FIRST_OPTION = new Map<string, string>();
for (const mod of modules)
	if (mod.variant) {
		if (!FIRST_OPTION.has(mod.variant.choice))
			FIRST_OPTION.set(mod.variant.choice, mod.variant.option);
		for (const it of mod.items) VARIANT_OF.set(typeof it === 'string' ? it : it.soon, mod.variant);
	}

export function variantOf(item: TrackItem): { choice: string; option: string } | undefined {
	return VARIANT_OF.get(typeof item === 'string' ? item : item.soon);
}

/** The option a learner is on for a choice, their pick or the first option. */
export function optionFor(choice: string, choices: Choices = {}): string | undefined {
	return choices[choice] ?? FIRST_OPTION.get(choice);
}

/** The playable lessons of a track, in order (planned items, repeats, and the options of a choice
 *  the learner did not pick are skipped). */
export function trackSequence(track: Track, choices: Choices = {}): LessonRef[] {
	const out: LessonRef[] = [];
	const seen = new Set<string>();
	for (const g of track.groups)
		for (const it of g.items) {
			if (typeof it !== 'string' || seen.has(it)) continue;
			const v = variantOf(it);
			if (v && optionFor(v.choice, choices) !== v.option) continue;
			const r = parseRef(it);
			if (r) {
				seen.add(it);
				out.push(r);
			}
		}
	return out;
}

export function trackCounts(track: Track, choices: Choices = {}): { ready: number; soon: number } {
	const soonIds = new Set<string>();
	for (const g of track.groups)
		for (const it of g.items) if (typeof it !== 'string') soonIds.add(it.soon);
	return { ready: trackSequence(track, choices).length, soon: soonIds.size };
}

// Which topic track "owns" a lesson, for cross links ("this is covered in the Security track").
// Earlier tracks win when a lesson appears in several, and Basecamp modules never own anything.
const OWNER_ORDER: TrackId[] = ['security', 'ai', 'network', 'web', 'cloud'];

function ownerOf(match: (mod: Module) => boolean): Track | undefined {
	for (const id of OWNER_ORDER) {
		const t = getTrack(id)!;
		if (t.modules.some((mid) => !getModule(mid)?.basecamp && match(getModule(mid)!))) return t;
	}
	return undefined;
}

export function homeTrackOf(chapterId: string, lessonId: string): Track | undefined {
	const key = `${chapterId}/${lessonId}`;
	return ownerOf((mod) => mod.items.includes(key));
}

/** A planned item by its `soon` id, the module it sits in, and the track that teaches it (none for
 *  a Basecamp only lesson). `trackId` is a hint, used when the item lives in that track. */
export function findSoon(
	trackId: string,
	soonId: string
): { track?: Track; module: Module; title: L10n } | undefined {
	const has = (mod: Module) => mod.items.some((it) => typeof it !== 'string' && it.soon === soonId);
	const mod = modules.find(has);
	if (!mod) return undefined;
	const item = mod.items.find((it) => typeof it !== 'string' && it.soon === soonId) as {
		title: L10n;
	};
	const hinted = getTrack(trackId);
	const track =
		hinted && hinted.modules.some((mid) => has(getModule(mid)!)) ? hinted : ownerOf(has);
	return { track, module: mod, title: item.title };
}
