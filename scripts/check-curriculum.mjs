// Check the real content and navigation registry without rendering stage components.
import { plugin } from 'bun';
import { writeFileSync } from 'node:fs';
plugin({
	name: 'curriculum-data',
	setup(build) {
		build.onLoad({ filter: /\.svelte$/ }, () => ({
			contents: 'export default function Stage() {}',
			loader: 'js'
		}));
	}
});
const { chapters } = await import('../src/lib/chapters/index.ts');
const { modules } = await import('../src/lib/modules.ts');
const { tracks } = await import('../src/lib/tracks.ts');
const lessons = new Map(chapters.flatMap((c) => c.lessons.map((l) => [`${c.id}/${l.id}`, l])));
const planned = new Set(
	modules.flatMap((m) => m.items.filter((x) => typeof x !== 'string').map((x) => x.soon))
);
const errors = [],
	warnings = [];
const general = tracks.find((t) => t.id === 'general').groups.flatMap((g) => g.items);
const key = (x) => (typeof x === 'string' ? x : x.soon);
for (const [path, lesson] of lessons) {
	for (const lang of ['id', 'en']) {
		const text = lesson.text[lang];
		if (!text?.title || !text.intro?.length) errors.push(`${path} ${lang} has no title or intro`);
		if (!text.intro.some((line) => line.startsWith('[ingat]')))
			errors.push(`${path} ${lang} has no memory cue`);
		if (text.intro.some((line) => line.replace(/<[^>]+>/g, '').length > 420))
			warnings.push(`${path} ${lang} has a long beat`);
		for (const match of JSON.stringify(text).matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)) {
			const target = match[2];
			if (
				!(
					lessons.has(target) ||
					tracks.some((t) => t.id === target) ||
					planned.has(target.split(':').at(-1))
				)
			)
				errors.push(`${path} ${lang} broken link ${target}`);
		}
	}
	if (
		Object.keys(lesson.text.id.reactions).sort().join() !==
		Object.keys(lesson.text.en.reactions).sort().join()
	)
		errors.push(`${path} reaction keys differ between languages`);
	if (lesson.text.id.intro.length !== lesson.text.en.intro.length)
		warnings.push(`${path} beat counts differ between languages`);
}
for (const m of modules)
	for (const item of m.items) {
		if (typeof item === 'string' && !lessons.has(item))
			errors.push(`Module ${m.id} references missing ${item}`);
		if (!m.branch && general.filter((x) => key(x) === key(item)).length !== 1)
			errors.push(`General must include ${key(item)} exactly once`);
	}
for (const t of tracks)
	for (const item of t.groups.flatMap((g) => g.items))
		if (typeof item === 'string' && !lessons.has(item))
			errors.push(`Track ${t.id} references missing ${item}`);
if (general.at(-1) !== 'capstone/crossroads') errors.push('General must end at the crossroads');
const prerequisites = {
	'security/risk': ['security/cia'],
	'security/threats': ['security/risk'],
	'security/mitm': ['security/tls', 'security/sniffing'],
	'security/owasp': ['security/web-attacks'],
	'security/nist': ['security/risk', 'security/incident'],
	'security/cve-cwe': ['security/web-attacks'],
	'security/cvss': ['security/cve-cwe', 'security/cia'],
	'security/vulnerability-management': ['security/cvss', 'security/risk', 'security/hardening'],
	'security/csrf': ['web/auth', 'security/access-control'],
	'security/ssrf': ['web/http', 'security/burp-suite'],
	'cloud/region': ['cloud/data-center'],
	'resilience/availability-zone': ['cloud/data-center', 'cloud/region'],
	'network/arp': ['network/ip-address', 'network/mac', 'network/subnet'],
	'web/devtools': ['web/http', 'web/browser'],
	'web/forms': ['web/html', 'web/js'],
	'web/testing': ['web/js'],
	'security/web-attacks': ['web/http', 'web/html', 'web/sql'],
	'security/burp-suite': ['web/http', 'security/pentest'],
	'security/access-control': ['web/auth', 'security/burp-suite'],
	'ai/data-leakage': ['ai/data', 'ai/evaluation'],
	'devops/secrets': ['devops/release']
};
for (const t of tracks) {
	const items = [...new Set(t.groups.flatMap((g) => g.items).map(key))];
	for (const [lesson, required] of Object.entries(prerequisites))
		if (items.includes(lesson))
			for (const before of required) {
				if (!items.includes(before) || items.indexOf(before) > items.indexOf(lesson))
					errors.push(`${t.id} needs ${before} before ${lesson}`);
			}
}
const report = {
	lessonCount: lessons.size,
	interactive: [...lessons.values()].filter((l) => l.playable).length,
	modules: modules.length,
	tracks: tracks.map((t) => ({
		id: t.id,
		lessons: new Set(t.groups.flatMap((g) => g.items).map(key)).size
	})),
	errors: [...new Set(errors)],
	warnings
};
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
	console.log(`${report.lessonCount} lessons, ${report.modules} modules, ${tracks.length} tracks`);
	for (const error of report.errors) console.error(error);
	console.log(`${report.errors.length} errors, ${warnings.length} editorial notes`);
}
const exportIndex = process.argv.indexOf('--export');
if (exportIndex !== -1)
	writeFileSync(
		process.argv[exportIndex + 1],
		JSON.stringify(
			[...lessons].map(([path, l]) => ({
				path,
				playable: !!l.playable,
				id: l.text.id,
				en: l.text.en
			})),
			null,
			2
		)
	);
process.exitCode = errors.length ? 1 : 0;
