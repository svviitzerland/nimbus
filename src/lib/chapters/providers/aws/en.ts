import type { AwsText } from './types';

export const en: AwsText = {
	title: 'AWS',
	intro: [
		'You already met every piece of a website in the cloud. A front door, a private network, servers, data, and someone keeping watch. On the board, each one is a plain tile with the idea written on it.',
		'Now meet the biggest shop that rents those pieces out, <b>Amazon Web Services</b>, or AWS. It grew inside Amazon, and in 2006 it started renting out the same kind of machines that ran the online store. Today it has more than 200 services, and the names sound like a secret code.',
		'Watch the top row flip. The front door becomes <b>Route 53</b> (the [[DNS|networking/dns]], named after port 53), <b>CloudFront</b> (the CDN, copies near every visitor) and <b>Elastic Load Balancing</b> (it shares visitors between servers).',
		'Next comes the private network. <b>VPC</b> is your own fenced off network inside AWS, and <b>Security Groups</b> are the firewall around each server, letting in only what you allow.',
		'Then the computers that actually run nimbus.com. <b>EC2</b> is a rented server, <b>ECS</b> runs containers, and <b>Lambda</b> runs one small function only when someone calls it.',
		'Every website needs a place for its data. <b>S3</b> holds files like photos and backups, <b>RDS</b> is a SQL database that AWS looks after, and <b>DynamoDB</b> is the NoSQL one built for huge traffic.',
		'Last, the tools that keep it safe and watched. <b>IAM</b> decides who may do what, <b>KMS</b> keeps the encryption keys, and <b>CloudWatch</b> draws the graphs and rings the alarm.',
		'[ingat] EC2 provides virtual machines, S3 provides object storage, and RDS provides managed relational databases.',
		'[fyi] Same word, different world. The rented server is called Compute Engine on [[Google Cloud|providers/gcp]] and Virtual Machines on [[Azure|providers/azure]]. Same box, three different labels.',
		'Watch a visitor walk through the whole board, from Route 53 down to CloudWatch. Want to try it yourself? Put the names back on the tiles, it is a small bonus.'
	],
	reactions: {
		dns: 'Route 53 is the [[DNS|networking/dns]] of AWS, the phone book that turns nimbus.com into an IP address. The name is a little joke, port 53 is the door DNS has always used.',
		cdn: 'CloudFront is the [[CDN|traffic/cdn]]. It keeps copies of your images in hundreds of cities, so a visitor far away never waits on one faraway server.',
		lb: 'Elastic Load Balancing, ELB for short, is the [[load balancer|traffic/load-balancer]]. It spreads visitors over your servers and skips any server that stops answering.',
		network:
			'VPC stands for Virtual Private Cloud, your own [[private network|networking/vpc]] inside AWS, split into subnets. Nothing gets in unless you open a way.',
		firewall:
			'Security Groups are the [[firewall|networking/firewall]] wrapped around each server. You list what may come in, like port 443 for the web, and everything else bounces.',
		vm: 'EC2 is the [[virtual machine|foundations/virtual-machine]], a server rented by the second. Pair it with Auto Scaling and AWS adds more EC2 by itself when traffic climbs.',
		container:
			'ECS runs your [[containers|compute/container]]. Put Fargate under it and you do not even look after the servers the containers sit on.',
		function:
			'Lambda is [[serverless|compute/serverless]]. You upload one function, it wakes up when called, and you pay only for the milliseconds it runs.',
		files:
			'S3 is [[object storage|resilience/storage-types]], a bucket with no bottom for photos, videos, and backups. It was one of the very first AWS services, back in 2006.',
		sql: 'RDS is a managed [[SQL database|resilience/database]]. AWS installs it, patches it, and backs it up, and you just use the tables.',
		nosql:
			'DynamoDB is the NoSQL [[database|resilience/database]], built for huge traffic. It grew out of Dynamo, the system Amazon built to keep shopping carts alive on the busiest days.',
		iam: 'IAM is [[Identity and Access|networking/iam]]. Every person and every server gets only the permissions it needs, nothing more.',
		keys: 'KMS, the Key Management Service, holds the [[encryption|networking/encryption]] keys that lock your disks and buckets. The keys never leave its vault.',
		monitor:
			'CloudWatch is the [[monitoring|compute/monitoring]] dashboard. It graphs CPU and errors and sounds the alarm the moment a line is crossed.',
		miss: 'Not that slot. Read the name once more and think about what job it does.',
		live: 'Your visitor came in through Route 53, got images from CloudFront, passed ELB and the Security Group, reached EC2, read RDS and S3, and CloudWatch watched every step. That is nimbus.com on real AWS.'
	},
	steps: [
		{
			tag: 'Website requirements',
			title: 'A website in the cloud',
			body: 'This layout covers site access, networking, compute, data, and monitoring. Select a card to see the service’s function.'
		},
		{
			tag: 'Since 2006',
			title: 'Amazon Web Services',
			body: 'The biggest cloud in the world. Its first services were <b>S3</b> for files and <b>EC2</b> for servers.'
		},
		{
			tag: 'Layer 1',
			title: 'DNS, CDN, and load balancer',
			body: '<b>Route 53</b> is the DNS, <b>CloudFront</b> the CDN, <b>Elastic Load Balancing</b> the load balancer.'
		},
		{
			tag: 'Layer 2',
			title: 'Private network',
			body: '<b>VPC</b> is the private network. <b>Security Groups</b> are the firewall on each server.'
		},
		{
			tag: 'Layer 3',
			title: 'Compute',
			body: '<b>EC2</b> is a virtual machine, <b>ECS</b> runs containers, <b>Lambda</b> is serverless.'
		},
		{
			tag: 'Layer 4',
			title: 'Data',
			body: '<b>S3</b> stores files, <b>RDS</b> is SQL, <b>DynamoDB</b> is NoSQL.'
		},
		{
			tag: 'Layer 5',
			title: 'Access and monitoring',
			body: '<b>IAM</b> for who may do what, <b>KMS</b> for keys, <b>CloudWatch</b> for graphs and alarms.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Service names and functions',
			body: 'EC2 provides VMs, S3 stores objects, and RDS manages relational databases.'
		},
		{
			tag: 'Comparison',
			title: 'Comparing providers',
			body: 'All three providers offer virtual machines. Check each provider’s naming, configuration, service limits, and pricing.'
		},
		{
			tag: 'Optional',
			title: 'Visitor request flow',
			body: 'The request lights up each piece on its way. Tap the button to match the names yourself.'
		}
	],
	boardTitle: 'nimbus.com on AWS',
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
	trayLabel: 'AWS services',
	pickHint: 'Pick a name, then tap the idea it stands for',
	placeHint: 'Where does {s} belong?',
	missTag: 'not here',
	noteLive: 'All yours, the same ideas wearing AWS names'
};
