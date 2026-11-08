import type { LessonText } from '../../types';

export interface VisionText extends LessonText {
	canvasLabel: string; // aria label of the drawing grid
	drawHint: string; // shown while the grid is empty
	clear: string;
	goal: string; // template with {n}, how many different things it has recognised (of 3 needed)
	layer1: string; // caption of the edge maps
	layer2: string; // caption of the shape parts
	layer3: string; // caption of the final guess
	/** The four edge directions, flat, upright, rising slant, falling slant. */
	edges: string[];
	/** The shape parts, straight runs, slants, corners, crossings, closed loop. */
	parts: string[];
	/** The objects it can name, line, cross, box, ring (same order as the code). */
	objects: string[];
	unsure: string; // the guess when nothing stands out yet
	guess: string; // template with {x}, the final answer
}
