import type { AgentsText } from './types';

export const en: AgentsText = {
	title: 'AI agents',
	intro: [
		'A chatbot only <b>talks</b>. You ask, it answers with text, and that is it. An <b>AI agent</b> can also <b>do</b> things for you.',
		'The trick is <b>tools</b>. A tool is a small function the model is allowed to use, like reading a calendar or sending an email. The model never touches your calendar itself, it asks a normal program to, and the program sends back the result.',
		'An agent works in a <b>loop</b>. It thinks about what to do next, calls a tool, reads what came back, then thinks again. Round and round until the job is done.',
		'Under the hood, the thinking is the same [[language model|ai/llm]] a chatbot uses. A tool call is just text written in a strict format, which a program reads and runs, often by calling an [[API|foundations/api]].',
		"[fyi] Because an agent acts in the real world, a good one asks first before anything you can't undo, like paying, deleting files, or changing your calendar. A person stays in charge.",
		'I asked my agent to book a meeting with Raka on Thursday at ten. Let us watch it work, one step at a time, nothing hidden.',
		'Step through the agent, or let it run by itself. When it asks for permission, you decide.'
	],
	reactions: {
		think:
			'That is the agent thinking. It writes itself a tiny plan before acting, like a note on a sticky pad.',
		tool: 'Now it calls a tool. See the calendar light up? The model only wrote the request, the calendar program does the real work.',
		result:
			'The tool answers with plain data. The model reads it like any other text, then decides what to do next.',
		busy: 'Smart, ten is already taken, so it changed the plan. That is the loop at work. Act, look at what came back, adjust.',
		ask: 'Booking changes your real calendar, so the agent stops and asks. Your call!',
		allow: 'Allowed. The booking goes through and the calendar updates right away.',
		deny: "Denied. A good agent respects that and doesn't try to sneak around it.",
		email:
			'It reaches for a second tool all by itself. Chaining tools like this is what makes an agent feel like a little helper.',
		done: 'Done! One sentence from you turned into several steps, two tools, and one question back to you. Every step was visible, which is how you can trust an agent and fix it when it goes wrong.',
		done_deny:
			'It finished without booking anything, because you said no. Reset and allow it this time to see the whole job.',
		auto: '[fyi] Real agents run by themselves like this, sometimes for dozens of steps. That is exactly why a readable log of every step matters so much.'
	},
	youLabel: 'You asked',
	goal: 'Book a meeting with Raka on Thursday at 10.',
	modelLabel: 'AI agent',
	calendarLabel: 'Calendar',
	emailLabel: 'Email',
	day: 'Thursday',
	free: 'free',
	teamSync: 'Team sync',
	withRaka: 'Meeting with Raka',
	emailIdle: 'Nothing sent yet',
	emailSent: 'Invite sent to Raka',
	kinds: { think: 'Thinks', call: 'Calls a tool', result: 'Gets back', answer: 'Answers' },
	think1: "To book this I first need Thursday's schedule. I'll ask the calendar.",
	think2: 'Ten is taken by the team sync, but eleven is free. I will book eleven instead.',
	finalAllow:
		'All set! You meet Raka on Thursday at 11 (10 was already taken by the team sync), and I sent Raka the invite.',
	finalDeny: 'Okay, I did not book anything. Your calendar is untouched.',
	status: {
		idle: 'Waiting to start',
		thinking: 'Thinking',
		calling: 'Asking the {tool}',
		reading: 'Reading the answer',
		waiting: 'Waiting for your OK',
		done: 'Finished'
	},
	stepBtn: 'Next step',
	autoBtn: 'Run by itself',
	running: 'Running',
	reset: 'Reset',
	approvalQ: 'The agent wants to book Thursday 11:00 in your calendar. Let it?',
	allow: 'Allow',
	deny: 'Deny',
	logLabel: 'Every step, in order',
	logEmpty: 'Nothing yet, the agent is waiting for its first step',
	stepCount: '{n} steps'
};
