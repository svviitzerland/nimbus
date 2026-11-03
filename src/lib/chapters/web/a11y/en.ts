import type { A11yText } from './types';

export const en: A11yText = {
	title: 'Accessibility',
	intro: [
		'Close your eyes and try to order something on your phone. Sounds impossible? Millions of people do it every day. They are blind or have low vision, and they use the web through a <b>screen reader</b>.',
		'A screen reader is an app that reads the page out loud, one piece at a time. You swipe or press Tab to move on, and it tells you what each piece is, like heading or button, and what it says.',
		'But it can only read what the code tells it. A picture without <b>alt</b> text is just a file name. A text box without a <b>label</b> is just "edit text, blank". A clickable box that is not a real button gets skipped completely.',
		'Making a page work for everyone is called <b>accessibility</b>, often shortened to a11y (an a, then 11 letters, then a y). It also covers people who cannot use a mouse, people with low vision, and anyone squinting at a phone in bright sunlight.',
		'Color matters too. Light gray text on white looks elegant, but many people simply cannot read it. How different the text is from its background is called <b>contrast</b>, and there is a minimum to hit.',
		'[fyi] Same word, different world. A ramp beside the stairs is accessibility in a building. Curb ramps were made for wheelchairs, then it turned out everyone pushing a stroller or dragging a suitcase loves them too. The web works the same way.',
		'Your turn! Put on the blindfold and listen to the nimbus.com signup page through a screen reader. Fix every piece that sounds wrong, then fix the text that is hard to see.'
	],
	reactions: {
		blind:
			'Everything went dark. Now the only way to know what is on the page is to listen. Move through it one piece at a time.',
		alt: 'Much better. Before, the reader could only say a file name. With <b>alt</b> text it describes the picture, the very same alt you met in [[HTML|web/html]].',
		label:
			'Now the reader says what the box is for. A <b>label</b> tied to the box also helps sighted people, tapping the word puts the cursor right in the box.',
		button:
			'A real <b>button</b>! The reader announces it, Tab can reach it, and Enter presses it. A plain box that only listens for clicks gets none of that for free.',
		contrast:
			'Readable at last. A ratio of 4.5 to 1 is the official minimum for normal text in WCAG, the accessibility rulebook used around the world.',
		done: 'nimbus.com now works with eyes closed, without a mouse, and in bright sunlight. Good accessibility is mostly good HTML used the way it was meant, and a big part of good [[UX|web/ui-ux]] too.'
	},
	missionsLabel: 'Make nimbus.com work for everyone',
	missions: {
		alt: 'Give the picture a description',
		label: 'Tell the reader what the box is for',
		button: 'Make the button reachable',
		contrast: 'Make the small text readable'
	},
	blindfold: 'Blindfold',
	next: 'Next piece',
	restart: 'From the top',
	voice: 'Voice',
	voiceLang: 'en-US',
	readerLabel: 'The screen reader says',
	readerIdle: 'Nothing yet, move to the next piece to start',
	cover: 'You cannot see the screen, listen instead',
	roles: { image: 'image', heading: 'heading level 1', editText: 'edit text', button: 'button' },
	blank: 'blank',
	skipped: '(silence, the reader jumped right past a clickable box)',
	endOfPage: 'end of page',
	page: {
		heading: 'Join the Nimbus newsletter',
		tagline: 'Cloud tips every Friday, never any spam.',
		email: 'Email',
		subscribe: 'Subscribe',
		alt: 'Nim the cloud, the Nimbus logo'
	},
	fixLabel: 'Fix it',
	fixes: {
		alt: 'Add alt text that describes the picture',
		label: 'Add a label to the box',
		button: 'Use a real button with a name'
	},
	contrastLabel: 'Contrast of the small text',
	ratio: '{n} to 1',
	need: 'needs 4.5 or more',
	darker: 'Text color, lighter to darker',
	allDone: 'All four done, nimbus.com works for everyone'
};
