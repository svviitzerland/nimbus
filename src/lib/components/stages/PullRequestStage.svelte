<script lang="ts">
	// Guided "watch" stage for pull requests and code review. One pull request card, shaped like
	// the page GitHub shows, follows Nim's beats. It opens, shows the diff, collects Adi's comment
	// and Citra's fix, runs its checks, gets approved, and merges. A row of five milestones along
	// the bottom fills in as the story goes. Nothing to do, every scene plays by itself.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { PullRequestText } from '$lib/chapters/compute/pull-request/types';

	let { text, beat = 0, oncomplete, onshow }: StageProps = $props();
	const tx = $derived(text as PullRequestText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const scene = $derived(peek ?? Math.min(beat, tx.steps.length - 1));

	// one clock per scene, only the checks scene uses it
	let t = $state(0);
	$effect(() => {
		void scene;
		t = 0;
		if (
			typeof matchMedia !== 'undefined' &&
			matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			t = 1e9;
			return;
		}
		const start = Date.now();
		const id = setInterval(() => {
			t = Date.now() - start;
			if (t > 3000) clearInterval(id);
		}, 100);
		return () => clearInterval(id);
	});
	const checkDone = (i: number) => scene > 5 || (scene === 5 && t >= 1100 + i * 800);

	// how far along the five milestones are
	const PROGRESS = [-1, 0, 0, 1, 1, 2, 3, 4, 4, 4];
	const progress = $derived(PROGRESS[scene] ?? 4);
	const merged = $derived(scene >= 7);
	const fixed = $derived(scene >= 4);
</script>

{#snippet avatar(letter: string, tone: string)}
	<span class="av {tone}">{letter}</span>
{/snippet}

{#snippet diff(compact: boolean)}
	<div class="diff">
		<div class="dhead">index.html</div>
		<span class="dl ctx"><i> </i>&lt;h1&gt;{tx.pageTitle}&lt;/h1&gt;</span>
		{#if !compact}
			<span class="dl ctx"><i> </i>&lt;button&gt;{tx.oldBtn}&lt;/button&gt;</span>
		{/if}
		{#if fixed}
			<span class="dl del"><i>&minus;</i>&lt;button&gt;{tx.newBtn}&lt;/button&gt;</span>
			<span class="dl add"><i>+</i>&lt;button class="big"&gt;{tx.newBtn}&lt;/button&gt;</span>
		{:else}
			<span class="dl add"><i>+</i>&lt;button&gt;{tx.newBtn}&lt;/button&gt;</span>
		{/if}
	</div>
{/snippet}

{#snippet visual()}
	<div class="card">
		{#if scene === 0}
			<div class="pre" in:fade={{ duration: 260 }}>
				<svg viewBox="0 0 260 110" class="mini" aria-hidden="true">
					<line x1="10" y1="40" x2="250" y2="40" class="lmain" />
					<text x="10" y="26" class="bn main">main</text>
					<circle cx="40" cy="40" r="7" class="cd main" />
					<circle cx="80" cy="40" r="7" class="cd main" />
					<path d="M80 40 C100 40 100 86 120 86 L200 86" class="lbr" />
					<circle cx="150" cy="86" r="7" class="cd br" />
					<text x="214" y="90" class="bn br">citra</text>
				</svg>
				<span class="waiting">{tx.notMerged}</span>
			</div>
		{:else}
			<!-- header, like the top of a pull request page -->
			<div class="head">
				<div class="trow">
					<span class="title">{tx.prTitle}</span>
					<span class="num">#12</span>
				</div>
				<div class="brow">
					{#key merged}
						<span class="badge" class:merged in:fade={{ duration: 220 }}>
							{merged ? tx.mergedBadge : tx.openBadge}
						</span>
					{/key}
					<span class="bchip">citra</span>
					<svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
						<path d="M1 5h12M9 1l4 4-4 4" class="arrow" />
					</svg>
					<span class="bchip">main</span>
				</div>
			</div>

			<!-- body, one view per scene -->
			<div class="body">
				{#key scene}
					<div class="view" in:fade={{ duration: 260 }}>
						{#if scene === 1}
							<div class="row">
								{@render avatar('C', 'citra')}
								<span class="rtext">{tx.opened}</span>
							</div>
							<div class="desc">
								<span class="bar w90"></span>
								<span class="bar w70"></span>
								<span class="bar w50"></span>
							</div>
						{:else if scene === 2}
							{@render diff(false)}
						{:else if scene === 3}
							{@render diff(true)}
							<div class="comment">
								{@render avatar('A', 'adi')}
								<div class="ctext"><b>{tx.reviewer}</b> {tx.comment}</div>
							</div>
						{:else if scene === 4}
							<div class="row">
								{@render avatar('C', 'citra')}
								<span class="rtext commit">{tx.fixCommit}</span>
							</div>
							{@render diff(true)}
						{:else if scene === 5}
							<span class="sect">{tx.checksLabel}</span>
							{#each tx.checkNames as name, i (name)}
								<div class="check" class:ok={checkDone(i)}>
									<span class="cicon">
										{#if checkDone(i)}
											<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
												<path d="M2 5.2 4.2 7.4 8 2.8" class="tick" />
											</svg>
										{:else}
											<span class="spin"></span>
										{/if}
									</span>
									<span class="cname">{name}</span>
									<span class="cstate">{checkDone(i) ? tx.passed : tx.running}</span>
								</div>
							{/each}
						{:else if scene === 6}
							<div class="check ok">
								<span class="cicon">
									<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
										<path d="M2 5.2 4.2 7.4 8 2.8" class="tick" />
									</svg>
								</span>
								<span class="cname">{tx.checksLabel}</span>
								<span class="cstate">{tx.passed}</span>
							</div>
							<div class="approve">
								{@render avatar('A', 'adi')}
								<span>{tx.approved}</span>
							</div>
							<span class="mergebtn">{tx.mergeBtn}</span>
						{:else if scene === 7}
							<div class="done">
								<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
									<circle cx="6" cy="5" r="2.4" class="gi" />
									<circle cx="6" cy="19" r="2.4" class="gi" />
									<circle cx="18" cy="12" r="2.4" class="gi" />
									<path d="M6 7.4v9.2M6 9c0 3 3 3 9.6 3" class="gl" />
								</svg>
								<span>{tx.mergedText}</span>
							</div>
							<div class="live">
								<span class="led"></span>
								<span>{tx.liveText}</span>
							</div>
						{:else}
							<div class="summary">
								{#each tx.timeline as label, i (label)}
									<span class="schip" style="animation-delay:{i * 0.12}s">{label}</span>
								{/each}
							</div>
							{#if scene === 9}
								<div class="lock">
									<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
										<rect x="5" y="11" width="14" height="10" rx="2" class="li" />
										<path d="M8 11V8a4 4 0 0 1 8 0v3" class="lo" />
									</svg>
									<span>{tx.lockNote}</span>
								</div>
							{/if}
						{/if}
					</div>
				{/key}
			</div>
		{/if}

		<!-- the five milestones -->
		<div class="tline">
			{#each tx.timeline as label, i (label)}
				<div class="ms" class:on={i <= progress} class:now={i === progress && scene < 8}>
					<span class="mdot"></span>
					<span class="mlabel">{label}</span>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={scene} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.card {
		display: flex;
		width: min(100%, 340px);
		flex-direction: column;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.08);
	}

	/* scene 0, the branch on its own */
	.pre {
		display: flex;
		height: 254px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 0 16px;
	}
	.mini {
		width: 100%;
		max-width: 260px;
	}
	.lmain {
		stroke: var(--color-ink);
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.75;
	}
	.lbr {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.cd {
		stroke-width: 3;
		fill: var(--color-card);
	}
	.cd.main {
		stroke: var(--color-ink);
	}
	.cd.br {
		stroke: var(--color-amber);
		fill: var(--color-amber);
	}
	.bn {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
	}
	.bn.main {
		fill: var(--color-ink);
	}
	.bn.br {
		fill: var(--color-amber);
	}
	.waiting {
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 3px 10px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-amber);
	}

	/* header */
	.head {
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-bottom: 1px solid var(--color-line);
		padding: 13px 15px 11px;
	}
	.trow {
		display: flex;
		align-items: baseline;
		gap: 7px;
	}
	.title {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.num {
		font-size: 14px;
		color: var(--color-faint);
	}
	.brow {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.badge {
		border-radius: 999px;
		background: var(--color-grass);
		padding: 2px 10px;
		font-size: 10.5px;
		font-weight: 800;
		color: #fff;
	}
	.badge.merged {
		background: var(--color-brand);
	}
	.bchip {
		border-radius: 6px;
		background: var(--color-brand-soft);
		padding: 1px 7px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.arrow {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* body */
	.body {
		display: grid;
		height: 170px;
		padding: 12px 15px;
	}
	.view {
		grid-area: 1 / 1;
		display: flex;
		min-width: 0;
		flex-direction: column;
		justify-content: center;
		gap: 9px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.av {
		display: grid;
		height: 22px;
		width: 22px;
		flex: none;
		place-items: center;
		border-radius: 50%;
		font-size: 10.5px;
		font-weight: 800;
		color: #fff;
	}
	.av.citra {
		background: var(--color-amber);
	}
	.av.adi {
		background: var(--color-brand);
	}
	.rtext {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.rtext.commit {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.desc {
		display: flex;
		flex-direction: column;
		gap: 7px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		padding: 12px;
	}
	.bar {
		height: 6px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.w90 {
		width: 90%;
	}
	.w70 {
		width: 70%;
	}
	.w50 {
		width: 50%;
	}

	.diff {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 10px;
		border: 1px solid var(--color-line);
	}
	.dhead {
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 4px 9px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.dl {
		display: flex;
		padding: 2px 9px 2px 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--color-ink);
	}
	.dl i {
		width: 20px;
		flex: none;
		text-align: center;
		font-style: normal;
		font-weight: 800;
	}
	.dl.ctx {
		color: var(--color-faint);
	}
	.dl.add {
		background: var(--color-grass-soft);
	}
	.dl.add i {
		color: var(--color-grass);
	}
	.dl.del {
		background: var(--color-danger-soft);
	}
	.dl.del i {
		color: var(--color-danger);
	}

	.comment {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 10px;
		animation: rise 0.4s 0.3s ease both;
	}
	.ctext {
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	.ctext b {
		color: var(--color-ink);
	}

	.sect {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.check {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		padding: 8px 10px;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.check.ok {
		border-color: color-mix(in srgb, var(--color-grass) 40%, transparent);
		background: var(--color-grass-soft);
	}
	.cicon {
		display: grid;
		height: 18px;
		width: 18px;
		place-items: center;
		border-radius: 50%;
		background: var(--color-amber);
	}
	.check.ok .cicon {
		background: var(--color-grass);
	}
	.tick {
		fill: none;
		stroke: #fff;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.spin {
		height: 10px;
		width: 10px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.5);
		border-top-color: #fff;
		animation: spin 0.7s linear infinite;
	}
	.cname {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.cstate {
		margin-left: auto;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.check.ok .cstate {
		color: var(--color-grass);
	}
	.approve {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-grass);
		animation: rise 0.4s 0.25s ease both;
	}
	.mergebtn {
		align-self: flex-start;
		border-radius: 9px;
		background: var(--color-grass);
		padding: 6px 16px;
		font-size: 12px;
		font-weight: 800;
		color: #fff;
		animation: rise 0.4s 0.5s ease both;
	}
	.done {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 10px;
		background: var(--color-brand-soft);
		padding: 10px 12px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.gi {
		fill: var(--color-brand);
	}
	.gl {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.live {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-left: 4px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		animation: rise 0.4s 0.3s ease both;
	}
	.led {
		height: 8px;
		width: 8px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.summary {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.schip {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 4px 11px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
		animation: rise 0.35s ease both;
	}
	.lock {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.li {
		fill: var(--color-amber);
	}
	.lo {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2.2;
	}

	/* milestones */
	.tline {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 10px 12px;
	}
	.ms {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.mdot {
		height: 10px;
		width: 10px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.3s;
	}
	.ms.on .mdot {
		background: var(--color-grass);
	}
	.ms.now .mdot {
		box-shadow: 0 0 0 4px var(--color-grass-soft);
	}
	.mlabel {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.ms.on .mlabel {
		color: var(--color-ink);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.comment,
		.approve,
		.mergebtn,
		.live,
		.schip {
			animation: none;
		}
		.spin {
			animation-duration: 1.6s;
		}
	}
</style>
