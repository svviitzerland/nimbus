/** One step of the side panel in a guided network lesson (see Guide.svelte). */
export interface GuideStepText {
	title: string;
	/** One or two short sentences, simple HTML like <b> is allowed. */
	body: string;
	/** Optional small tag over the title, for example "Remember it". */
	tag?: string;
}
