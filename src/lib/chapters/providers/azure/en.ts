import type { AzureText } from './types';

export const en: AzureText = {
	title: 'Azure',
	intro: [
		'Microsoft has made Windows and Office for decades, and millions of office workers already sign in with a Microsoft account every morning. <b>Azure</b> is the Microsoft cloud.',
		'It opened in 2010 as Windows Azure. In 2014 it became Microsoft Azure, and these days more of its virtual machines run Linux than Windows.',
		'Azure leans on plain names, like Virtual Machines, Load Balancer, and Functions, plus a few brand names worth learning, like Cosmos DB and Entra ID.',
		'[fyi] Azure keeps everything for one project in a <b>resource group</b>, like a folder. Delete the folder and every piece inside goes with it. The same ideas wear other names on [[AWS|providers/aws]] and [[Google Cloud|providers/gcp]].',
		'Big companies often pick Azure because their staff already log in with Microsoft. Let us build nimbus.com on Azure, front door first. Pick a service tile, then drop it on the idea it stands for.'
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
	trayLabel: 'Azure services',
	pickHint: 'Pick a service tile, then tap the idea it stands for',
	placeHint: 'Where does {s} belong?',
	missTag: 'not here',
	layerTag: '{n} of {t} layers',
	liveBtn: 'Send a visitor to nimbus.com',
	noteDone: 'Every piece is in place, time for a real visitor',
	noteLive: 'The same ideas you know, wearing Azure names'
};
