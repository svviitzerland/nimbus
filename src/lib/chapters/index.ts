import type { Chapter } from './types';
import { foundations } from './foundations';
import { cloudChapter } from './cloud';
import { resilience } from './resilience';
import { trafficflow } from './trafficflow';
import { traffic } from './traffic';
import { networking } from './networking';
import { compute } from './compute';
import { capstone } from './capstone';
import { providersChapter } from './providers';
import { devopsChapter } from './devops';
import { linuxChapter } from './linux';
import { networkChapter } from './network';
import { basicsChapter } from './basics';
import { webChapter } from './web';
import { securityChapter } from './security';
import { aiChapter } from './ai';
import { netlabChapter } from './netlab';

/** All chapters, in order. Add a new chapter by importing it and appending here. */
export const chapters: Chapter[] = [
	foundations,
	cloudChapter,
	resilience,
	trafficflow,
	traffic,
	networking,
	compute,
	capstone,
	webChapter,
	securityChapter,
	aiChapter,
	netlabChapter,
	basicsChapter,
	networkChapter,
	linuxChapter,
	devopsChapter,
	providersChapter
];

export function getChapter(id?: string): Chapter | undefined {
	return chapters.find((c) => c.id === id);
}

/** The chapter after this one, or undefined if this is the last. */
export function getNextChapter(id?: string): Chapter | undefined {
	const i = chapters.findIndex((c) => c.id === id);
	return i >= 0 ? chapters[i + 1] : undefined;
}

export function getLessonIndex(chapter: Chapter, lessonId?: string): number {
	return chapter.lessons.findIndex((l) => l.id === lessonId);
}
