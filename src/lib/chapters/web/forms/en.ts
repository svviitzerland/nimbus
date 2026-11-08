import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Forms and validation',
	intro: [
		'A <b>form</b> collects input such as an email address. Its <b>label</b> identifies the field. HTML attributes <b>required</b> and <b>type="email"</b> let the browser check it.',
		'Try submitting <b>nim</b>. The browser stops it before a request leaves. This is <b>client validation</b>, useful for quick feedback.',
		'Now send directly with the lab button. Browsers are not the only clients, so their checks can be bypassed. A server without validation accepts the bad input.',
		'Enable server validation and resend the same value. Then try <b>nim@nimbus.com</b>. A valid email format does not prove the address exists or belongs to the sender.',
		'[ingat] <b>The browser helps you fill it in. The server decides what to accept.</b> You need both.'
	],
	reactions: {
		client:
			'The browser stopped the submission. This validation comes from its built in email field.',
		bypassed:
			'201, even though the input is not an email. Browser validation cannot protect a server on its own.',
		server:
			'422. The server itself rejected invalid input even though the request bypassed the form.',
		valid:
			'The format was accepted. A real application still needs to verify ownership, for example with a verification link.'
	},
	labLabel: 'Your experiment',
	goal: 'Check input all the way to the server',
	tasks: ['See the browser reject input', 'Bypass the browser check', 'Validate on the server too'],
	hintLabel: 'Hint',
	hint: 'Leave nim in the field. Submit the form, send directly, enable server validation, then send directly again.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		email: 'Test email',
		sample: 'Use nim or nim@nimbus.com. No email is sent.',
		submit: 'Submit form',
		direct: 'Send directly to server',
		validate: 'Server validation on',
		waiting: 'The server has no request yet'
	}
};
