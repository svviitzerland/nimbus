import type { LessonText } from '../../types';

export interface ComponentsText extends LessonText {
	/** Caption over the component recipe. */
	recipeLabel: string;
	/** Caption over the data rows. */
	dataLabel: string;
	/** Caption over the live shop preview. */
	previewLabel: string;
	/** The four products, name and price. */
	products: { name: string; price: number }[];
	/** Money template, {n} is the amount. */
	money: string;
	/** Button on each data row that drops a Card on the page. */
	use: string;
	/** Shown on a row once its card is on the page. */
	used: string;
	/** Shown in the preview while it is empty. */
	empty: string;
	/** The one change to the recipe, offered once every card is placed. */
	upgrade: string;
	/** Text of the button that the upgrade adds to every card. */
	addToCart: string;
	/** Hint before the upgrade is unlocked. */
	upgradeHint: string;
}
