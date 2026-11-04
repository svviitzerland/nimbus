import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

/** The two jobs, a pile of independent sums, or a chain where each step needs the last. */
export type GpuJobId = 'pile' | 'chain';

export interface GpuText extends LessonText {
	/** One panel per scene of the guided visual (six scenes). */
	panels: GuidePanel[];
	cpuName: string;
	cpuSub: string; // what its cores are like
	gpuName: string;
	gpuSub: string;
	cpuNick: string; // the memory trick, a few professors
	gpuNick: string; // the memory trick, a stadium of students
	/** One line describing each job. */
	jobs: Record<GpuJobId, string>;
	ready: string; // lane status before the race starts
	working: string; // lane status while it works
	doneIn: string; // template with {s}, seconds taken
	rule: string; // the rule of thumb on the remember scene
	/** The optional button, switch to the chain, then back to the pile. */
	switchJob: Record<GpuJobId, string>;
}
