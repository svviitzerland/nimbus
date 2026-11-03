import { error } from '@sveltejs/kit';
import { getChapter } from '$lib/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
	const chapter = getChapter(params.chapter);
	if (!chapter) error(404, 'Chapter not found');
	// `?track=<id>` means a whole topic track just ended here, not only this chapter.
	return { chapterId: chapter.id, trackId: url.searchParams.get('track') };
};
