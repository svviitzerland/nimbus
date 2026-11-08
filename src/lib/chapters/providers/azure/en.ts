import type { AzureText } from './types';

export const en: AzureText = {
	title: 'Azure',
	intro: [
		'You already met every piece of a website in the cloud. A front door, a private network, servers, data, and someone keeping watch. On the board, each one is a plain tile with the idea written on it.',
		'Microsoft has made Windows and Office for decades, and millions of office workers sign in with a Microsoft account every morning. <b>Azure</b> is the Microsoft cloud. It opened in 2010, and today more of its virtual machines run Linux than Windows.',
		'Watch the cards in the top row flip. The front door becomes <b>Azure DNS</b>, <b>Front Door</b> (the CDN and global entrance, copies near every visitor) and <b>Load Balancer</b>, a name Azure kept perfectly plain.',
		'Next comes the private network. <b>VNet</b>, short for Virtual Network, is your own fenced off network, and an <b>NSG</b> (Network Security Group) is the firewall that says which ports may pass.',
		'Then the computers that run nimbus.com. <b>Virtual Machines</b> are rented servers, no nickname at all. <b>Container Apps</b> runs containers, and <b>Functions</b> runs one small piece of code when it is called.',
		'Every website needs a place for its data. <b>Blob Storage</b> holds files, <b>Azure SQL</b> is a SQL database Microsoft looks after, and <b>Cosmos DB</b> is a NoSQL database that copies itself to many regions.',
		'Last, the tools that keep it safe and watched. <b>Entra ID</b> is the login that decides who may do what, <b>Key Vault</b> keeps keys and passwords, and <b>Azure Monitor</b> draws the graphs and rings the alarm.',
		'[ingat] Virtual Machines provides VMs, Blob Storage provides object storage, and Azure SQL Database provides a managed relational database.',
		'[fyi] Same word, different world. The rented server is EC2 on [[AWS|providers/aws]] and Compute Engine on [[Google Cloud|providers/gcp]]. Azure also keeps every piece of one project in a <b>resource group</b>, like a folder you can delete in one go.',
		'Watch a visitor walk through the whole board, from Azure DNS down to Azure Monitor. Want to try it yourself? Put the names back on the tiles, it is a small bonus.'
	],
	reactions: {
		dns: 'Azure DNS is the [[DNS|networking/dns]], holding the records that point nimbus.com at your servers.',
		cdn: 'Front Door is the Azure [[CDN|traffic/cdn]] and its global front entrance. It caches files near visitors and sends each one to the closest healthy region.',
		lb: 'Load Balancer is exactly the [[load balancer|traffic/load-balancer]], Azure kept this one plain. It shares traffic across your Virtual Machines.',
		network:
			'VNet, short for Virtual Network, is your [[private network|networking/vpc]] on Azure. The same idea as a VPC elsewhere, just a different letter.',
		firewall:
			'NSG stands for Network Security Group, the [[firewall|networking/firewall]] on a subnet or a server. Each rule says which port and which address may pass.',
		vm: 'Virtual Machines is the [[virtual machine|foundations/virtual-machine]], no nickname at all. Windows or Linux, rented by the second.',
		container:
			'Container Apps runs your [[containers|compute/container]] without you managing a cluster, and AKS is there when you want full Kubernetes.',
		function:
			'Functions is [[serverless|compute/serverless]]. A piece of code that wakes up on a request or a timer, and you pay per run.',
		files:
			'Blob Storage is [[object storage|resilience/storage-types]]. Blob means Binary Large OBject, any file at all, a photo, a video, a backup.',
		sql: 'Azure SQL is a managed [[SQL database|resilience/database]] built on Microsoft SQL Server, patched and backed up for you.',
		nosql:
			'Cosmos DB is the NoSQL [[database|resilience/database]], made to copy your data to many regions at once so reads stay fast everywhere.',
		iam: 'Entra ID, once called Azure Active Directory, is [[Identity and Access|networking/iam]]. The same login staff use for Outlook can guard the whole cloud.',
		keys: 'Key Vault keeps [[encryption|networking/encryption]] keys, passwords, and certificates in one locked place, so they never sit inside your code.',
		monitor:
			'Azure Monitor is the [[monitoring|compute/monitoring]]. Metrics, logs, and alerts for everything you run on Azure.',
		miss: 'Not that slot. Read the name once more and think about what job it does.',
		live: 'Your visitor came through Azure DNS and Front Door, past the Load Balancer and the NSG, into a Virtual Machine, read Azure SQL and Blob Storage, and Azure Monitor watched every step. nimbus.com is live on Azure.'
	},
	steps: [
		{
			tag: 'Website requirements',
			title: 'A website in the cloud',
			body: 'This layout covers site access, networking, compute, data, and monitoring. Select a card to see the service’s function.'
		},
		{
			tag: 'Since 2010',
			title: 'Microsoft Azure',
			body: 'The cloud of the company behind Windows and Office. Big offices often pick it because staff already sign in with Microsoft.'
		},
		{
			tag: 'Layer 1',
			title: 'DNS, CDN, and load balancer',
			body: '<b>Azure DNS</b> is the DNS, <b>Front Door</b> the CDN, <b>Load Balancer</b> the load balancer.'
		},
		{
			tag: 'Layer 2',
			title: 'Private network',
			body: '<b>VNet</b> is the private network. An <b>NSG</b> is its firewall.'
		},
		{
			tag: 'Layer 3',
			title: 'Compute',
			body: '<b>Virtual Machines</b>, <b>Container Apps</b> for containers, <b>Functions</b> for serverless.'
		},
		{
			tag: 'Layer 4',
			title: 'Data',
			body: '<b>Blob Storage</b> stores files, <b>Azure SQL</b> is SQL, <b>Cosmos DB</b> is NoSQL.'
		},
		{
			tag: 'Layer 5',
			title: 'Access and monitoring',
			body: '<b>Entra ID</b> for logins, <b>Key Vault</b> for keys, <b>Azure Monitor</b> for graphs and alarms.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Service names and functions',
			body: 'Virtual Machines provides VMs, Blob Storage stores objects, and Azure SQL Database provides a relational database.'
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
	boardTitle: 'nimbus.com on Azure',
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
	trayLabel: 'Azure services',
	pickHint: 'Pick a name, then tap the idea it stands for',
	placeHint: 'Where does {s} belong?',
	missTag: 'not here',
	noteLive: 'All yours, the same ideas wearing Azure names'
};
