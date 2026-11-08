import type { LessonText } from '../../types';

export interface GpuJob {
	name: string;
	sub: string; // one line on what the job is like
	unit: string; // what is counted in the progress, sums or steps
}

export interface GpuText extends LessonText {
	jobLabel: string; // caption over the two job cards
	/** The two jobs, the neural net pile of sums first, then the step by step recipe. */
	jobs: GpuJob[];
	raceBtn: string;
	racing: string;
	again: string;
	cpuName: string;
	cpuSub: string; // how many cores and what they are like
	gpuName: string;
	gpuSub: string;
	ready: string; // lane status before the race
	progress: string; // template with {n}, {t} and {u}
	finished: string; // template with {s}, seconds taken
	faster: string; // template with {k}, how many times faster the winner was
	triedBoth: string; // template with {n}, how many of the 2 jobs were raced
}
