import type { LessonText } from '../../types';

/** One step of the guided dissection, shown in the side panel. */
export interface HardwareStep {
	tag: string; // small pill above the title
	title: string;
	body: string; // one or two plain sentences, <b> allowed
}

export interface HardwareText extends LessonText {
	/**
	 * Eleven steps, one per beat, in this order: the whole laptop, motherboard, CPU, RAM,
	 * storage, loading (storage to RAM to CPU), the memory trick, GPU, battery, input and output,
	 * and the whole team again.
	 */
	steps: HardwareStep[];
	/** Short labels drawn next to each part in the picture. */
	labels: {
		screen: string;
		keyboard: string;
		board: string;
		cpu: string;
		ram: string;
		storage: string;
		gpu: string;
		battery: string;
	};
	/** Small tags for the memory trick, when the power goes off. */
	powerOff: string;
	cleared: string; // on RAM, it forgot everything
	kept: string; // on storage, it still has the files
	/** The word typed on the screen during the input and output step. */
	typed: string;
	/** Accessible label for the whole picture. */
	picture: string;
}
