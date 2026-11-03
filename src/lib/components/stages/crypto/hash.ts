// A tiny, deterministic stand in for a real hash function (like SHA 256), shared by the
// cryptography lessons. It is FNV 1a over the text, run twice with different seeds so the
// result is 8 hex characters. Not secure, only meant to show that any change to the input
// flips the whole fingerprint.
function fnv(s: string, seed: number): number {
	let h = seed >>> 0;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619) >>> 0;
	}
	// a final avalanche so short inputs still spread across all digits
	h ^= h >>> 15;
	h = Math.imul(h, 2246822507) >>> 0;
	h ^= h >>> 13;
	return h >>> 0;
}

export function fingerprint(s: string): string {
	const a = fnv(s, 2166136261).toString(16).padStart(8, '0');
	return a.slice(0, 4) + fnv(s, 3141592653).toString(16).padStart(8, '0').slice(0, 4);
}
