import type { AZText } from '../../types';

export const en: AZText = {
	title: 'What is an Availability Zone?',
	intro: [
		'Earlier in 2026, Iranian drones actually struck AWS data centers in the Middle East, and many services there went down.',
		'And not just attacks. Fire, floods, earthquakes, lightning, even a wrong command, all have taken data centers down.',
		'Hardware fails too, a single disk or server can die at any time, but that is usually handled by spare parts (redundancy) inside the data center.',
		'The bigger danger is when a whole data center building falls. The question is, how does your site stay up when that happens?',
		'Big services make a promise called an <b>SLA</b> (Service Level Agreement), how much of the year they stay up, the <b>uptime</b>. 99.9% sounds perfect, yet it still allows about 8.8 hours down a year. 99.99% allows only about 53 minutes. A single building can never promise that.',
		'[ingat] A region chooses an area; zones separate failure locations within it.',
		'The answer is, a <b>region</b> is not a single building. Inside it are several <b>Availability Zones</b> (AZ), separate data centers set kilometers apart, each with its own power and network. So if one AZ runs into trouble, the others keep running.',
		'The map is open with two regions on it. Step into one, spread your servers across several AZs, then trigger an outage yourself.'
	],
	reactions: {
		virginia:
			'This is the Virginia region. Those dots are its Availability Zones, each one a separate data center.',
		'virginia-name':
			'Look at the names, <b>us-east-1a</b>, <b>us-east-1b</b>, and so on. The trailing letter is shuffled per account, so your 1a may not be the same building as someone else’s 1a, and load does not pile into "a". Now spread your servers across several AZs, then trigger an outage.',
		singapore:
			'This is the Singapore region. Those dots are its Availability Zones, each one a separate data center.',
		'singapore-name':
			'Look at the names, <b>ap-southeast-1a</b>, <b>ap-southeast-1b</b>, and so on. The trailing letter is shuffled per account, so your 1a may not be the same building as someone else’s 1a, and load does not pile into "a". Now spread your servers across several AZs, then trigger an outage.',
		down: 'There it is. Your server was in a single AZ, so when that AZ was hit your site went down with it. Spread to other AZs, then trigger it again.',
		survived:
			'Feel the difference. One AZ falls, but the others keep serving, so your site survives. That is what spreading across AZs is for.'
	},
	worldHint: 'Click a region to see its Availability Zones',
	back: 'Back to the map',
	serverLabel: 'Server',
	place: 'Click an AZ to add or remove a server',
	trigger: 'Trigger an outage',
	statusUp: 'Online',
	statusDown: 'Down',
	activeZones: 'Active AZs',
	regions: { virginia: 'Virginia', singapore: 'Singapore' },
	strikeLabel: 'Middle East',
	news: [
		{
			src: 'CNBC, 2026',
			head: 'Iranian drones strike AWS data centers in the Middle East',
			url: 'https://www.cnbc.com/2026/04/07/aws-iran-threats-us-tech-data-centers.html'
		},
		{
			src: 'Data Center Dynamics, 2021',
			head: 'Fire destroys the OVHcloud data center in Strasbourg',
			url: 'https://www.datacenterdynamics.com/en/news/fire-destroys-ovhclouds-sbg2-data-center-strasbourg/'
		},
		{
			src: 'Amazon Web Services, 2021',
			head: 'A major outage takes down the us-east-1 (Virginia) region',
			url: 'https://aws.amazon.com/message/12721/'
		},
		{
			src: 'Data Center Dynamics, 2022',
			head: 'London heatwave, cooling fails, cloud services go down',
			url: 'https://www.datacenterdynamics.com/en/news/googles-london-data-center-outage-during-heatwave-caused-by-simultaneous-failure-of-multiple-redundant-cooling-systems/'
		},
		{
			src: 'Data Center Dynamics, 2012',
			head: 'Hurricane Sandy floods data centers in New York',
			url: 'https://www.datacenterdynamics.com/en/news/hurricane-sandy-data-center-stories-from-manhattan/'
		},
		{
			src: 'Data Center Dynamics, 2015',
			head: "Lightning hits Google's Belgium data center, some data lost",
			url: 'https://www.datacenterdynamics.com/en/news/lightning-strikes-and-old-disks-cause-google-data-loss/'
		},
		{
			src: 'Engineering at Meta, 2021',
			head: 'A wrong command erased Facebook from the internet for six hours',
			url: 'https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/'
		},
		{
			src: 'Fastly, 2021',
			head: 'One config bug knocked major websites offline',
			url: 'https://www.fastly.com/blog/summary-of-june-8-outage'
		},
		{
			src: 'Data Center Dynamics, 2011',
			head: "Japan's quake, blackouts and fuel shortages strain data centers",
			url: 'https://www.datacenterdynamics.com/en/news/the-after-effect-of-the-japanese-earthquake/'
		}
	],
	slaTitle: 'Allowed downtime per year',
	sla: [
		{ pct: '99%', down: 'about 3.6 days' },
		{ pct: '99.9%', down: 'about 8.8 hours' },
		{ pct: '99.99%', down: 'about 53 minutes' },
		{ pct: '99.999%', down: 'about 5 minutes' }
	],
	slaRule: 'One more 9, ten times less downtime'
};
