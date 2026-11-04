// Modules (modul). A module is one topic, an ordered list of lessons. Tracks (src/lib/tracks.ts)
// are built by lining modules up, so a module like Database is written once and shows up in the
// Web, Cloud, and AI tracks alike.
//
// Each item is either a shipped lesson as `chapter/lesson` or a planned one, `soon(id, id text,
// en text)`. Soon ids are unique across all modules, so a cross link like `[[HTTPS|security:tls]]`
// can point at a lesson before it exists. CURRICULUM.md describes every lesson and its stage.
//
// Titles are learner facing copy, so the usual rules apply (no dashes, no colons).

type L10n = { id: string; en: string };

/** A shipped lesson as `chapter/lesson`, or a planned one that is not built yet. */
export type TrackItem = string | { soon: string; title: L10n };

export interface Module {
	id: string;
	title: L10n;
	/** Basecamp modules are shared foundations that open a track, not a subject of their own. */
	basecamp?: boolean;
	/** A branch only module (like the cloud providers), left out of Dari Nol on purpose. */
	branch?: boolean;
	/** One option of a learner choice, e.g. the lab gear. A track only plays the option the learner
	 *  picked (or the first option until they pick), the others stay visible in the menu. */
	variant?: { choice: string; option: string };
	items: TrackItem[];
}

const soon = (id: string, idText: string, enText: string): TrackItem => ({
	soon: id,
	title: { id: idText, en: enText }
});

const m = (
	id: string,
	idTitle: string,
	enTitle: string,
	items: TrackItem[],
	basecamp = false,
	branch = false
): Module => ({ id, title: { id: idTitle, en: enTitle }, basecamp, branch, items });

export const modules: Module[] = [
	// Basecamp. Small shared foundations every track can borrow.
	m(
		'computer',
		'Cara Komputer Bekerja',
		'How a Computer Works',
		['basics/history', 'basics/hardware', 'basics/binary', 'basics/os'],
		true
	),
	m(
		'code',
		'Cara Komputer Memahami Kode',
		'How a Computer Understands Code',
		[
			'basics/program',
			'basics/languages',
			'basics/compiler',
			'basics/runtime',
			'foundations/cli-gui'
		],
		true
	),
	m(
		'internet',
		'Client dan Server',
		'Client and Server',
		['foundations/server', 'foundations/request-journey', 'foundations/port', 'web/http'],
		true
	),
	m('git', 'Git dan GitHub', 'Git and GitHub', [
		'compute/version-control',
		'compute/git-vs-github',
		'compute/git-branch',
		'compute/pull-request',
		'compute/git-hosts'
	]),
	m(
		'net-essentials',
		'Bekal Jaringan',
		'Network Essentials',
		['network/ip-address', 'networking/dns', 'networking/layers'],
		true
	),

	// Network
	m('net-basics', 'Dasar Jaringan', 'Network Basics', [
		'network/lan-wan',
		'network/devices',
		'network/cabling',
		'cloud/cable',
		'network/wifi'
	]),
	m('addressing', 'Pengalamatan', 'Addressing', [
		'network/mac',
		'network/ip-address',
		'networking/dns',
		'network/subnet',
		'network/dhcp',
		'network/nat',
		'network/ipv6'
	]),
	m('delivery', 'Routing dan Protokol', 'Routing and Protocols', [
		'networking/layers',
		'network/routing',
		'network/dynamic-routing',
		'network/vlan',
		'network/protocols'
	]),
	m('capacity', 'Kapasitas', 'Capacity', [
		'trafficflow/ingress-egress',
		'trafficflow/bandwidth-throughput',
		'trafficflow/bottleneck',
		'network/qos'
	]),
	m('net-guard', 'Keamanan Jaringan', 'Network Security', [
		'networking/vpc',
		'networking/firewall',
		'network/vpn',
		'network/wifi-security'
	]),
	m('lab', 'Lab Jaringan', 'Network Lab', ['netlab/lab-pick']),
	{
		...m('lab-mikrotik', 'Lab MikroTik', 'MikroTik Lab', []),
		variant: { choice: 'lab', option: 'mikrotik' },
		items: [
			'netlab/router-intro',
			'netlab/router-ip',
			'netlab/router-nat',
			'netlab/router-firewall',
			'netlab/router-queue',
			'netlab/router-hotspot'
		]
	},
	{
		...m('lab-cisco', 'Lab Cisco', 'Cisco Lab', []),
		variant: { choice: 'lab', option: 'cisco' },
		items: [
			'netlab/cisco-intro',
			'netlab/cisco-ip',
			'netlab/cisco-nat',
			'netlab/cisco-acl',
			'netlab/cisco-vlan',
			'netlab/cisco-ssh'
		]
	},
	m('net-tools', 'Troubleshooting', 'Troubleshooting', [
		'network/ping',
		'network/wireshark',
		'network/troubleshoot'
	]),

	// Web
	m('web-how', 'Cara Web Bekerja', 'How the Web Works', [
		'web/http',
		'web/browser',
		'networking/dns',
		'web/domain-hosting'
	]),
	m('frontend', 'Frontend', 'Frontend', [
		'web/html',
		'web/css',
		'web/js',
		'web/dom',
		'web/responsive',
		'web/a11y'
	]),
	m('design', 'Desain', 'Design', ['web/ui-ux', 'web/design-to-code']),
	m('frameworks', 'Framework', 'Frameworks', [
		'web/why-framework',
		'web/components',
		'web/rendering',
		'web/build-tools'
	]),
	m('backend', 'Backend', 'Backend', [
		'foundations/api',
		'web/backend-what',
		'foundations/apiRest',
		'foundations/apiGraphql',
		'foundations/apiGrpc',
		'foundations/apiWebsocket',
		'foundations/apiWebhook',
		'web/auth',
		'web/backend-frameworks',
		'web/config-secrets',
		'web/jobs'
	]),
	m('database', 'Database', 'Database', [
		'web/sql',
		'web/sql-commands',
		'web/relations',
		'resilience/database',
		'web/db-index',
		'web/transaction',
		'web/oltp-olap',
		'web/replication',
		'web/cache'
	]),
	m('go-live', 'Deploy', 'Deploy', [
		'foundations/laptop-server',
		'foundations/tunneling',
		'web/deploy-site'
	]),
	m('mobile', 'Mobile', 'Mobile', ['web/mobile-apps', 'web/pwa']),

	// Cloud & DevOps
	m('cloud-basics', 'Cloud', 'Cloud', [
		'foundations/cli-gui',
		'foundations/virtual-machine',
		'cloud/cloud',
		'cloud/remote-access',
		'cloud/services',
		'cloud/region'
	]),
	m('resilience', 'Ketahanan', 'Resilience', [
		'resilience/availability-zone',
		'resilience/failover',
		'devops/backup'
	]),
	m('storage', 'Penyimpanan', 'Storage', ['resilience/storage-types', 'resilience/database']),
	m('scale', 'Scaling', 'Scaling', [
		'traffic/reverse-proxy',
		'traffic/load-balancer',
		'traffic/scaling',
		'traffic/auto-scaling',
		'traffic/cdn'
	]),
	m('cloud-net', 'Jaringan Cloud', 'Cloud Networking', [
		'networking/vpc',
		'networking/firewall',
		'networking/iam',
		'networking/shared-responsibility'
	]),
	m('run-code', 'Container dan Serverless', 'Containers and Serverless', [
		'compute/container',
		'compute/microservices',
		'compute/serverless'
	]),
	m('linux', 'Linux', 'Linux', [
		'linux/linux-files',
		'linux/permissions',
		'linux/packages',
		'linux/services',
		'linux/shell-script'
	]),
	m('devops', 'DevOps', 'DevOps', [
		'devops/what-devops',
		'compute/testing',
		'compute/cicd',
		'devops/iac',
		'devops/config-mgmt',
		'devops/kubernetes',
		'devops/release'
	]),
	m('operations', 'Operasi', 'Operations', [
		'compute/monitoring',
		'devops/logs',
		'devops/on-call',
		'compute/cost'
	]),
	m(
		'providers',
		'Cabang Provider',
		'Provider Branch',
		['capstone/build', 'providers/aws', 'providers/gcp', 'providers/azure'],
		false,
		true
	),

	// Security
	m('sec-mindset', 'Dasar Keamanan', 'Security Basics', [
		'security/cia',
		'security/threats',
		'security/hat-colors'
	]),
	m('identity', 'Identitas', 'Identity', [
		'networking/iam',
		'security/hashing',
		'security/mfa',
		'security/sso'
	]),
	m('crypto', 'Kriptografi', 'Cryptography', [
		'networking/encryption',
		'security/keys',
		'security/tls',
		'security/signature',
		'security/blockchain'
	]),
	m('attacks', 'Serangan', 'Attacks', [
		'security/sniffing',
		'security/phishing',
		'security/brute-force',
		'security/web-attacks',
		'security/malware',
		'security/ddos'
	]),
	m('defense', 'Pertahanan', 'Defense', [
		'networking/firewall',
		'security/hardening',
		'security/ids',
		'security/detection',
		'security/incident',
		'networking/shared-responsibility'
	]),
	m('sec-practice', 'Ethical Hacking', 'Ethical Hacking', ['security/pentest', 'security/ctf']),

	// AI & ML
	m('ai-intro', 'Dasar AI', 'AI Basics', ['ai/what-is-ai', 'ai/data']),
	m('ml', 'Machine Learning', 'Machine Learning', [
		'ai/training',
		'ai/predict',
		'ai/supervised',
		'ai/overfitting',
		'ai/evaluation',
		'ai/inference'
	]),
	m('deep-learning', 'Deep Learning', 'Deep Learning', [
		'ai/neural-net',
		'ai/learning-loop',
		'ai/vision',
		'ai/gpu'
	]),
	m('genai', 'AI Generatif', 'Generative AI', [
		'ai/llm',
		'ai/prompting',
		'ai/embeddings',
		'ai/rag',
		'ai/fine-tuning',
		'ai/agents',
		'ai/image-gen'
	]),
	m('ai-real', 'AI dalam Praktik', 'AI in Practice', [
		'ai/ai-api',
		'ai/ai-cloud',
		'ai/ai-safety',
		'ai/ai-ethics'
	])
];

export function getModule(id: string): Module | undefined {
	return modules.find((x) => x.id === id);
}
