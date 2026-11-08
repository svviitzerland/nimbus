import type { ServerlessText } from '../types';

export const en: ServerlessText = {
	title: 'Serverless',
	intro: [
		'Sometimes you only need a snippet of code that runs occasionally, sending OTP emails (one time codes), resizing photos, receiving payment notices (webhooks). On a normal server it stays on 24 hours with the meter always running, while the actual work is occasional.',
		'With <b>serverless</b>, the provider manages servers and execution environments. In this function example, a request triggers code to run. Capacity can grow with demand.',
		'A function runs in an isolated environment. Providers may use lightweight VMs or other sandbox technologies and may reuse ready environments. Preparing a new environment adds time, called a <b>cold start</b>.',
		'The user’s phone is waiting beside that flow. Send a request and watch the function wake, work, then sleep again. This is only the surface, a later chapter dives much deeper into the serverless world.',
		'[ingat] Serverless reduces server management work. Servers still run behind the service.'
	],
	reactions: {
		invoked:
			'The request triggers a function and its result returns to the user. Function service pricing commonly considers request count, execution time, and resources used.',
		zero: 'No function is running in this example. Real charges depend on the service and configuration, including reserved capacity, storage, and data transfer.'
	},
	fnLabel: 'sendOTP function',
	sleepTag: 'asleep, zero cost',
	wakeTag: 'awake',
	runTag: 'working',
	send: 'Call the function',
	callsLabel: 'Called {n}×, paying per call',
	userLabel: 'A user’s phone',
	reqTag: 'request',
	resTag: 'OTP sent',
	alwaysName: 'A normal server',
	alwaysTag: 'charging 24 hours, working occasionally',
	archSteps: [
		'A request arrives',
		'Provider gate',
		'Sandbox lights up',
		'Your function runs',
		'Shut down at once'
	],
	behindItems: ['Firecracker, AWS’s micro VM', 'gVisor, Google’s sandbox'],
	noteIdle: 'The function sleeps, charging nothing at all',
	noteRun: 'Awake in a blink, works, then bows out',
	noteZero: 'Back to sleep at zero'
};
