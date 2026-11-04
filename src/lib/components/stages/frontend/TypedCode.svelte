<script lang="ts">
	// A read only code window that writes itself. Give it the code for the current beat and it
	// backspaces whatever changed and types the new part in, with a caret, like someone typing.
	// Lines touched by the latest edit stay softly highlighted. `onsettled` fires once the text
	// matches the target, so a preview can update only when the typing is finished.
	import { onDestroy, untrack } from 'svelte';
	import { tokenize, type CodeLang, type TokKind } from './code';

	let {
		code,
		lang,
		label,
		onsettled
	}: {
		code: string;
		lang: CodeLang;
		label: string;
		onsettled?: (code: string) => void;
	} = $props();

	let shown = $state(untrack(() => code));
	let caret = $state(-1);
	let touched = $state<[number, number] | null>(null);
	let timer: ReturnType<typeof setInterval> | undefined;

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function run(target: string) {
		clearInterval(timer);
		const a = shown;
		let p = 0;
		while (p < a.length && p < target.length && a[p] === target[p]) p++;
		let s = 0;
		while (
			s < a.length - p &&
			s < target.length - p &&
			a[a.length - 1 - s] === target[target.length - 1 - s]
		)
			s++;
		const head = target.slice(0, p);
		const tail = target.slice(target.length - s);
		const mid = target.slice(p, target.length - s);
		if (a === target || reduced()) {
			shown = target;
			caret = -1;
			touched = a === target ? touched : [p, p + mid.length];
			onsettled?.(target);
			return;
		}
		let gone = a.slice(p, a.length - s);
		let k = 0;
		// Long inserts type a little faster so a beat never waits too long.
		const step = mid.length > 90 ? 2 : 1;
		timer = setInterval(() => {
			if (gone.length) {
				gone = gone.slice(0, -2);
				shown = head + gone + tail;
				caret = p + gone.length;
				touched = [p, p + gone.length];
				return;
			}
			k = Math.min(mid.length, k + step);
			shown = head + mid.slice(0, k) + tail;
			caret = p + k;
			touched = [p, p + k];
			if (k >= mid.length) {
				clearInterval(timer);
				caret = -1;
				onsettled?.(target);
			}
		}, 32);
	}

	$effect(() => {
		const target = code;
		untrack(() => run(target));
	});
	onDestroy(() => clearInterval(timer));

	type Piece = { k: TokKind | 'caret'; v: string };
	const lines = $derived.by(() => {
		const out: { toks: Piece[]; hot: boolean }[] = [];
		let cur: Piece[] = [];
		let start = 0;
		let o = 0;
		let placed = caret < 0;
		const [t0, t1] = touched ?? [-1, -1];
		const close = (end: number) => {
			const hot =
				touched !== null && (t1 > t0 ? t0 <= end && t1 > start : t0 >= start && t0 <= end);
			out.push({ toks: cur, hot });
			cur = [];
		};
		for (const t of tokenize(shown, lang)) {
			const parts = t.v.split('\n');
			parts.forEach((part, i) => {
				if (i > 0) {
					close(o);
					o += 1;
					start = o;
				}
				if (!placed && caret >= o && caret <= o + part.length) {
					const cut = caret - o;
					if (cut > 0) cur.push({ k: t.k, v: part.slice(0, cut) });
					cur.push({ k: 'caret', v: '' });
					if (cut < part.length) cur.push({ k: t.k, v: part.slice(cut) });
					placed = true;
				} else if (part) cur.push({ k: t.k, v: part });
				o += part.length;
			});
		}
		close(o);
		return out;
	});
</script>

<div class="pane">
	<div class="bar">
		<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
		<span class="fname">{label}</span>
	</div>
	<pre class="hl" aria-label={label}>{#each lines as ln, i (i)}<span class="ln" class:hot={ln.hot}
				>{#each ln.toks as t, j (j)}{#if t.k === 'caret'}<i class="caret"></i>{:else}<span
							class={t.k}>{t.v}</span
						>{/if}{/each}</span
			>{/each}</pre>
</div>

<style>
	.pane {
		min-width: 0;
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.fname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
	}
	.hl {
		margin: 0;
		padding: 9px 0;
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.55;
		tab-size: 2;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--color-ink);
		min-height: var(--code-min, 0);
	}
	.ln {
		display: block;
		min-height: 1.55em;
		padding: 0 12px;
		border-left: 3px solid transparent;
		transition:
			background 0.4s,
			border-color 0.4s;
	}
	.ln.hot {
		background: color-mix(in srgb, var(--color-brand) 9%, transparent);
		border-left-color: var(--color-brand);
	}
	.caret {
		display: inline-block;
		width: 2px;
		height: 1.1em;
		margin: 0 -1px;
		vertical-align: -0.15em;
		background: var(--color-brand);
	}
	.pun {
		color: var(--color-faint);
	}
	.tag,
	.sel,
	.kw {
		color: var(--color-brand);
		font-weight: 600;
	}
	.att,
	.prop,
	.num {
		color: var(--color-amber);
	}
	.str,
	.val {
		color: var(--color-grass);
	}
	.com {
		color: var(--color-faint);
		font-style: italic;
	}
	@media (prefers-reduced-motion: reduce) {
		.ln {
			transition: none;
		}
	}
</style>
