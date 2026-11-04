<script lang="ts">
	// Guided "watch" stage for branches, merge, and merge conflicts. A small nimbus.com card on
	// top always shows what main holds (the live site), and a Git graph underneath grows with the
	// story. Scenes 0 to 3, Adi tries a Sign up button on his own branch and merges it. Scenes 4
	// to 7, Adi and Citra both change the homepage title, Citra's merge stops with a conflict, the
	// card turns into the file with Git's markers, and Citra keeps one title. Nothing to do.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { GitBranchText } from '$lib/chapters/compute/git-branch/types';

	let { text, beat = 0, oncomplete, onshow }: StageProps = $props();
	const tx = $derived(text as GitBranchText);

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

	// what the top card shows
	const top = $derived<'site' | 'file' | 'term'>(
		scene === 6 || scene === 7 ? 'file' : scene === 9 ? 'term' : 'site'
	);
	const siteTitle = $derived(
		scene >= 7 ? tx.siteTitles.citra : scene >= 5 ? tx.siteTitles.adi : tx.siteTitles.start
	);
	const hasButton = $derived(scene >= 3);

	// story A (Adi tries a button) or story B (two people, one line)
	const storyB = $derived(scene >= 4);
	const citraState = $derived<'none' | 'stuck' | 'ok'>(
		scene < 5 ? 'none' : scene < 7 ? 'stuck' : 'ok'
	);

	const MAIN_Y = 78;
</script>

{#snippet commitDot(x: number, y: number, tone: string)}
	<circle cx={x} cy={y} r="7" class="dot {tone}" />
{/snippet}

{#snippet visual()}
	<div class="wrap">
		<!-- the top card, the live site, the conflicted file, or the terminal -->
		<div class="topcard">
			{#key top + (top === 'site' ? siteTitle + hasButton : scene)}
				<div class="inner" in:fade={{ duration: 260 }}>
					{#if top === 'site'}
						<div class="site">
							<div class="addr">
								<span class="led"></span>
								<span class="url">nimbus.com</span>
								<span class="chip">{tx.liveChip}</span>
							</div>
							<div class="page">
								<span class="h1">{siteTitle}</span>
								<span class="bar w80"></span>
								<span class="bar w60"></span>
								{#if hasButton}<span class="btn">{tx.signupBtn}</span>{/if}
							</div>
						</div>
					{:else if top === 'file'}
						<div class="code">
							<div class="cbar">
								<span class="fname">index.html</span>
								{#if scene === 6}
									<span class="tag bad">{tx.conflictTag}</span>
								{:else}
									<span class="tag good">{tx.resolvedTag}</span>
								{/if}
							</div>
							<div class="lines">
								{#if scene === 6}
									<span class="ln mark">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>
									<span class="ln ours">&lt;h1&gt;{tx.siteTitles.adi}&lt;/h1&gt;</span>
									<span class="ln mark">=======</span>
									<span class="ln theirs">&lt;h1&gt;{tx.siteTitles.citra}&lt;/h1&gt;</span>
									<span class="ln mark">&gt;&gt;&gt;&gt;&gt;&gt;&gt; citra</span>
								{:else}
									<span class="ln faint">&lt;body&gt;</span>
									<span class="ln theirs">&lt;h1&gt;{tx.siteTitles.citra}&lt;/h1&gt;</span>
									<span class="ln faint">&lt;button&gt;{tx.signupBtn}&lt;/button&gt;</span>
								{/if}
							</div>
						</div>
					{:else}
						<div class="term">
							<span class="tl"><b>$</b> git switch -c adi</span>
							<span class="tl"><b>$</b> git commit -m "{tx.buttonCommit}"</span>
							<span class="tl"><b>$</b> git switch main</span>
							<span class="tl"><b>$</b> git merge adi</span>
						</div>
					{/if}
				</div>
			{/key}
		</div>

		<!-- the Git graph -->
		<svg viewBox="0 0 340 156" class="graph" role="img" aria-label={tx.steps[scene].title}>
			<line x1="14" y1={MAIN_Y} x2="326" y2={MAIN_Y} class="ln-main" />
			<text x="14" y={MAIN_Y - 12} class="bname main">main</text>

			{#if !storyB}
				<g>
					{@render commitDot(40, MAIN_Y, 'main')}
					{@render commitDot(84, MAIN_Y, 'main')}
					{#if scene >= 1}
						<g in:fade={{ duration: 300 }}>
							<path d="M84 {MAIN_Y} C104 {MAIN_Y} 104 28 124 28 L210 28" class="ln-br adi" />
							<text x="124" y="16" class="bname adi">adi</text>
						</g>
					{/if}
					{#if scene >= 2}
						<g in:fade={{ duration: 300, delay: 150 }}>
							{@render commitDot(160, 28, 'adi')}
							<text x="160" y="50" text-anchor="middle" class="clabel">{tx.buttonCommit}</text>
						</g>
					{/if}
					{#if scene >= 3}
						<g in:fade={{ duration: 300 }}>
							<path d="M210 28 C232 28 232 {MAIN_Y} 254 {MAIN_Y}" class="ln-br adi" />
							{@render commitDot(260, MAIN_Y, 'merge')}
							<text x="260" y={MAIN_Y + 24} text-anchor="middle" class="clabel strong">merge</text>
						</g>
					{/if}
				</g>
			{:else}
				<g in:fade={{ duration: 300 }}>
					{@render commitDot(40, MAIN_Y, 'main')}
					<!-- Adi, on top -->
					<path d="M70 {MAIN_Y} C90 {MAIN_Y} 90 24 110 24 L170 24" class="ln-br adi" />
					<text x="110" y="12" class="bname adi">adi</text>
					{@render commitDot(136, 24, 'adi')}
					<text x="136" y="46" text-anchor="middle" class="clabel">{tx.titleCommit}</text>
					<!-- Citra, below -->
					<path d="M70 {MAIN_Y} C90 {MAIN_Y} 90 134 110 134 L250 134" class="ln-br citra" />
					<text x="110" y="153" class="bname citra">citra</text>
					{@render commitDot(160, 134, 'citra')}
					<text x="160" y="120" text-anchor="middle" class="clabel">{tx.titleCommit}</text>
					{@render commitDot(70, MAIN_Y, 'main')}
				</g>
				{#if scene >= 5}
					<g in:fade={{ duration: 300 }}>
						<path d="M170 24 C190 24 190 {MAIN_Y} 210 {MAIN_Y}" class="ln-br adi" />
						{@render commitDot(216, MAIN_Y, 'merge')}
					</g>
				{/if}
				{#if citraState !== 'none'}
					<g in:fade={{ duration: 300, delay: 200 }}>
						<path
							d="M250 134 C270 134 270 {MAIN_Y} 290 {MAIN_Y}"
							class="ln-br citra"
							class:stuck={citraState === 'stuck'}
						/>
						{#key citraState}
							<g in:fade={{ duration: 260 }}>
								{@render commitDot(296, MAIN_Y, citraState === 'stuck' ? 'stuck' : 'merge')}
								<text
									x="296"
									y={MAIN_Y + 4}
									text-anchor="middle"
									class="mk"
									class:hide={citraState !== 'stuck'}>!</text
								>
								<text
									x="296"
									y={MAIN_Y - 16}
									text-anchor="middle"
									class="clabel strong"
									class:badtxt={citraState === 'stuck'}
									class:goodtxt={citraState === 'ok'}
								>
									{citraState === 'stuck' ? tx.conflictTag : tx.resolvedTag}
								</text>
							</g>
						{/key}
					</g>
				{/if}
			{/if}
		</svg>
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={scene} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		max-width: 400px;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		margin: 0 auto;
	}
	.topcard {
		display: grid;
		width: min(100%, 300px);
		height: 138px;
	}
	.inner {
		grid-area: 1 / 1;
		display: flex;
		min-width: 0;
	}

	/* the live site */
	.site {
		display: flex;
		width: 100%;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 7px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 11px;
	}
	.led {
		height: 8px;
		width: 8px;
		flex: none;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.url {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chip {
		margin-left: auto;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 2px 8px;
		font-size: 9.5px;
		font-weight: 700;
		white-space: nowrap;
		color: var(--color-grass);
	}
	.page {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		gap: 7px;
		padding: 12px 14px;
	}
	.h1 {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--color-ink);
	}
	.bar {
		height: 6px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.w80 {
		width: 80%;
	}
	.w60 {
		width: 60%;
	}
	.btn {
		margin-top: 2px;
		border-radius: 8px;
		background: var(--color-brand);
		padding: 3px 12px;
		font-size: 11px;
		font-weight: 700;
		color: #fff;
	}

	/* the file with conflict markers */
	.code {
		display: flex;
		width: 100%;
		flex-direction: column;
		overflow: hidden;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
	}
	.cbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 7px 11px;
	}
	.fname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tag {
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 9.5px;
		font-weight: 800;
	}
	.tag.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.tag.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.lines {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		padding: 6px 0;
	}
	.ln {
		padding: 1px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--color-ink);
	}
	.ln.mark {
		font-weight: 700;
		color: var(--color-danger);
	}
	.ln.ours {
		background: var(--color-brand-soft);
	}
	.ln.theirs {
		background: var(--color-amber-soft);
	}
	.ln.faint {
		color: var(--color-faint);
	}

	/* the terminal */
	.term {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
		border-radius: 14px;
		background: #1b2530;
		padding: 12px 16px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.14);
	}
	.tl {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		white-space: nowrap;
		color: #d6deea;
	}
	.tl b {
		color: #6cc08a;
	}

	/* the graph */
	.graph {
		display: block;
		width: 100%;
		max-width: 380px;
		overflow: visible;
	}
	.ln-main {
		stroke: var(--color-ink);
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.75;
	}
	.ln-br {
		fill: none;
		stroke-width: 3;
		stroke-linecap: round;
	}
	.ln-br.adi {
		stroke: var(--color-brand);
	}
	.ln-br.citra {
		stroke: var(--color-amber);
	}
	.ln-br.stuck {
		stroke: var(--color-danger);
	}
	.dot {
		stroke-width: 3;
		fill: var(--color-card);
	}
	.dot.main {
		stroke: var(--color-ink);
	}
	.dot.adi {
		stroke: var(--color-brand);
		fill: var(--color-brand);
	}
	.dot.citra {
		stroke: var(--color-amber);
		fill: var(--color-amber);
	}
	.dot.merge {
		stroke: var(--color-grass);
		fill: var(--color-grass);
	}
	.dot.stuck {
		stroke: var(--color-danger);
		fill: var(--color-danger);
	}
	.mk {
		font-size: 11px;
		font-weight: 900;
		fill: #fff;
	}
	.mk.hide {
		display: none;
	}
	.bname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
	}
	.bname.main {
		fill: var(--color-ink);
	}
	.bname.adi {
		fill: var(--color-brand);
	}
	.bname.citra {
		fill: var(--color-amber);
	}
	.clabel {
		font-size: 10px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.clabel.strong {
		font-weight: 800;
	}
	.badtxt {
		fill: var(--color-danger);
	}
	.goodtxt {
		fill: var(--color-grass);
	}
</style>
