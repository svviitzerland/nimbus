import type { CapstoneText } from '../types';

export const en: CapstoneText = {
	title: 'Pick a provider',
	intro: [
		'You made it to the end of the Cloud track. From one laptop server to an architecture that takes a punch, you now hold all the big concepts.',
		'The next branch takes those ideas into the real world, one provider at a time. The exact same concepts, now with their real names and buttons, like EC2 and Cloud Run.',
		'Pick the provider you want to learn first. All three are still under construction, and you can leave an email to be told the moment your track is ready.',
		'[ingat] Start with needs, assemble the parts, test failures, and check the cost.'
	],
	reactions: {
		picked:
			'Noted! That branch is being carefully prepared. Meanwhile, the cloud concepts you learned are the same foundation for every provider, so you are already a step ahead.',
		subscribed:
			'Your email is saved. The moment your track ships, you hear it first. See you in the provider branch!'
	},
	providers: [
		{ key: 'aws', name: 'AWS', sub: 'Amazon Web Services' },
		{ key: 'gcp', name: 'Google Cloud', sub: 'GCP' },
		{ key: 'azure', name: 'Azure', sub: 'Microsoft Azure' }
	],
	comingSoon: 'Coming soon',
	pickedTag: 'your pick',
	newsTitle: 'Want a heads up?',
	newsSub:
		'The branches are still being built. Leave an email and we will write the moment yours is ready.',
	emailPh: 'your email',
	subscribe: 'Notify me',
	subscribedMsg: 'Saved! See you soon',
	invalidMsg: 'Hmm, check that email again',
	errMsg: 'Hiccup on our side, try again shortly',
	noteIdle: 'Three big providers, one shared foundation',
	notePicked: 'Your branch is still under construction, hang tight'
};
