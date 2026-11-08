<script lang="ts">
	// Guided "watch" stage for automated testing. The function total() of nimbus.com sits on top
	// as a small code card. Under it, scene by scene, the learner sees pages checked by hand, a
	// test that calls total() and turns green, unit versus integration tests as a bracket over the
	// parts of a signup, a typo that turns the test red before users see it, and a row of changes
	// that are each tested. The only optional play, on the last beat, is slipping in a bug.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { TestingText } from '$lib/chapters/compute/testing/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as TestingText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const scene = $derived(peek ?? Math.min(beat, last));

	// the optional toggle on the last beat
	let bug = $state(false);
	function toggle() {
		bug = !bug;
		onstate?.(bug ? 'broke' : 'fixed');
	}

	// one clock, restarted on every scene and every toggle
	let t = $state(0);
	let reduced = $state(false);
	$effect(() => {
		void scene;
		void bug;
		reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		t = 0;
		if (reduced) {
			t = 1e9;
			return;
		}
		const start = Date.now();
		const id = setInterval(() => {
			t = Date.now() - start;
			if (t > 4000) clearInterval(id);
		}, 100);
		return () => clearInterval(id);
	});

	const buggy = $derived(scene === 5 || (scene === last && bug));
	const view = $derived<'hand' | 'test' | 'parts' | 'tools'>(
		scene === 0 ? 'hand' : scene === 3 || scene === 4 ? 'parts' : scene === 8 ? 'tools' : 'test'
	);
	// the result bar: idle on scene 1, running briefly, then green or red
	const result = $derived<'idle' | 'run' | 'pass' | 'fail'>(
		scene === 1
			? 'idle'
			: [2, 5, 6].includes(scene) || scene === last
				? t < 900
					? 'run'
					: buggy
						? 'fail'
						: 'pass'
				: 'pass'
	);
	const showStrip = $derived(scene === 6 || scene === 7);
	const handDone = $derived(Math.min(3, Math.floor(t / 600)));
	const resultText = $derived(
		result === 'idle'
			? tx.idle
			: result === 'run'
				? tx.running
				: result === 'pass'
					? tx.passed
					: tx.failed.replace('{exp}', '30000').replace('{got}', '3000')
	);
</script>

{#snippet testCard()}
	<div class="card">
		<div class="cbar"><span class="fname">cart.test.js</span></div>
		<div class="lines">
			<span class="ln">test('{tx.testName}', () =&gt; {'{'}</span>
			<span class="ln">&nbsp;&nbsp;expect(total(10000, 3)).toBe(30000);</span>
			<span class="ln">&#125;);</span>
		</div>
	</div>
	<div class="result {result}">
		<span class="ricon">
			{#if result === 'pass'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<path d="M2 5.2 4.2 7.4 8 2.8" class="tick" />
				</svg>
			{:else if result === 'fail'}
				<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
					<path d="M2.5 2.5l5 5M7.5 2.5l-5 5" class="tick" />
				</svg>
			{:else if result === 'run'}
				<span class="spin"></span>
			{/if}
		</span>
		<span>{resultText}</span>
	</div>
{/snippet}

{#snippet visual()}
	<div class="wrap">
		<!-- the code under test -->
		<div class="card">
			<div class="cbar"><span class="fname">cart.js</span></div>
			<div class="lines">
				<span class="ln">function total(price, qty) {'{'}</span>
				{#key buggy}
					<span class="ln" class:badline={buggy} in:fade={{ duration: 240 }}>
						&nbsp;&nbsp;return price * qty{buggy ? ' / 10' : ''};
					</span>
				{/key}
				<span class="ln">&#125;</span>
			</div>
		</div>

		<div class="below">
			{#key view}
				<div class="view" in:fade={{ duration: 260 }}>
					{#if view === 'hand'}
						<span class="sect">{tx.handLabel}</span>
						<div class="pages">
							{#each tx.pages as p, i (p)}
								<div class="page" class:ok={i < handDone} class:miss={i === 3 && handDone >= 3}>
									<span class="pname">{p}</span>
									{#if i < handDone}
										<span class="pmark ok">✓</span>
									{:else if i === 3 && handDone >= 3}
										<span class="pmark miss">{tx.forgotTag}</span>
									{/if}
								</div>
							{/each}
						</div>
					{:else if view === 'parts'}
						<div class="parts">
							<span class="bracket" class:unit={scene === 3} class:all={scene === 4}>
								{scene === 3 ? tx.unitLabel : tx.integrationLabel}
							</span>
							<div class="prow">
								{#each tx.parts as p, i (p)}
									{#if i > 0}<span class="join" class:lit={scene === 4}></span>{/if}
									<div class="part" class:lit={scene === 4 || i === 1}>
										<span class="pt">{p}</span>
										{#if i === 1}<span class="fn">total()</span>{/if}
									</div>
								{/each}
							</div>
						</div>
					{:else if view === 'tools'}
						<span class="sect">{tx.toolsLabel}</span>
						<div class="tools">
							{#each ['Vitest', 'Jest', 'pytest'] as tool, i (tool)}
								<span class="tool" style="animation-delay:{i * 0.12}s">{tool}</span>
							{/each}
						</div>
						{@render testCard()}
					{:else}
						{@render testCard()}
						{#if scene === 5 && result === 'fail'}
							<div class="safe" in:fade={{ duration: 240 }}>
								<svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true">
									<rect x="1" y="1" width="10" height="14" rx="2.5" class="phone" />
								</svg>
								<span>{tx.usersSafe}</span>
							</div>
						{/if}
						{#if showStrip}
							<div class="strip">
								{#each [0, 1, 2, 3, 4] as i (i)}
									<span class="cdot" class:bad={i === 2} style="animation-delay:{0.2 + i * 0.15}s"
										>{i === 2 ? '✕' : '✓'}</span
									>
								{/each}
								<span class="slabel">{tx.everyChange}</span>
							</div>
						{/if}
					{/if}
				</div>
			{/key}
		</div>

		{#if scene === last && peek === null}
			<button type="button" class="play" class:on={bug} onclick={toggle}>
				{bug ? tx.fixBtn : tx.breakBtn}
			</button>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={scene} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.wrap {
		display: flex;
		width: min(100%, 340px);
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
		margin: 0 auto;
	}
	.card {
		overflow: hidden;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.07);
	}
	.cbar {
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 6px 11px;
	}
	.fname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.lines {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 8px 0;
	}
	.ln {
		padding: 1px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--color-ink);
	}
	.ln.badline {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 700;
	}

	.below {
		display: grid;
		min-height: 176px;
	}
	.view {
		grid-area: 1 / 1;
		display: flex;
		min-width: 0;
		flex-direction: column;
		justify-content: flex-start;
		gap: 9px;
	}
	.sect {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}

	/* scene 0 */
	.pages {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.page {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 11px;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.page.ok {
		border-color: color-mix(in srgb, var(--color-grass) 40%, transparent);
	}
	.page.miss {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.pname {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.pmark {
		font-size: 11px;
		font-weight: 800;
	}
	.pmark.ok {
		color: var(--color-grass);
	}
	.pmark.miss {
		color: var(--color-amber);
	}

	/* result bar */
	.result {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		padding: 8px 11px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-faint);
		transition:
			background 0.3s,
			border-color 0.3s,
			color 0.3s;
	}
	.ricon {
		display: grid;
		height: 18px;
		width: 18px;
		flex: none;
		place-items: center;
		border-radius: 50%;
		background: var(--color-line);
	}
	.result.run {
		color: var(--color-amber);
	}
	.result.run .ricon {
		background: var(--color-amber);
	}
	.result.pass {
		border-color: color-mix(in srgb, var(--color-grass) 40%, transparent);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.result.pass .ricon {
		background: var(--color-grass);
	}
	.result.fail {
		border-color: color-mix(in srgb, var(--color-danger) 40%, transparent);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.result.fail .ricon {
		background: var(--color-danger);
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
	.safe {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-left: 3px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-grass);
	}
	.phone {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.6;
	}

	/* every change */
	.strip {
		display: flex;
		align-items: center;
		gap: 6px;
		padding-left: 2px;
	}
	.cdot {
		display: grid;
		height: 20px;
		width: 20px;
		place-items: center;
		border-radius: 50%;
		background: var(--color-grass);
		font-size: 10px;
		font-weight: 900;
		color: #fff;
		animation: rise 0.35s ease both;
	}
	.cdot.bad {
		background: var(--color-danger);
	}
	.slabel {
		margin-left: 4px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-muted);
	}

	/* unit versus integration */
	.parts {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
	}
	.prow {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.part {
		display: flex;
		width: 88px;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 6px;
		opacity: 0.45;
		transition:
			opacity 0.3s,
			border-color 0.3s;
	}
	.part.lit {
		border-color: var(--color-brand);
		opacity: 1;
	}
	.pt {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.fn {
		border-radius: 6px;
		background: var(--color-brand-soft);
		padding: 1px 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.join {
		height: 2px;
		width: 16px;
		background: var(--color-line);
	}
	.join.lit {
		background: var(--color-brand);
	}
	.bracket {
		align-self: center;
		border-radius: 10px 10px 0 0;
		border: 2px solid var(--color-brand);
		border-bottom: none;
		padding: 3px 0 10px;
		text-align: center;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-brand);
		transition: width 0.4s ease;
	}
	.bracket.unit {
		width: 88px;
	}
	.bracket.all {
		width: 296px;
		max-width: 100%;
	}

	/* tools */
	.tools {
		display: flex;
		gap: 7px;
	}
	.tool {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 4px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand);
		animation: rise 0.35s ease both;
	}

	.play {
		align-self: center;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-danger);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.play.on {
		border-color: var(--color-grass);
		color: var(--color-grass);
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
		.cdot,
		.tool {
			animation: none;
		}
		.spin {
			animation-duration: 1.6s;
		}
	}
</style>
