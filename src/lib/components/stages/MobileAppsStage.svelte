<script lang="ts">
	// A guided "watch" stage. The nimbus app is built three ways side by side, native, cross
	// platform, and web. Each lane has its code sheets on top and the devices that run them below.
	// When a lane is in focus its code writes itself line by line and the app pops onto its
	// devices. Native visibly writes everything twice. The only optional play, on the last beat,
	// adds a new feature so the learner sees native write it two times.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { MobileAppsText, MobileSheet, MobileWay } from '$lib/chapters/web/mobile-apps/types';
	import { sceneClock, wrap } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as MobileAppsText);

	type Scene = 'app' | 'native' | 'twice' | 'web' | 'cross' | 'pick' | 'remember' | 'try';
	const SCENES: Scene[] = ['app', 'native', 'twice', 'web', 'cross', 'pick', 'remember', 'try'];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];
	const WAYS: MobileWay[] = ['native', 'cross', 'web'];
	const CX: Record<MobileWay, number> = { native: 60, cross: 180, web: 300 };
	// the scene that introduces each way, before it the lane stays faint
	const INTRO: Record<MobileWay, number> = { native: 1, web: 3, cross: 4 };
	const FOCUS: Partial<Record<Scene, MobileWay>> = {
		native: 'native',
		twice: 'native',
		web: 'web',
		cross: 'cross'
	};
	// line lengths of the pretend code, out of a sheet's width
	const LINES = [0.8, 0.55, 0.7, 0.4, 0.65];
	const EXTRA = [0.6, 0.75];
	const STEP = 260;

	let peek = $state<number | null>(null);
	let features = $state(0);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, features]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const clamp = (x: number) => Math.max(0, Math.min(1, x));

	/** When each sheet starts writing on its own scene, native writes Swift after Kotlin. */
	const START: Record<MobileSheet, number> = { kotlin: 400, swift: 2500, dart: 400, html: 400 };
	const WRITES: Record<MobileSheet, Scene> = {
		kotlin: 'native',
		swift: 'native',
		dart: 'cross',
		html: 'web'
	};
	/** How many of the five base lines are written. */
	function lines(s: MobileSheet): number {
		if (scene !== WRITES[s]) return 5;
		return Math.max(0, Math.min(5, Math.floor((t - START[s]) / STEP) + 1));
	}
	/** Features land in the same order, Kotlin then Swift, the others at once. */
	const FEAT_START: Record<MobileSheet, number> = {
		kotlin: 300,
		swift: 1300,
		dart: 300,
		html: 300
	};
	function extra(s: MobileSheet, j: number): number {
		if (scene !== 'try' || j >= features) return 0;
		if (j < features - 1) return 1;
		return clamp((t - FEAT_START[s]) / 800);
	}
	const sheetDone = (s: MobileSheet) => lines(s) >= 5;
	const built = (s: MobileSheet) =>
		scene !== WRITES[s] || t > START[s] + 5 * STEP + 400 || clock.reduced;
	const badge = (s: MobileSheet) => scene === 'try' && features > 0 && extra(s, features - 1) >= 1;

	const lit = (w: MobileWay) => {
		if (active < INTRO[w] && scene !== 'app') return false;
		const f = FOCUS[scene];
		return !f || f === w;
	};
	const sheetsFaint = $derived(scene === 'app');
	// counts appear once a way has been shown, the choosing scene swaps them for examples
	const caption = (w: MobileWay) =>
		scene === 'pick' ? tx.examples[w] : active >= Math.max(2, INTRO[w]) ? tx.counts[w] : '';

	function addFeature() {
		if (features >= 2) return;
		features += 1;
		onstate?.('feature');
	}
</script>

{#snippet sheet(s: MobileSheet, x: number, w: number)}
	<g class="sheet" class:faint={sheetsFaint} class:writing={!sheetDone(s)}>
		<rect {x} y="32" width={w} height="86" rx="7" class="paper" />
		<text x={x + 7} y="45" class="lang">{tx.sheets[s]}</text>
		{#each LINES as len, i (i)}
			{#if i < lines(s)}
				<rect x={x + 7} y={52 + i * 9} width={(w - 14) * len} height="4" rx="2" class="ln" />
			{/if}
		{/each}
		{#each EXTRA as len, j (j)}
			{#if extra(s, j) > 0}
				<rect
					x={x + 7}
					y={97 + j * 9}
					width={(w - 14) * len * extra(s, j)}
					height="4"
					rx="2"
					class="ln new"
				/>
			{/if}
		{/each}
	</g>
{/snippet}

{#snippet phone(cx: number, kind: 'android' | 'iphone' | 'browser', on: boolean, dot: boolean)}
	<g>
		<rect x={cx - 19} y="158" width="38" height="74" rx={kind === 'iphone' ? 10 : 6} class="body" />
		<rect x={cx - 16} y="163" width="32" height="64" rx={kind === 'iphone' ? 7 : 3} class="glass" />
		{#if kind === 'iphone'}
			<rect x={cx - 6} y="166" width="12" height="3.5" rx="1.75" class="notch" />
		{:else if kind === 'android'}
			<circle {cx} cy="167.5" r="1.8" class="notch" />
		{/if}
		{#if on}
			{#if kind === 'browser'}
				<rect x={cx - 13} y="172" width="26" height="6" rx="3" class="bar" />
				<rect x={cx - 11} y="185" width="22" height="5" rx="2" class="page" />
				<rect x={cx - 11} y="194" width="16" height="3" rx="1.5" class="ln" />
				<rect x={cx - 11} y="200" width="19" height="3" rx="1.5" class="ln" />
			{:else}
				<g class="icon" style="transform-origin:{cx}px 193px">
					<rect x={cx - 9} y="184" width="18" height="18" rx="5" class="appicon" />
					<circle cx={cx - 3} cy="195" r="3" class="puff" />
					<circle cx={cx + 1} cy="192" r="4" class="puff" />
					<circle cx={cx + 4.5} cy="195.5" r="2.6" class="puff" />
				</g>
			{/if}
		{/if}
		{#if dot}
			<circle cx={cx + 17} cy="160" r="4.5" class="badge" />
		{/if}
	</g>
{/snippet}

{#snippet laptop(cx: number, on: boolean, dot: boolean)}
	<g>
		<rect x={cx - 24} y="176" width="48" height="34" rx="4" class="body" />
		<rect x={cx - 21} y="179" width="42" height="28" rx="2" class="glass" />
		<path d="M{cx - 30} 210 H{cx + 30} L{cx + 27} 216 H{cx - 27} Z" class="body" />
		{#if on}
			<rect x={cx - 18} y="182" width="36" height="4" rx="2" class="bar" />
			<rect x={cx - 15} y="190" width="22" height="4" rx="2" class="page" />
			<rect x={cx - 15} y="198" width="28" height="3" rx="1.5" class="ln" />
		{/if}
		{#if dot}
			<circle cx={cx + 24} cy="176" r="4.5" class="badge" />
		{/if}
	</g>
{/snippet}

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={addFeature} disabled={features >= 2}>
				{features >= 2 ? tx.featureDone : tx.featureBtn}
			</button>
		{/if}
		<svg viewBox="0 0 360 312" class="pic" role="img" aria-label={tx.picture}>
			{#each WAYS as w (w)}
				{@const cx = CX[w]}
				<g class="lane" class:dim={!lit(w)}>
					<text x={cx} y="18" text-anchor="middle" class="way">{tx.ways[w]}</text>

					{#if w === 'native'}
						{@render sheet('kotlin', cx - 55, 52)}
						{@render sheet('swift', cx + 3, 52)}
						<path d="M{cx - 29} 124 V150" class="arrow" class:on={built('kotlin')} />
						<path d="M{cx + 29} 124 V150" class="arrow" class:on={built('swift')} />
						{@render phone(cx - 29, 'android', built('kotlin'), badge('kotlin'))}
						{@render phone(cx + 29, 'iphone', built('swift'), badge('swift'))}
						<text x={cx - 29} y="248" text-anchor="middle" class="dev">{tx.devices.android}</text>
						<text x={cx + 29} y="248" text-anchor="middle" class="dev">{tx.devices.iphone}</text>
					{:else if w === 'cross'}
						{@render sheet('dart', cx - 30, 60)}
						<path
							d="M{cx} 120 V132 M{cx} 132 L{cx - 27} 150 M{cx} 132 L{cx + 27} 150"
							class="arrow"
							class:on={built('dart')}
						/>
						{@render phone(cx - 27, 'android', built('dart'), badge('dart'))}
						{@render phone(cx + 27, 'iphone', built('dart'), badge('dart'))}
						<text x={cx - 27} y="248" text-anchor="middle" class="dev">{tx.devices.android}</text>
						<text x={cx + 27} y="248" text-anchor="middle" class="dev">{tx.devices.iphone}</text>
					{:else}
						{@render sheet('html', cx - 30, 60)}
						<path
							d="M{cx} 120 V132 M{cx} 132 L{cx - 30} 150 M{cx} 132 L{cx + 24} 168"
							class="arrow"
							class:on={built('html')}
						/>
						{@render phone(cx - 30, 'browser', built('html'), badge('html'))}
						{@render laptop(cx + 25, built('html'), badge('html'))}
						<text x={cx - 30} y="248" text-anchor="middle" class="dev">{tx.devices.phone}</text>
						<text x={cx + 25} y="232" text-anchor="middle" class="dev">{tx.devices.laptop}</text>
					{/if}

					{#each wrap(caption(w), 17) as line, k (k)}
						<text
							x={cx}
							y={274 + k * 14}
							text-anchor="middle"
							class="count"
							class:pick={scene === 'pick'}>{line}</text
						>
					{/each}
				</g>
			{/each}
			<line x1="120" y1="28" x2="120" y2="296" class="divider" />
			<line x1="240" y1="28" x2="240" y2="296" class="divider" />
		</svg>
		{#if scene === 'remember'}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} {active} onselect={(i) => (peek = i)} visual={picture} />
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 460px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.pic {
		display: block;
		width: 100%;
		height: auto;
		max-height: 60vh;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.act:disabled {
		opacity: 0.6;
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.lane {
		transition: opacity 0.4s;
	}
	.lane.dim {
		opacity: 0.3;
	}
	.divider {
		stroke: var(--color-line);
		stroke-width: 1;
	}
	.way {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 800;
	}
	.sheet {
		transition: opacity 0.4s;
	}
	.sheet.faint {
		opacity: 0.35;
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.sheet.writing .paper {
		stroke: var(--color-brand);
	}
	.lang {
		fill: var(--color-brand);
		font-size: 8.5px;
		font-weight: 800;
	}
	.ln {
		fill: var(--color-faint);
		opacity: 0.6;
	}
	.ln.new {
		fill: var(--color-grass);
		opacity: 1;
	}
	.arrow {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: stroke 0.4s;
	}
	.arrow.on {
		stroke: var(--color-faint);
	}
	.body {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.5;
	}
	.glass {
		fill: var(--color-paper);
	}
	.notch {
		fill: var(--color-ink);
	}
	.bar {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.page {
		fill: var(--color-brand);
		opacity: 0.8;
	}
	.appicon {
		fill: var(--color-brand);
	}
	.puff {
		fill: var(--color-card);
	}
	.icon {
		animation: pop 0.45s cubic-bezier(0.3, 1.4, 0.5, 1) both;
	}
	@keyframes pop {
		from {
			transform: scale(0.2);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.badge {
		fill: var(--color-grass);
		stroke: var(--color-card);
		stroke-width: 1.5;
	}
	.dev {
		fill: var(--color-muted);
		font-size: 9px;
		font-weight: 600;
	}
	.count {
		fill: var(--color-ink);
		font-size: 10.5px;
		font-weight: 700;
	}
	.count.pick {
		fill: var(--color-brand);
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lane,
		.sheet,
		.paper,
		.arrow {
			transition: none;
		}
		.icon {
			animation: none;
		}
	}
</style>
