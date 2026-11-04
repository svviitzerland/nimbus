import type { GcpText } from './types';

export const en: GcpText = {
	title: 'Google Cloud',
	intro: [
		'You already met every piece of a website in the cloud. A front door, a private network, servers, data, and someone keeping watch. On the board, each one is a plain tile with the idea written on it.',
		'Google ran Search, Gmail, and YouTube for billions of people long before it rented out a single server. <b>Google Cloud</b> lets you use that same machinery. It began in 2008 with App Engine, and its plain rented servers followed in 2012.',
		'Watch the top row flip. Google names things plainly, so the front door becomes <b>Cloud DNS</b>, <b>Cloud CDN</b> (copies near every visitor) and <b>Cloud Load Balancing</b>, one single address for visitors from every continent.',
		'Next comes the private network. <b>VPC</b> is your own fenced off network, and on Google Cloud one VPC can stretch across the whole world. <b>Firewall rules</b> decide what may come in.',
		'Then the computers that run nimbus.com. <b>Compute Engine</b> is a rented server, <b>Cloud Run</b> runs containers and shrinks to zero when nobody visits, and <b>Cloud Functions</b> runs one small function per request.',
		'Every website needs a place for its data. <b>Cloud Storage</b> holds files, <b>Cloud SQL</b> is a SQL database Google looks after, and <b>Firestore</b> is a NoSQL database that can push changes straight to phones.',
		'Last, the tools that keep it safe and watched. <b>IAM</b> hands out roles, <b>Cloud KMS</b> keeps the encryption keys, and <b>Cloud Monitoring</b> draws the graphs and rings the alarm.',
		'[ingat] <b>Same idea, different name tag.</b> Google makes it easy, the name usually says the job. Cloud Storage stores, Cloud SQL is SQL. One sticky pair, <b>Compute Engine is a VM</b>, an engine that computes for you.',
		'[fyi] Same word, different world. The rented server is EC2 on [[AWS|providers/aws]] and Virtual Machines on [[Azure|providers/azure]]. And a Google VPC spans every region, while on the other two each private network lives in one region.',
		'Watch a visitor walk through the whole board, from Cloud DNS down to Cloud Monitoring. Want to try it yourself? Put the names back on the tiles, it is a small bonus.'
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
	steps: [
		{
			tag: 'The plain ideas',
			title: 'A website in the cloud',
			body: 'Five layers, from the front door down to the tools that watch it. Each tile is an idea you already know.'
		},
		{
			tag: 'Since 2008',
			title: 'Google Cloud',
			body: 'The same machinery behind Search and YouTube, rented out to everyone.'
		},
		{
			tag: 'Layer 1',
			title: 'Front door',
			body: '<b>Cloud DNS</b>, <b>Cloud CDN</b>, and <b>Cloud Load Balancing</b>. The names already say the job.'
		},
		{
			tag: 'Layer 2',
			title: 'Private network',
			body: '<b>VPC</b> is the private network, <b>Firewall rules</b> guard it. One VPC can span the planet.'
		},
		{
			tag: 'Layer 3',
			title: 'Compute',
			body: '<b>Compute Engine</b> is a virtual machine, <b>Cloud Run</b> runs containers, <b>Cloud Functions</b> is serverless.'
		},
		{
			tag: 'Layer 4',
			title: 'Data',
			body: '<b>Cloud Storage</b> stores files, <b>Cloud SQL</b> is SQL, <b>Firestore</b> is NoSQL.'
		},
		{
			tag: 'Layer 5',
			title: 'Access and watch',
			body: '<b>IAM</b> for roles, <b>Cloud KMS</b> for keys, <b>Cloud Monitoring</b> for graphs and alarms.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Same idea, new name tag',
			body: 'At Google the name tag mostly reads like the idea. Sticky pair, <b>Compute Engine is a VM</b>.'
		},
		{
			tag: 'Elsewhere',
			title: 'Three labels, one box',
			body: 'A virtual machine at AWS, Google Cloud, and Azure. Only the name tag changes.'
		},
		{
			tag: 'Optional',
			title: 'One visitor, every layer',
			body: 'The request lights up each piece on its way. Tap the button to match the names yourself.'
		}
	],
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
	sameIdea: '{c} at each cloud',
	playBtn: 'Match the names myself',
	trayLabel: 'Google Cloud services',
	pickHint: 'Pick a name, then tap the idea it stands for',
	placeHint: 'Where does {s} belong?',
	missTag: 'not here',
	noteLive: 'All yours, the same ideas wearing Google names'
};
