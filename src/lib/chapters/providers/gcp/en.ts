import type { GcpText } from './types';

export const en: GcpText = {
	title: 'Google Cloud',
	intro: [
		'Google ran Search, Gmail, and YouTube for billions of people long before it rented out a single server. <b>Google Cloud</b> lets you use that very same machinery.',
		'It began in 2008 with App Engine, a place to run code without touching any server. Compute Engine, its plain rented servers, followed in 2012.',
		'Google names things plainly. Cloud Storage stores, Cloud SQL is SQL. So the puzzle here is less about decoding names and more about spotting which idea each one belongs to.',
		'[fyi] Same word, different reach. On Google Cloud one VPC can stretch across every region in the world, while on [[AWS|providers/aws]] and [[Azure|providers/azure]] each private network lives inside one region.',
		'Let us build nimbus.com on Google Cloud, front door first. Pick a service tile, then drop it on the idea it stands for.'
	],
	reactions: {
		dns: 'Cloud DNS is the [[DNS|networking/dns]] of Google Cloud. It answers from the same worldwide network that keeps Google Search fast.',
		cdn: 'Cloud CDN is the [[CDN|traffic/cdn]], copies of your files kept at Google edge sites around the world, close to every visitor.',
		lb: 'Cloud Load Balancing is the [[load balancer|traffic/load-balancer]]. One single IP address catches visitors from every continent and sends each to the nearest healthy server.',
		network:
			'VPC is your [[private network|networking/vpc]]. On Google Cloud one VPC can span the planet, with a subnet in each region you use.',
		firewall:
			'Firewall rules are the [[firewall|networking/firewall]] of a Google VPC. Allow port 443 from the internet, and anything you did not allow is blocked.',
		vm: 'Compute Engine is the [[virtual machine|foundations/virtual-machine]]. Pick the CPU and memory you want, and Google can even move it to a healthy machine without switching it off.',
		container:
			'Cloud Run runs your [[containers|compute/container]] and shrinks them to zero when nobody visits. When you outgrow it, there is GKE, and Google is where Kubernetes was born.',
		function:
			'Cloud Functions is [[serverless|compute/serverless]], one small function that wakes up for each request. Google now files it under Cloud Run, as Cloud Run functions.',
		files:
			'Cloud Storage is [[object storage|resilience/storage-types]], buckets for photos, videos, and backups, a giant drawer with no bottom.',
		sql: 'Cloud SQL is a managed [[SQL database|resilience/database]], MySQL or PostgreSQL that Google patches and backs up for you.',
		nosql:
			'Firestore is a NoSQL [[database|resilience/database]] of documents. It can push changes straight to phones the moment they happen, so chat apps love it.',
		iam: 'IAM on Google Cloud is [[Identity and Access|networking/iam]]. You hand out roles like viewer or editor to people and services, never more than they need.',
		keys: 'Cloud KMS keeps the [[encryption|networking/encryption]] keys. Google already encrypts your data on disk, and KMS lets you hold and rotate those keys yourself.',
		monitor:
			'Cloud Monitoring is the [[monitoring|compute/monitoring]] side. Dashboards, uptime checks, and alerts that ping you before visitors notice anything.',
		miss: 'Not that slot. Read the name once more and think about what job it does.',
		live: 'Your visitor went through Cloud DNS, Cloud CDN, and the load balancer, past the firewall rules into Compute Engine, read Cloud SQL and Cloud Storage, and Cloud Monitoring saw every step. nimbus.com is live on Google Cloud.'
	},
	boardTitle: 'nimbus.com on Google Cloud',
	youLabel: 'Visitor',
	layers: ['Front door', 'Private network', 'Compute', 'Data', 'Access and watch'],
	concepts: {
		dns: 'DNS',
		cdn: 'CDN',
		lb: 'Load balancer',
		network: 'Private network',
		firewall: 'Firewall',
		vm: 'Virtual machine',
		container: 'Containers',
		function: 'Serverless',
		files: 'File storage',
		sql: 'SQL database',
		nosql: 'NoSQL database',
		iam: 'Identity and access',
		keys: 'Encryption keys',
		monitor: 'Monitoring'
	},
	trayLabel: 'Google Cloud services',
	pickHint: 'Pick a service tile, then tap the idea it stands for',
	placeHint: 'Where does {s} belong?',
	missTag: 'not here',
	layerTag: '{n} of {t} layers',
	liveBtn: 'Send a visitor to nimbus.com',
	noteDone: 'Every piece is in place, time for a real visitor',
	noteLive: 'The same ideas you know, wearing Google names'
};
