import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface ComponentsText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	/** Caption over the component recipe (a file name). */
	recipeLabel: string;
	/** Caption over the props that flow into the recipe. */
	propsLabel: string;
	/** Address shown in the browser. */
	pageLabel: string;
	/** Labels on the page parts in the "made of components" part. */
	headerTag: string;
	cardTag: string;
	/** The four products, name and price (names short, about 12 letters). */
	products: { name: string; price: number }[];
	/** Money template, {n} is the amount. */
	money: string;
	/** The button that Card gains. */
	addToCart: string;
	/** The optional toggle on the last beat. */
	removeButton: string;
	addButton: string;
}
