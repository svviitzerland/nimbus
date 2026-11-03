import type { AwsText } from './types';

export const en: AwsText = {
	title: 'AWS',
	intro: [
		'You already know every piece of a cloud setup. Servers, load balancers, private networks, databases. Now meet the biggest shop that rents them out, <b>Amazon Web Services</b>, or AWS.',
		'AWS grew inside Amazon itself. In 2006 the company started renting out the same kind of machines that ran its online store, first <b>S3</b> for files, then <b>EC2</b> for servers. Today it is the largest cloud in the world.',
		'Here is the hard part for beginners. AWS has more than 200 services, and the names rarely say what they do. Route 53? CloudFront? It reads like a secret code.',
		'The good news is that every strange name hides an idea you already met. A server is still a server, AWS just calls it EC2. Learn the map once and the AWS console stops being scary.',
		'[fyi] The same ideas wear other names at other providers. A rented server is Compute Engine on [[Google Cloud|providers/gcp]] and Virtual Machines on [[Azure|providers/azure]]. Same thing, different label on the box.',
		'Let us build nimbus.com on AWS, one layer at a time, from the front door down. Pick a service tile, then drop it on the idea it stands for.'
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
	trayLabel: 'AWS services',
	pickHint: 'Pick a service tile, then tap the idea it stands for',
	placeHint: 'Where does {s} belong?',
	missTag: 'not here',
	layerTag: '{n} of {t} layers',
	liveBtn: 'Send a visitor to nimbus.com',
	noteDone: 'Every piece is in place, time for a real visitor',
	noteLive: 'The same ideas you know, wearing AWS names'
};
