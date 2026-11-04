<script lang="ts">
	// Guided "watch" stage. A server rack on the left, your phone on the right, a wire between.
	// Following Nim's beats the same nimbus.com page arrives three ways by itself. CSR sends an
	// empty page and a box of JavaScript that the phone unpacks, SSR builds the page at the server
	// and hydrates the buttons, SSG grabs a finished page off a shelf. The mix and remember parts
	// let the three take turns. The only optional play is picking a way on the last beat.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RenderingText, RenderMode } from '$lib/chapters/web/rendering/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RenderingText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const lastBeat = $derived(tx.intro.length - 1);
	const isPlay = $derived(beat >= lastBeat);

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(isPlay && peek === null);

	const MODES: RenderMode[] = ['csr', 'ssr', 'ssg'];
	let userMode = $state<RenderMode>('ssr');
	let replay = $state(0);
	function pick(m: RenderMode) {
		userMode = m;
		replay += 1;
		onstate?.(m);
	}

	// One clock, restarted on every step and on every pick.
	let t = $state(0);
	let reduced = $state(false);
	const clockKey = $derived(`${step}|${live}|${replay}`);
	$effect(() => {
		void clockKey;
		reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		t = 0;
		if (reduced) return;
		const start = Date.now();
		const id = setInterval(() => (t = Date.now() - start), 60);
		return () => clearInterval(id);
	});

	type StatusKey = keyof RenderingText['status'];
	type Scene = {
		req: number | null;
		resp: { kind: 'box' | 'page'; p: number } | null;
		serverBlocks: number;
		blocks: number;
		hydrated: boolean;
		status: StatusKey;
		readyAt: number;
		end: number;
	};
	const REQ = 700;
	const END: Record<RenderMode, number> = { csr: 3400, ssr: 2900, ssg: 1200 };
	const READY: Record<RenderMode, number> = { csr: 3400, ssr: 2300, ssg: 1200 };
	const REST = 2600;

	function sceneAt(m: RenderMode, tt: number): Scene {
		const base: Scene = {
			req: null,
			resp: null,
			serverBlocks: 0,
			blocks: 0,
			hydrated: false,
			status: 'ask',
			readyAt: READY[m],
			end: END[m]
		};
		if (tt < REQ) return { ...base, req: tt / REQ };
		if (m === 'csr') {
			if (tt < 1900)
				return { ...base, resp: { kind: 'box', p: (tt - REQ) / 1200 }, status: 'emptyHtml' };
			const b = Math.min(5, Math.floor((tt - 1900) / 300) + 1);
			return { ...base, blocks: b, hydrated: true, status: tt >= 3400 ? 'ready' : 'jsBuilds' };
		}
		if (m === 'ssr') {
			if (tt < 1700)
				return {
					...base,
					serverBlocks: Math.min(5, Math.floor((tt - REQ) / 200) + 1),
					status: 'serverBuilds'
				};
			if (tt < 2300)
				return { ...base, resp: { kind: 'page', p: (tt - 1700) / 600 }, status: 'fullHtml' };
			if (tt < 2900) return { ...base, blocks: 5, status: 'hydrate' };
			return { ...base, blocks: 5, hydrated: true, status: 'ready' };
		}
		if (tt < 1200)
			return { ...base, resp: { kind: 'page', p: (tt - REQ) / 500 }, status: 'prebuilt' };
		return { ...base, blocks: 5, hydrated: true, status: 'ready' };
	}

	// Which way is playing, and where in its loop we are.
	const playing = $derived.by((): { mode: RenderMode; tt: number } | null => {
		if (step < 2) return null;
		if (live) return { mode: userMode, tt: reduced ? 1e9 : Math.min(t, END[userMode] + 1) };
		if (step <= 4) {
			const m = MODES[step - 2];
			return { mode: m, tt: reduced ? 1e9 : t % (END[m] + REST) };
		}
		// Mix and remember, the three ways take turns.
		if (reduced) return { mode: 'ssg', tt: 1e9 };
		const total = MODES.reduce((a, m) => a + END[m] + REST, 0);
		let r = t % total;
		for (const m of MODES) {
			if (r < END[m] + REST) return { mode: m, tt: r };
			r -= END[m] + REST;
		}
		return { mode: 'ssg', tt: 1e9 };
	});
	const scene = $derived(playing ? sceneAt(playing.mode, playing.tt) : null);

	// The opening part, the page assembles itself inside the phone.
	const introBlocks = $derived(reduced ? 5 : Math.min(5, Math.floor((t % 4000) / 450)));
	const phoneBlocks = $derived(step === 0 ? introBlocks : step === 1 ? 5 : (scene?.blocks ?? 0));
	const phoneHydrated = $derived(step < 2 ? true : (scene?.hydrated ?? false));
	const status = $derived(step === 0 ? 'build' : step === 1 ? 'where' : (scene?.status ?? 'ask'));
	const readyShown = $derived(!!scene && !!playing && playing.tt >= scene.readyAt);
	const secs = $derived(playing ? (READY[playing.mode] / 1000).toFixed(1) : '');
</script>

{#snippet page(x: number, y: number, w: number, h: number, blocks: number, hydrated: boolean)}
	{#if blocks >= 1}<rect
			x={x + 4}
			y={y + 4}
			width={w - 8}
			height={h * 0.1}
			rx="2"
			class="b1"
		/>{/if}
	{#if blocks >= 2}
		<rect x={x + 4} y={y + h * 0.18} width={w - 8} height={h * 0.3} rx="3" class="b2" />
		<path
			d="M{x + 8} {y + h * 0.46}l{w * 0.2} {-h * 0.14} {w * 0.15} {h * 0.08} {w * 0.18} {-h *
				0.12} {w * 0.3} {h * 0.18}Z"
			class="hill"
		/>
	{/if}
	{#if blocks >= 3}<rect
			x={x + 4}
			y={y + h * 0.54}
			width={w * 0.8}
			height={h * 0.05}
			rx="1.5"
			class="b3"
		/>{/if}
	{#if blocks >= 4}<rect
			x={x + 4}
			y={y + h * 0.63}
			width={w * 0.6}
			height={h * 0.05}
			rx="1.5"
			class="b3"
		/>{/if}
	{#if blocks >= 5}
		<rect
			x={x + 4}
			y={y + h * 0.76}
			width={w * 0.6}
			height={h * 0.12}
			rx={h * 0.06}
			class="b5"
			class:on={hydrated}
		/>
	{/if}
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 400 340"
			class="mx-auto block w-full max-w-[440px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- the way that is playing, with how long it took right under it -->
			{#if playing}
				<text x="200" y="28" text-anchor="middle" class="mode">{tx.modes[playing.mode]}</text>
			{/if}
			{#if readyShown}
				<text x="200" y="50" text-anchor="middle" class="ready" in:fade={{ duration: 200 }}>
					{tx.readyAfter.replace('{s}', secs)}
				</text>
			{/if}

			<!-- the server -->
			<g class:dim={step === 0}>
				<text x="70" y="76" text-anchor="middle" class="lbl">{tx.serverLabel}</text>
				{#each [0, 1, 2] as u (u)}
					<rect x="30" y={88 + u * 52} width="80" height="44" rx="6" class="unit" />
					<circle
						cx="44"
						cy={110 + u * 52}
						r="3.5"
						class="led"
						class:busy={scene?.status === 'serverBuilds'}
					/>
					<rect x="56" y={104 + u * 52} width="44" height="4" rx="2" class="slit" />
					<rect x="56" y={112 + u * 52} width="30" height="4" rx="2" class="slit" />
				{/each}
				{#if playing?.mode === 'ssg'}
					<g in:fade={{ duration: 250 }}>
						{#each [0, 1, 2] as s (s)}
							<rect x={36 + s * 8} y={258 - s * 4} width="40" height="50" rx="4" class="sheet" />
						{/each}
						<g>{@render page(52, 250, 40, 50, 5, true)}</g>
						<text x="70" y="328" text-anchor="middle" class="lbl">{tx.shelfLabel}</text>
					</g>
				{/if}
				{#if scene && scene.serverBlocks > 0}
					<rect x="122" y="112" width="44" height="100" rx="5" class="sheet" />
					{@render page(122, 112, 44, 100, scene.serverBlocks, false)}
				{/if}
			</g>

			<!-- the wire -->
			<line x1="112" y1="162" x2="262" y2="162" class="wire" />

			{#if step === 1}
				<g class="huh">
					<circle cx="116" cy="80" r="13" style="fill:var(--color-amber)" />
					<text x="116" y="86" text-anchor="middle" class="q">?</text>
				</g>
				<g class="huh">
					<circle cx="378" cy="80" r="13" style="fill:var(--color-amber)" />
					<text x="378" y="86" text-anchor="middle" class="q">?</text>
				</g>
			{/if}

			<!-- what travels -->
			{#if scene?.req != null}
				<circle cx={262 - scene.req * 148} cy="162" r="6" class="ping" />
			{/if}
			{#if scene?.resp}
				{@const px = 124 + scene.resp.p * 116}
				<rect x={px} y="112" width="44" height="100" rx="5" class="sheet" />
				{#if scene.resp.kind === 'page'}
					{@render page(px, 112, 44, 100, 5, false)}
				{:else}
					<rect x={px + 10} y="172" width="44" height="34" rx="5" class="box" />
					<text x={px + 32} y="194" text-anchor="middle" class="js">JS</text>
				{/if}
			{/if}

			<!-- the phone, about one wide to two tall like a real one -->
			<text x="322" y="76" text-anchor="middle" class="lbl">{tx.youLabel}</text>
			<rect x="264" y="86" width="116" height="238" rx="20" class="phone" />
			<rect x="272" y="104" width="100" height="202" rx="7" class="screen" />
			{@render page(272, 108, 100, 194, phoneBlocks, phoneHydrated)}
			{#if scene?.status === 'jsBuilds' && phoneBlocks < 5}
				<path d="M314 280a8 8 0 0 1 8 -8" class="spin" />
			{/if}
		</svg>
		<p class="status" aria-live="polite">{tx.status[status]}</p>
		{#if live}
			<div class="mt-3 flex justify-center gap-2">
				{#each MODES as m (m)}
					<button type="button" class="play" class:on={userMode === m} onclick={() => pick(m)}>
						{tx.modes[m]}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.lbl {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.mode {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.dim {
		opacity: 0.35;
	}
	.unit {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.led {
		fill: var(--color-grass);
	}
	.led.busy {
		fill: var(--color-amber);
		animation: blink 0.5s steps(2) infinite;
	}
	.slit {
		fill: var(--color-line);
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 3;
	}
	.ping {
		fill: var(--color-brand);
	}
	.sheet {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.box {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.js {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-amber);
	}
	.phone {
		fill: var(--color-ink);
	}
	.screen {
		fill: var(--color-card);
	}
	.b1 {
		fill: var(--color-brand-soft);
	}
	.b2 {
		fill: var(--color-paper);
	}
	.hill {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1;
	}
	.b3 {
		fill: var(--color-line);
	}
	.b5 {
		fill: var(--color-line);
		transition: fill 0.3s;
	}
	.b5.on {
		fill: var(--color-brand);
	}
	.spin {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
		animation: spin 0.9s linear infinite;
		transform-origin: 322px 280px;
	}
	.ready {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.q {
		font-size: 16px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.huh {
		animation: pulse 2.4s ease-in-out infinite;
	}
	.status {
		margin: 6px 0 0;
		min-height: 2.8em;
		text-align: center;
		font-size: 13px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	.play {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.play.on {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	@keyframes blink {
		to {
			opacity: 0.3;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.55;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.led.busy,
		.spin,
		.huh {
			animation: none;
		}
		.b5 {
			transition: none;
		}
	}
</style>
