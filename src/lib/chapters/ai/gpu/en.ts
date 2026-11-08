import type { GpuText } from './types';

export const en: GpuText = {
	title: 'GPUs for AI',
	intro: [
		'Remember the umbrella network? Even that tiny thing did dozens of multiplications for every guess. A chatbot does billions for every single word, and training repeats that over and over for weeks. Something has to crunch all those sums.',
		'A [[CPU|basics/hardware]] has cores that execute program instructions. It handles many kinds of work, including dependent steps and program control flow.',
		'A <b>GPU</b> (graphics processing unit) was first built for games. Your screen has millions of pixels and each one needs its own little sum many times a second, so a GPU packs in <b>thousands of simple cores</b> that all work at the same moment.',
		'Then researchers noticed something. A neural network is also just giant piles of small multiplications that do not need to wait for each other. That is exactly the work a GPU loves, and around 2012 this discovery helped AI suddenly take off.',
		'[fyi] That is why NVIDIA, a company once known for gaming cards, became one of the most valuable companies on Earth. Big AI labs buy tens of thousands of GPUs, and most teams simply rent them by the hour in the [[cloud|ai/ai-cloud]].',
		'[ingat] A GPU can run many similar calculations in parallel. The benefit depends on the workload and how the program uses it.',
		'Here are my CPU and my GPU at the starting line. Pick a job and start the race. Try both jobs, the winner might surprise you.'
	],
	reactions: {
		racing:
			'And they are off! Watch the cores light up. The CPU has a few quick workers, the GPU has a whole crowd of slower ones.',
		gpu: 'The GPU crushed it! Each of its cores is slower, but 256 of them working side by side clear the pile in a few big rounds. Training a real model is this job, times a billion.',
		cpu: 'This time the CPU wins! Every step needs the answer from the step before, so only one core can ever work. The GPU crowd just stands around, and its single slow core falls behind.',
		done: 'Now you have seen both sides. A GPU is not a better CPU, it is a different kind of worker. Every AI computer keeps a CPU for the clever step by step work and hands the huge piles of little sums to the GPU.'
	},
	jobLabel: 'Pick a job',
	jobs: [
		{
			name: 'Train a neural net',
			sub: '1,024 little sums, none waits for another',
			unit: 'sums'
		},
		{
			name: 'Follow a recipe',
			sub: '64 steps, each one needs the step before',
			unit: 'steps'
		}
	],
	raceBtn: 'Start the race',
	racing: 'Racing',
	again: 'Race again',
	cpuName: 'CPU',
	cpuSub: '8 big, quick cores',
	gpuName: 'GPU',
	gpuSub: '256 small, slower cores',
	ready: 'Waiting at the start',
	progress: '{n} of {t} {u}',
	finished: 'Done in {s} seconds',
	faster: '{k} times faster',
	triedBoth: '{n} of 2 jobs raced'
};
