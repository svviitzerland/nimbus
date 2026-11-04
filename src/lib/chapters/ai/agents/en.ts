import type { AgentsText } from './types';

export const en: AgentsText = {
	title: 'AI agents',
	intro: [
		'A chatbot only <b>talks</b>. You ask, it answers with words, and that is it. An <b>AI agent</b> can also <b>do</b> things for you.',
		'The secret is <b>tools</b>. A tool is a small program the model is allowed to use, like a calendar. The model never touches the calendar itself, it writes a request and a normal program does the work.',
		'I asked my agent to book a meeting with Raka on Thursday at ten. First it <b>thinks</b>, and writes itself a tiny plan.',
		'Then it <b>acts</b>. It calls the calendar tool, and the calendar answers with plain data.',
		'Then it <b>checks</b> what came back. Ten is already taken by the team sync! So it changes the plan, eleven is free.',
		'Booking changes your real calendar, so a good agent stops and <b>asks first</b>. You stay in charge.',
		'You say yes, it books eleven, and it tells you what it did. One sentence from you became several small steps.',
		'[ingat] An agent is a model with hands. It thinks, acts, checks, and goes round again until the job is done.',
		'[fyi] Under the hood, the thinking is the same [[language model|ai/llm]] a chatbot uses. A tool call is just text in a strict format, which a program reads and runs, often through an [[API|foundations/api]].',
		'Your turn, if you like. The agent is asking for permission. Allow it or deny it, and see how a good agent behaves either way.'
	],
	reactions: {
		allow: 'Allowed. The booking goes through, and the agent tells you exactly what changed.',
		deny: "Denied. A good agent respects that, books nothing, and doesn't try to sneak around you."
	},
	panels: [
		{
			tag: 'Chatbot',
			title: 'Words only',
			body: 'A chatbot can tell you <b>how</b> to book a meeting. It cannot book it for you.'
		},
		{
			tag: 'Tools',
			title: 'The hands',
			body: 'A tool is a normal program, like a calendar. The model writes a request, the program does the real work.'
		},
		{
			tag: 'Think',
			title: 'Make a tiny plan',
			body: 'Before acting, the model writes down what it needs first. Here, it needs Thursday’s schedule.'
		},
		{
			tag: 'Act',
			title: 'Call a tool',
			body: 'The request goes to the calendar, and the calendar sends back plain data, which slots are busy.'
		},
		{
			tag: 'Check',
			title: 'Look, then adjust',
			body: 'Ten is taken, so the plan changes to eleven. Checking the result is what keeps an agent on track.'
		},
		{
			tag: 'Permission',
			title: 'Ask before acting',
			body: 'Anything that changes your real stuff, like your calendar or your money, waits for <b>your</b> OK.'
		},
		{
			tag: 'Done',
			title: 'Booked and reported',
			body: 'The calendar now shows the meeting at eleven, and the agent explains what it changed and why.'
		},
		{
			tag: 'Make it stick',
			title: 'A model with hands',
			body: '<b>Think, act, check</b>, then go round again. That loop is the whole agent.'
		},
		{
			tag: 'Try it',
			title: 'Your call',
			body: 'Allow or deny the booking. Either way, a good agent tells you plainly what happened.'
		}
	],
	picture:
		'An AI agent surrounded by a loop of three steps, think, act, and check, connected to a calendar app for Thursday, with a permission question underneath.',
	goal: 'Book a meeting with Raka on Thursday at 10.',
	youLabel: 'You',
	chatOnly:
		'Sure! Open your calendar app, tap Thursday, and add a meeting at 10. Then send Raka an invite.',
	chatbotLabel: 'Chatbot',
	agentLabel: 'AI agent',
	loop: { think: 'Think', act: 'Act', check: 'Check' },
	calendarLabel: 'Calendar',
	day: 'Thursday',
	free: 'free',
	teamSync: 'Team sync',
	withRaka: 'Raka',
	think1: 'First I need Thursday’s schedule. I will ask the calendar.',
	think2: 'Ten is taken by the team sync. Eleven is free, I will offer eleven.',
	think3: 'This changes the real calendar, so I should ask first.',
	call: 'calendar.read("Thursday")',
	result: '10:00 busy, 11:00 free',
	approvalQ: 'Book Thursday at 11 with Raka?',
	allow: 'Allow',
	deny: 'Deny',
	finalAllow: 'Booked! You meet Raka on Thursday at 11, because 10 was taken.',
	finalDeny: 'Okay, I booked nothing. Your calendar is untouched.',
	memo: 'a model with hands',
	rule: 'Think, act, check, repeat',
	again: 'Ask again'
};
