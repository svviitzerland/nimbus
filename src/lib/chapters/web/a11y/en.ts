import type { A11yText } from './types';

export const en: A11yText = {
	title: 'Accessibility',
	intro: [
		'Close your eyes and try to order something on your phone. Sounds impossible? Millions of people do it every day. They are blind or have low vision, and they use the web with a <b>screen reader</b>.',
		'A screen reader is an app that reads the page out loud, one piece at a time. Watch it walk through the nimbus.com signup page. Some pieces sound wrong, and one is never read at all.',
		'It can only read what the code tells it. The picture has no <b>alt</b> text, so all it can say is a file name. Nim adds a short description, and now the picture makes sense by ear.',
		'The text box only says "edit text, blank". Edit what? Nim adds a <b>label</b> and ties it to the box, so the reader says Email first.',
		'The Subscribe box looks like a button, but it is a plain div, so the reader jumps right past it. Nim swaps it for a real <b>button</b>, and now it is announced, reachable with the Tab key, and pressed with Enter.',
		'Making a page work for everyone is called <b>accessibility</b>, often written a11y (an a, then 11 letters, then a y). It also helps people who cannot use a mouse, and anyone squinting at a phone in bright sunlight.',
		'Color matters too. Light gray on white looks elegant, but many people cannot read it. How much text stands out from its background is called <b>contrast</b>, and normal text needs at least 4.5 to 1. Nim darkens it.',
		'[fyi] Same word, different world. A ramp beside the stairs is accessibility in a building. Curb ramps were made for wheelchairs, then everyone pushing a stroller or dragging a suitcase loved them too. The web works the same way.',
		'[ingat] Three pairs to remember. A picture gets <b>alt</b>, a box gets a <b>label</b>, a click gets a real <b>button</b>. And small text needs at least 4.5 to 1.',
		'nimbus.com now works with eyes closed. Put on the blindfold if you want to follow it by ear only. Good accessibility is mostly good HTML used as intended, and a big part of good [[UX|web/ui-ux]].'
	],
	reactions: {
		blind:
			'Everything went dark. Now the captions, and the voice if your device has one, are the only way to know what is on the page.'
	},
	steps: [
		{
			tag: 'Screen reader',
			title: 'Reading out loud',
			body: 'An app that reads the page one piece at a time. Every phone and laptop has one built in.'
		},
		{
			title: 'Listening to the page',
			body: 'The ring shows where the reader is, the strip shows what it says. Something sounds off.'
		},
		{
			title: 'alt text',
			body: '<b>alt</b> describes a picture in words. Without it, the reader can only say the file name.'
		},
		{
			title: 'A label',
			body: '<b>label</b> names a text box. Tying it to the box with <b>for</b> and <b>id</b> lets the reader say what goes in.'
		},
		{
			title: 'A real button',
			body: 'A <b>div</b> only looks like a button. A real <b>button</b> is announced, reachable with Tab, and pressed with Enter.'
		},
		{
			title: 'For everyone',
			body: 'Keyboard users, people with low vision, someone in bright sun. Good HTML helps all of them at once.'
		},
		{
			title: 'Contrast',
			body: 'How much the text stands out from its background. Normal text needs at least <b>4.5 to 1</b>.'
		},
		{
			title: 'Curb ramps',
			body: 'Built for wheelchairs, loved by strollers and suitcases. Accessible pages are easier for everybody too.'
		},
		{
			tag: 'Remember it',
			title: 'Picture, box, click',
			body: 'Picture gets <b>alt</b>, box gets <b>label</b>, click gets <b>button</b>. Small text at least 4.5 to 1.'
		},
		{
			title: 'Try the blindfold',
			body: 'Cover the screen and follow the page by ear alone, the way a screen reader user does.'
		}
	],
	htmlLabel: 'signup.html',
	previewLabel: 'nimbus.com/join',
	readerLabel: 'The screen reader says',
	readerIdle: 'Nothing yet, the reader is about to start',
	roles: { image: 'image', heading: 'heading level 1', editText: 'edit text', button: 'button' },
	blank: 'blank',
	skipped: '(silence, it jumped right past a clickable box)',
	endOfPage: 'end of page',
	voiceLang: 'en-US',
	page: {
		heading: 'Join the Nimbus newsletter',
		tagline: 'Cloud tips every Friday, never any spam.',
		email: 'Email',
		subscribe: 'Subscribe',
		alt: 'Nim the cloud, the Nimbus logo'
	},
	contrastLabel: 'Contrast of the small text',
	ratio: '{n} to 1',
	need: 'needs 4.5 or more',
	blindfold: 'Blindfold',
	cover: 'You cannot see the screen, listen instead'
};
