<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import ActSteps from './shipit/ActSteps.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type {
		MobileAppsText,
		MobileClient,
		MobileWay
	} from '$lib/chapters/web/mobile-apps/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as MobileAppsText);

	const ways: MobileWay[] = ['native', 'cross', 'web'];
	let act = $state(0);
	const actDone = $state([false, false]);

	// Act 0, build the app one way at a time.
	let way = $state<MobileWay | null>(null);
	const seen = new SvelteSet<MobileWay>();
	function build(w: MobileWay) {
		way = w;
		seen.add(w);
		onstate?.(w);
		if (seen.size === ways.length) actDone[0] = true;
	}

	// How each way scores, out of five. Work is how much effort it takes, so less is lighter.
	const scores: Record<MobileWay, { speed: number; reach: number; effort: number }> = {
		native: { speed: 5, reach: 3, effort: 5 },
		cross: { speed: 4, reach: 3, effort: 3 },
		web: { speed: 3, reach: 5, effort: 1 }
	};
	// The code chips over the three devices (Android, iPhone, browser). `span` is how many columns.
	const chips: Record<MobileWay, { label: string; span: number; start: number }[]> = {
		native: [
			{ label: 'Kotlin', span: 1, start: 1 },
			{ label: 'Swift', span: 1, start: 2 }
		],
		cross: [{ label: 'Flutter / React Native', span: 2, start: 1 }],
		web: [{ label: 'HTML, CSS, JS', span: 3, start: 1 }]
	};
	const covers = (w: MobileWay, device: number) => (w === 'web' ? true : device < 2);

	// Act 1, match each client with the way that fits.
	const clients: MobileClient[] = ['game', 'startup', 'menu'];
	const fits: Record<MobileClient, MobileWay> = { game: 'native', startup: 'cross', menu: 'web' };
	let ci = $state(0);
	let picked = $state<MobileWay | null>(null);
	const wrong = new SvelteSet<MobileWay>();
	const client = $derived(clients[ci]);
	const solved = $derived(picked === fits[client]);
	let completed = false;

	function choose(w: MobileWay) {
		if (solved) return;
		picked = w;
		if (w === fits[client]) {
			onstate?.(client);
			if (ci === clients.length - 1) {
				actDone[1] = true;
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			}
		} else {
			wrong.add(w);
			onstate?.('miss');
		}
	}
	function nextClient() {
		ci += 1;
		picked = null;
		wrong.clear();
	}
</script>

{#snippet bar(label: string, value: number, tone: string)}
	<div class="brow">
		<span class="blabel">{label}</span>
		<span class="segs">
			{#each [1, 2, 3, 4, 5] as s (s)}
				<i style:background={s <= value ? tone : undefined}></i>
			{/each}
		</span>
	</div>
{/snippet}

<div class="wrap">
	<ActSteps
		names={tx.acts}
		current={act}
		done={actDone}
		label={tx.actLabel.replace('{n}', String(act + 1))}
	/>

	{#if act === 0}
		<p class="prompt">{tx.buildPrompt}</p>
		<div class="ways" role="group">
			{#each ways as w (w)}
				<button
					type="button"
					class="way"
					class:on={way === w}
					class:seen={seen.has(w) && way !== w}
					aria-pressed={way === w}
					onclick={() => build(w)}
				>
					<b>{tx.ways[w].name}</b>
					<small>{tx.ways[w].sub}</small>
				</button>
			{/each}
		</div>
		{#if actDone[0]}
			<CallToActionButton onclick={() => (act = 1)}>
				{tx.nextAct}
			</CallToActionButton>
		{/if}

		<!-- the code on top, the devices it lands on underneath -->
		<div class="build">
			<div class="chips grid">
				{#if way}
					{#key way}
						{#each chips[way] as c (c.label)}
							<span class="chip pop" style="grid-column:{c.start} / span {c.span}">{c.label}</span>
						{/each}
					{/key}
				{/if}
			</div>
			<div class="devices grid">
				{#each [tx.android, tx.iphone, tx.browser] as name, d (d)}
					<div class="dev" class:off={way !== null && !covers(way, d)}>
						<div class="screen {d === 2 ? 'wide' : 'tall'}" class:ios={d === 1}>
							{#if way && covers(way, d)}
								{#key way}
									<div class="app pop">
										{#if way === 'web'}
											<span class="url">nimbus.com</span>
										{/if}
										<svg width="22" height="16" viewBox="0 0 120 80" aria-hidden="true">
											<path
												d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z"
												fill="var(--color-brand)"
											/>
										</svg>
										<span class="ln"></span>
										<span class="ln short"></span>
									</div>
								{/key}
							{:else if way}
								<span class="x">×</span>
							{/if}
						</div>
						<span class="dname">{name}</span>
					</div>
				{/each}
			</div>
			{#if way}
				<p class="count">
					{way === 'native' ? tx.codeLabel.replace('{n}', '2') : tx.codeLabelOne}
				</p>
				<div class="bars">
					{@render bar(tx.speedLabel, scores[way].speed, 'var(--color-brand)')}
					{@render bar(tx.reachLabel, scores[way].reach, 'var(--color-grass)')}
					{@render bar(tx.effortLabel, scores[way].effort, 'var(--color-amber)')}
				</div>
				<p class="wnote">{tx.ways[way].note}</p>
			{/if}
		</div>
	{:else}
		<div class="client">
			<p class="meta">
				<span>{tx.clientPrompt}</span>
				<span>
					{tx.progress.replace('{n}', String(ci + 1)).replace('{total}', String(clients.length))}
				</span>
			</p>
			{#key client}
				<p class="who pop">{tx.clients[client].who}</p>
				<p class="need pop">{tx.clients[client].need}</p>
			{/key}
		</div>
		<div class="ways" role="group">
			{#each ways as w (w)}
				<button
					type="button"
					class="way"
					class:right={solved && picked === w}
					class:wrongpick={wrong.has(w)}
					disabled={solved || wrong.has(w)}
					onclick={() => choose(w)}
				>
					<b>{tx.ways[w].name}</b>
					<small>
						{solved && picked === w ? tx.rightTag : wrong.has(w) ? tx.wrongTag : tx.ways[w].sub}
					</small>
				</button>
			{/each}
		</div>
		{#if solved && !actDone[1]}
			<CallToActionButton onclick={nextClient}>
				{tx.nextClient}
			</CallToActionButton>
		{:else if actDone[1]}
			<p class="done pop">{tx.doneLine}</p>
		{/if}
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.prompt {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.ways {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.way {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 4px;
		line-height: 1.25;
		text-align: center;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.way:enabled:hover {
		border-color: var(--color-faint);
	}
	.way.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.way.seen b::after {
		content: ' ✓';
		color: var(--color-grass);
	}
	.way.right {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.way.wrongpick {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		opacity: 0.75;
	}
	.way b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.way small {
		font-size: 10px;
		color: var(--color-muted);
	}

	.build {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 12px 10px;
	}
	.grid {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr 1.25fr;
		gap: 8px;
	}
	.chips {
		min-height: 24px;
	}
	.chip {
		display: grid;
		place-items: center;
		border-radius: 8px;
		background: var(--color-ink);
		padding: 4px 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-paper);
		white-space: nowrap;
	}
	.dev {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 4px;
		transition: opacity 0.3s;
	}
	.dev.off {
		opacity: 0.4;
	}
	.screen {
		position: relative;
		display: grid;
		place-items: center;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
	}
	.screen.tall {
		width: 54px;
		height: 96px;
		border-radius: 13px;
	}
	/* a little camera dot on Android, a pill notch on iPhone */
	.screen.tall::before {
		content: '';
		position: absolute;
		top: 5px;
		left: 50%;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-line);
		transform: translateX(-50%);
	}
	.screen.tall.ios::before {
		width: 16px;
		border-radius: 3px;
	}
	.screen.wide {
		width: 100%;
		max-width: 92px;
		height: 62px;
		border-radius: 8px;
	}
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.url {
		border-radius: 4px;
		background: var(--color-paper);
		padding: 0 4px;
		font-size: 7px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.ln {
		width: 30px;
		height: 4px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.ln.short {
		width: 20px;
	}
	.x {
		font-size: 18px;
		color: var(--color-faint);
	}
	.dname {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.count {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.bars {
		display: flex;
		width: 100%;
		max-width: 260px;
		flex-direction: column;
		gap: 5px;
	}
	.brow {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.blabel {
		width: 76px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.segs {
		display: flex;
		flex: 1;
		gap: 3px;
	}
	.segs i {
		flex: 1;
		height: 8px;
		border-radius: 3px;
		background: var(--color-line);
		transition: background 0.3s;
	}
	.wnote {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.client {
		width: 100%;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.meta {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.who {
		margin-top: 6px;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.need {
		margin-top: 2px;
		font-size: 13px;
		line-height: 1.45;
		color: var(--color-muted);
	}
	.done {
		max-width: 340px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.pop {
		animation: pop 0.35s ease;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
		}
		.screen.tall {
			width: 64px;
			height: 114px;
		}
		.screen.wide {
			max-width: 120px;
			height: 76px;
		}
		.way b {
			font-size: 14px;
		}
		.way small {
			font-size: 11px;
		}
	}
</style>
