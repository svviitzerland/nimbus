import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

/** The three drawings the stage knows, the cat first. */
export type VisionObjectId = 'cat' | 'fish' | 'house';

export interface VisionObject {
	/** What the last layer calls it. */
	name: string;
	/** The shape parts the second layer finds, in the same order as the drawing in the stage. */
	parts: string[];
}

export interface VisionText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: GuidePanel[];
	objects: Record<VisionObjectId, VisionObject>;
	/** Names of the edge directions, flat, upright, slanted. */
	edges: string[];
	/** Captions of the three layers on the remember scene, edges, shapes, thing. */
	layers: string[];
	guess: string; // template with {x}, the final answer
	rule: string; // the rule of thumb shown on the remember scene
	another: string; // the optional button that swaps the drawing
}
