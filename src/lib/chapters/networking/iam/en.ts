import type { IamText } from '../types';

export const en: IamText = {
	title: 'Identity and Access',
	intro: [
		'Outside guests are not the only ones who need rules. People on the inside should not be able to touch everything either.',
		'At an office, every employee carries an <b>access card</b>. The card answers two things, who you are (<b>authentication</b>) and what you may do (<b>authorization</b>).',
		'The golden rule is called <b>least privilege</b>, grant only the access that is needed. An intern does not need the server room key, and if the card gets stolen, the thief can do very little too.',
		'Budi the intern happens to start today. Hand him two different cards, one at a time, and check which doors open.',
		'[ingat] Define the identity, permitted actions, and resources it may access.'
	],
	reactions: {
		admin:
			'Admin privileges allow every action in this example. Choose limited access so Budi can perform only the required tasks.',
		scoped:
			'There, the intern card only opens the doors he actually needs. Even if it gets lost, the damage stays small. That is least privilege, just enough access.'
	},
	personLabel: 'Budi the intern',
	badgeAdmin: 'Admin card',
	badgeAdminSub: 'every door opens',
	badgeScoped: 'Intern card',
	badgeScopedSub: 'only what is needed',
	doors: [
		{ key: 'read', label: 'View reports', scoped: true },
		{ key: 'db', label: 'Delete the database', scoped: false },
		{ key: 'server', label: 'Manage servers', scoped: false }
	],
	openTag: 'open',
	shutTag: 'locked',
	noteIdle: 'Pick a card for Budi',
	noteAdmin: 'Everything opens, even what he never needs',
	noteScoped: 'Only the needed doors open'
};
