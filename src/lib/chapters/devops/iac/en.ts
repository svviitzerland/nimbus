import type { IacText } from './types';

export const en: IacText = {
	title: 'Infrastructure as Code',
	intro: [
		'To run nimbus.com you need servers. The usual first step is to open the cloud provider’s website, click "create server", pick a size, pick a region, then click create. Repeat for every server.',
		'That works for one or two. But who remembers next month exactly which size and region you picked? And if everything vanishes one day, you have to redo all those clicks from memory.',
		'<b>Infrastructure as Code</b> (IaC) flips it around. You describe the servers you want in a text file, and a tool builds them for you. The same file always builds the same result.',
		'The best known tool is <b>Terraform</b>. You write what you want ("three small servers in Jakarta"), then run <b>terraform apply</b>. Terraform compares the file with what exists and only creates, changes, or deletes the difference.',
		'[fyi] Because it is just a text file, it can live in [[Git|compute/version-control]] like your code. Every change to the servers is reviewed, has a history, and can be undone. Terraform also works far beyond one cloud, it talks to AWS, Google Cloud, Azure, and even your own servers on premise.',
		'Build three servers by hand first, then let disaster strike. After that, write them as code and rebuild everything in one go.'
	],
	reactions: {
		hand: 'Three servers, quite a few clicks. Now check, are they all identical? By hand it is easy to pick something different without noticing.',
		handLost:
			'Gone. The data center had a bad day and all three servers vanished. Do you still remember exactly what you picked for each one? Let us try the code way.',
		applied:
			'Terraform read the file, saw nothing exists yet, and created everything it describes. One command, every server identical.',
		diff: 'See the plan? Terraform only touched the difference between the file and what is running. You change the file, not the servers.',
		rebuilt:
			'Disaster again, and this time it is calm. Same file, same command, and everything comes back exactly as before. That is Infrastructure as Code.'
	},
	acts: ['By hand', 'As code'],
	consoleTitle: 'Create a server',
	sizeLabel: 'Size',
	regionLabel: 'Region',
	sizes: ['small', 'medium', 'large'],
	regions: ['jakarta', 'singapore'],
	createBtn: 'Create',
	clicksTag: '{n} clicks',
	serverLabel: 'server {n}',
	sameTag: 'all identical',
	driftTag: 'not identical',
	disasterBtn: 'Disaster strikes',
	applyBtn: 'terraform apply',
	countHint: 'Change the count, then apply again',
	nextAct: 'Try the code way',
	noteHand: 'Pick a size and a region, then create. {n} to go.',
	noteHandDone: 'Three servers, built one click at a time',
	noteHandLost: 'Everything is gone. Now rebuild it from memory',
	noteCode: 'The file describes the servers. Apply it.',
	noteCodeLive: 'What runs now matches the file exactly',
	noteCodeLost: 'Gone again, but the file still knows everything',
	noteRebuilt: 'Rebuilt in one go, exactly as written'
};
