<script lang="ts">
	// A guided HTTP lesson. The laptop and the server chat by themselves while Nim narrates, the
	// envelope flies over (a request) and back (a response), and the screen shows what came back.
	// On the last beat the learner may tap a page to send one request of their own.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HttpKind, HttpText } from '$lib/chapters/web/http/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HttpText);

	// Watch first, play optional, so the stage is visible from the start and Next never locks.
	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	const KINDS: HttpKind[] = ['ok', 'moved', 'notfound', 'broken'];
	const REQ: Record<HttpKind, { path: string; code: string }> = {
		ok: { path: '/about', code: '200 OK' },
		moved: { path: '/old-blog', code: '301 Moved' },
		notfound: { path: '/pricing', code: '404 Not Found' },
		broken: { path: '/report', code: '500 Error' }
	};

	type Phase = 'rest' | 'start' | 'go' | 'think' | 'back' | 'shown' | 'mid';
	let phase = $state<Phase>('rest');
	let label = $state('');
	let screen = $state<HttpKind | 'loading' | null>(null);
	let pick = $state<HttpKind | null>(null);
	let runId = $state(0);
	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	/** One full round trip, request out and response back, ending with the page on screen. */
	function trip(k: HttpKind, done?: () => void): SeqStep[] {
		return [
			[
				60,
				() => {
					phase = 'start';
					label = `GET ${REQ[k].path}`;
					screen = 'loading';
				}
			],
			[1300, () => (phase = 'go')],
			[
				700,
				() => {
					phase = 'think';
					label = REQ[k].code;
				}
			],
			[1300, () => (phase = 'back')],
			[
				2600,
				() => {
					phase = 'shown';
					screen = k;
					done?.();
				}
			]
		];
	}
	/** Only the request half, looping, for the beats about asking. */
	function ask(method: string, path: string): SeqStep[] {
		return [
			[
				60,
				() => {
					phase = 'start';
					label = `${method} ${path}`;
					screen = 'loading';
				}
			],
			[1300, () => (phase = 'go')],
			[900, () => (phase = 'think')]
		];
	}

	function play(s: number, p: HttpKind | null, still: boolean): (() => void) | undefined {
		if (s <= 1 || (s === last && !p)) {
			phase = 'rest';
			screen = null;
			return;
		}
		if (still) {
			// A calm still frame, the envelope parked mid way and the answer already on screen.
			const k = s === last && p ? p : 'ok';
			phase = 'mid';
			if (s <= 3) {
				label = s === 3 ? 'POST /messages' : 'GET /about';
				screen = 'loading';
			} else {
				label = REQ[k].code;
				screen = k;
			}
			if (s === last && p) onstate?.(p);
			return;
		}
		if (s === 2) return runSeq(ask('GET', '/about'), true);
		if (s === 3) return runSeq([...ask('GET', '/about'), ...ask('POST', '/messages')], true);
		if (s === 5 || s === 6)
			return runSeq(
				KINDS.flatMap((k) => trip(k)),
				true
			);
		if (s === last && p) return runSeq(trip(p, () => onstate?.(p)));
		return runSeq(trip('ok'), true);
	}

	$effect(() => {
		const s = step;
		const p = pick;
		const still = reduce;
		void runId;
		return untrack(() => play(s, p, still));
	});

	function send(k: HttpKind) {
		pick = k;
		runId += 1;
	}

	const LEFT = 232;
	const RIGHT = 318;
	const MID = 275;
	const envX = $derived(phase === 'go' || phase === 'think' ? RIGHT : phase === 'mid' ? MID : LEFT);
	const envOn = $derived(phase === 'go' || phase === 'back' || phase === 'mid');
	const isResponse = $derived(/^\d/.test(label));
	const secure = $derived(step === 7);
	const shownKind = $derived(screen && screen !== 'loading' ? screen : null);
	const legendOn = $derived(step >= 5 && step !== 7);
	const legendHit = $derived(shownKind ? KINDS.indexOf(shownKind) : -1);
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pages" role="group" aria-label={tx.pagesLabel}>
				<span class="cap">{tx.pagesLabel}</span>
				<div class="chips">
					{#each KINDS as k (k)}
						<button type="button" class="chip" class:on={pick === k} onclick={() => send(k)}
							>{REQ[k].path}</button
						>
					{/each}
				</div>
			</div>
		{/if}

		<svg
			viewBox="0 0 460 190"
			class="scene"
			role="img"
			aria-label="{tx.youLabel}, {tx.serverLabel}"
		>
			<!-- the wire between them -->
			<line x1="190" y1="88" x2="358" y2="88" class="wire" class:lit={i === 1} />
			{#if i === 1}
				<text x="274" y="74" text-anchor="middle" class="wire-label">HTTP</text>
			{/if}

			<!-- laptop -->
			<rect x="10" y="22" width="180" height="122" rx="10" class="shell" />
			<rect x="18" y="30" width="164" height="106" rx="5" class="screen" />
			<rect x="26" y="37" width="148" height="15" rx="7.5" class="addr" />
			{#if secure}
				<g transform="translate(34 41)" class="lock">
					<rect x="0" y="3" width="7" height="5.5" rx="1" />
					<path d="M1.5 3V2a2 2 0 0 1 4 0v1" />
				</g>
			{/if}
			<text x={secure ? 45 : 36} y="48" class="url">nimbus.com</text>

			{#if shownKind}
				<g class="page {shownKind}">
					<text x="28" y="72" class="p-title">{tx.screen.results[shownKind].title}</text>
					<text x="28" y="86" class="p-text">{tx.screen.results[shownKind].text}</text>
					{#if shownKind === 'ok'}
						<rect x="28" y="96" width="120" height="6" rx="3" class="bar" />
						<rect x="28" y="108" width="96" height="6" rx="3" class="bar" />
						<rect x="28" y="120" width="44" height="10" rx="5" class="btn" />
					{:else}
						<text x="28" y="122" class="p-code">{REQ[shownKind].code.slice(0, 3)}</text>
					{/if}
				</g>
			{:else if screen === 'loading'}
				<g class="loading">
					<circle cx="88" cy="92" r="3.2" />
					<circle cx="100" cy="92" r="3.2" />
					<circle cx="112" cy="92" r="3.2" />
					<text x="100" y="112" text-anchor="middle" class="p-text">{tx.screen.loading}</text>
				</g>
			{:else}
				<rect x="28" y="64" width="90" height="8" rx="4" class="bar faint" />
				<rect x="28" y="80" width="130" height="6" rx="3" class="bar faint" />
				<rect x="28" y="92" width="110" height="6" rx="3" class="bar faint" />
			{/if}
			<path d="M0 146H200L192 156H8Z" class="base" />

			<!-- server rack -->
			<rect x="358" y="18" width="94" height="138" rx="10" class="shell" />
			{#each [28, 70, 112] as y, n (y)}
				<rect x="366" {y} width="78" height="34" rx="5" class="unit" />
				<circle
					cx="378"
					cy={y + 17}
					r="3.6"
					class="led"
					class:blink={phase === 'think' && !reduce}
					style="animation-delay:{n * 0.15}s"
				/>
				<line x1="392" y1={y + 13} x2="432" y2={y + 13} class="vent" />
				<line x1="392" y1={y + 21} x2="424" y2={y + 21} class="vent" />
			{/each}

			<!-- the envelope (request out, response back) -->
			<g
				class="env"
				class:snap={phase === 'start' || phase === 'rest'}
				class:off={!envOn}
				class:res={isResponse}
				style="transform: translate({envX}px, 88px)"
			>
				<rect x="-40" y="-16" width="80" height="32" rx="6" class="env-body" />
				<path d="M-38 -14L0 -1L38 -14" class="env-flap" />
				<text y="11" text-anchor="middle" class="env-label">{label}</text>
				{#if secure}
					<g transform="translate(30 -24)" class="lock big">
						<rect x="0" y="4" width="10" height="8" rx="1.5" />
						<path d="M2 4V2.8a3 3 0 0 1 6 0V4" />
					</g>
				{/if}
			</g>

			<text x="100" y="176" text-anchor="middle" class="cap-svg">{tx.youLabel}</text>
			<text x="405" y="176" text-anchor="middle" class="cap-svg">{tx.serverLabel}</text>
		</svg>

		{#if legendOn}
			<ol class="legend">
				{#each tx.legend as l, n (n)}
					<li class="d{n + 2}" class:hit={legendHit === n}>{l}</li>
				{/each}
			</ol>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}

	.pages {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-brand);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover,
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}

	/* ---- svg parts ---- */
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.screen {
		fill: var(--color-paper);
	}
	.addr {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.url {
		font-size: 8.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.base {
		fill: var(--color-line);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-grass);
	}
	.led.blink {
		animation: blink 0.35s ease-in-out infinite alternate;
	}
	@keyframes blink {
		to {
			fill: var(--color-amber);
		}
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke 0.3s;
	}
	.wire.lit {
		stroke: var(--color-brand);
	}
	.wire-label {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.1em;
		fill: var(--color-brand);
	}
	.bar {
		fill: var(--color-line);
	}
	.bar.faint {
		opacity: 0.6;
	}
	.btn {
		fill: var(--color-brand);
	}
	.p-title {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.p-text {
		font-size: 7.6px;
		fill: var(--color-muted);
	}
	.p-code {
		font-size: 22px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.page.moved .p-title {
		fill: var(--color-amber);
	}
	.page.notfound .p-title,
	.page.broken .p-title {
		fill: var(--color-danger);
	}
	.loading circle {
		fill: var(--color-brand);
		animation: dot 1s ease-in-out infinite;
	}
	.loading circle:nth-child(2) {
		animation-delay: 0.15s;
	}
	.loading circle:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes dot {
		50% {
			opacity: 0.25;
		}
	}
	.cap-svg {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}

	.env {
		transition:
			transform 1.25s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.45s ease;
	}
	.env.snap {
		transition: none;
	}
	.env.off {
		opacity: 0;
	}
	.env-body {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.env-flap {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.2;
		opacity: 0.5;
	}
	.env-label {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.env.res .env-body,
	.env.res .env-flap {
		stroke: var(--color-grass);
	}
	.env.res .env-label {
		fill: var(--color-grass);
	}
	.lock rect {
		fill: var(--color-grass);
	}
	.lock path {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.2;
	}
	.lock.big path {
		stroke-width: 1.6;
	}

	/* ---- the rule of thumb row ---- */
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.legend li {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}
	.legend li.hit.d2 {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.legend li.hit.d3 {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		color: var(--color-ink);
	}
	.legend li.hit.d4,
	.legend li.hit.d5 {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	@media (prefers-reduced-motion: reduce) {
		.env,
		.wire,
		.chip,
		.legend li {
			transition: none;
		}
		.loading circle,
		.led.blink {
			animation: none;
		}
	}
</style>
