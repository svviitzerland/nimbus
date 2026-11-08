import type { CloudServicesText } from '../../types';

export const en: CloudServicesText = {
	title: 'Cloud services',
	intro: [
		'So far you have rented a single server in the cloud. That virtual server is the most basic service. People often call it a <b>VPS</b>, and its cloud version that you can resize anytime is named <b>EC2</b> on AWS, <b>Compute Engine</b> on Google, <b>Virtual Machines</b> on Azure.',
		'The thing is, a bare server is empty. Want a database, a place for files, or anything else, you have to install it yourself and then keep it healthy yourself.',
		'So providers built many ready made services. Every need has its service, and the provider handles the setup, backups, and upkeep, you just rent it and use it. Like renting a fully fitted kitchen instead of building one from scratch.',
		'There are hundreds of these. Turn on the screen and see for yourself.',
		'[fyi] Providers use different product names. Amazon EC2 provides compute, Amazon S3 stores objects, and AWS Lambda runs functions. Learn the job first, then match the product name.',
		'[ingat] Choose services by the task. Running code, storing files, and keeping data have different needs.'
	],
	reactions: {
		open: 'Look, storage, databases, networking, even analytics and AI, all from AWS, Google, and Azure. The cloud is a giant catalog. In the chapters ahead we will meet the important ones one by one.'
	},
	screenTitle: 'Cloud services',
	screenSub: 'hundreds of services to rent',
	openBtn: 'Turn on the screen'
};
