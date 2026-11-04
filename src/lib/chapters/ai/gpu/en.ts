import type { GpuText } from './types';

export const en: GpuText = {
	title: 'GPUs for AI',
	intro: [
		'Remember how a [[neural network|ai/neural-net]] makes a guess? Under the hood it is a huge pile of tiny multiplications, like 3 × 4, again and again. A chatbot does billions of them for every single word. Something has to do all those sums.',
		'The usual brain of a computer is the [[CPU|basics/hardware]]. Inside it are a handful of <b>cores</b>, and a core is one worker that does one job at a time. CPU cores are big, clever and very fast, great for tricky jobs.',
		'A <b>GPU</b> (graphics processing unit) was first built for video games. A screen has millions of pixels and each one needs its own little sum many times a second, so a GPU packs in <b>thousands of tiny cores</b> that all work at the same moment.',
		'Now let them race on a pile of small sums. The CPU cores are quick, but there are only four of them, so they chew through the pile a few at a time. The GPU hands one sum to every tiny core, and the whole pile is done in one go.',
		'[ingat] A CPU is a few professors, a GPU is a stadium full of students. For one hard problem, ask a professor. For a million easy sums done together, the stadium wins every time.',
		'That is exactly why AI loves GPUs. A neural network is mostly piles of small sums that do not wait for each other. Around 2012 researchers trained a famous picture model on GPUs, and AI suddenly took off.',
		'[fyi] That is how NVIDIA, a company once known for gaming cards, became one of the most valuable companies on Earth. Most teams never buy GPUs at all, they rent them by the hour in the [[cloud|ai/ai-cloud]].',
		'One more twist, if you are curious. Switch the job to a chain of steps where each step needs the answer before it, and see who wins then.'
	],
	reactions: {
		chain:
			'The CPU wins this time! Each step needs the one before, so only one worker can move at a time. The stadium just waits, and one tiny core is slower than a professor.',
		pile: 'Back to the pile of easy sums, and the stadium wins again. Every AI computer keeps both, the CPU for the step by step work and the GPU for the big piles of sums.'
	},
	panels: [
		{
			tag: 'The work',
			title: 'A pile of tiny sums',
			body: 'Each square is one small multiplication. AI needs millions of them for every answer, and most of them do not depend on each other.'
		},
		{
			tag: 'CPU',
			title: 'A few big cores',
			body: 'A <b>CPU</b> has a handful of strong, fast cores. Great at hard jobs that go step by step, and at running everything else on the computer.'
		},
		{
			tag: 'GPU',
			title: 'Thousands of tiny cores',
			body: 'A <b>GPU</b> has thousands of small, simple cores. Each one is slower, but they all work at the very same moment.'
		},
		{
			tag: 'The race',
			title: 'Many small sums',
			body: 'The CPU clears the pile four sums at a time. The GPU gives every core one sum, so the pile is gone in a single round.'
		},
		{
			tag: 'Make it stick',
			title: 'Professors and a stadium',
			body: 'A few brilliant professors versus a stadium of students. Easy sums in bulk? Hand them to the stadium.'
		},
		{
			tag: 'Try it',
			title: 'A chain of steps',
			body: 'When every step needs the answer before it, only one worker can move at a time, and the fast professor wins.'
		}
	],
	cpuName: 'CPU',
	cpuSub: 'a few big cores',
	gpuName: 'GPU',
	gpuSub: 'thousands of tiny cores',
	cpuNick: 'a few professors',
	gpuNick: 'a stadium of students',
	jobs: {
		pile: 'Many small sums, none waits for another',
		chain: 'A chain of steps, each needs the one before'
	},
	ready: 'Ready',
	working: 'Working',
	doneIn: 'Done in {s} seconds',
	rule: 'Hard and step by step goes to the CPU. Easy and in bulk goes to the GPU.',
	switchJob: {
		pile: 'Switch to a chain of steps',
		chain: 'Back to the pile of sums'
	}
};
