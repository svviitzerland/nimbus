import type { IacText } from './types';

export const en: IacText = {
	title: 'Infrastructure as Code',
	intro: [
		'To run nimbus.com you need [[servers|foundations/server]] in the cloud. The usual first step is the cloud website. Click create server, pick a size, pick a region, click create. Then do it all again for the next one.',
		'That works for one or two. But next month, who remembers exactly what was picked? Someone clicks medium instead of small, and now the servers are not quite the same. Nobody wrote it down.',
		'<b>Infrastructure as Code</b> (IaC) flips it around. <b>Infrastructure</b> means the machines and networks your app runs on. Instead of clicking, you describe them in a plain text file, like a recipe.',
		'A tool called <b>Terraform</b> reads that file. You type <b>terraform apply</b>, it compares the file with what already exists in the cloud, and builds whatever is missing. Three servers, straight from the text.',
		'Need more? Change one number in the file, from 3 to 5, and apply again. Terraform only builds the difference (two new servers) and leaves the other three alone.',
		'Now the scary part. Someone deletes everything by accident. With the file in hand, one apply brings all five servers back, exactly the same as before.',
		'[ingat] <b>The file is the recipe, Terraform is the cook.</b> Same recipe, same dish, every single time. And anything not in the file never gets built.',
		'[fyi] Since it is just text, the file lives in [[Git|compute/version-control]] next to your code, so every change to the servers has a history and can be undone. Terraform also talks to many clouds (AWS, Google Cloud, Azure) and even to machines you own in your office (on premise).',
		'Want to try? Change the count with the buttons and watch Terraform build or remove servers to match the file. Or just watch, that is fine too.'
	],
	reactions: {
		more: 'You raised the number, so Terraform saw servers missing and built only those. The ones already running were not touched.',
		less: 'You lowered the number, so Terraform removed the extra servers. The file says how many, and the cloud follows.'
	},
	steps: [
		{
			tag: 'By hand',
			title: 'Clicking in the console',
			body: 'The cloud website (the <b>console</b>) has a form. Fill it in, press create, and one server appears.'
		},
		{
			tag: 'The problem',
			title: 'Nobody remembers',
			body: 'One server came out <b>medium</b> instead of small. Clicks leave no notes, so mistakes like this hide.'
		},
		{
			tag: 'The idea',
			title: 'Infrastructure as Code',
			body: 'The servers you want, written as text. The file below asks for <b>3</b> small servers in Jakarta.'
		},
		{
			tag: 'The tool',
			title: 'terraform apply',
			body: 'Terraform reads the file, makes a <b>plan</b> (what to add, change, or remove), then builds it.'
		},
		{
			tag: 'Changing it',
			title: 'Only the difference',
			body: 'The count went from 3 to 5. The plan says <b>2 to add</b>, and the first three stay as they are.'
		},
		{
			tag: 'Disaster',
			title: 'Rebuilt in one go',
			body: 'Everything is gone, but the recipe is not. One apply, and all five come back identical.'
		},
		{
			tag: 'Make it stick',
			title: 'Recipe and cook',
			body: 'The <b>file</b> is the recipe, <b>Terraform</b> is the cook. Same recipe, same result.'
		},
		{
			tag: 'Good to know',
			title: 'Kept in Git',
			body: 'A text file can be reviewed, versioned and undone, just like code.'
		},
		{
			tag: 'Optional',
			title: 'Change the count',
			body: 'Press plus or minus. The file changes first, then Terraform makes the cloud match.'
		}
	],
	consoleTitle: 'Create a server',
	sizeLabel: 'Size',
	regionLabel: 'Region',
	regionValue: 'Jakarta',
	createBtn: 'Create',
	cloudLabel: 'Your cloud, Jakarta region',
	emptyLabel: 'No servers yet',
	countLabel: 'Servers in the file',
	lessBtn: 'One server fewer',
	moreBtn: 'One server more'
};
