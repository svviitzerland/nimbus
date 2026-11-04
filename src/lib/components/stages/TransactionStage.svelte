<script lang="ts">
	// A guided "watch" stage for transactions. Two bank cards and a database server sit side by
	// side while a coin travels from Adi to Bima and the SQL log runs line by line. Scene by scene
	// the same transfer plays plainly, crashes halfway and loses the money, runs inside BEGIN and
	// COMMIT, and finally crashes inside a transaction and rolls back. The only optional play is a
	// switch that turns the transaction off or on for the same crash.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { TransactionText } from '$lib/chapters/web/transaction/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as TransactionText);

	// Which scene each beat shows (seven beats, six scenes).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 4, 5];
	const AMOUNT = 50000;
	const START = { adi: 100000, bima: 50000 };

	type LineKind = 'begin' | 'u1' | 'u2' | 'commit' | 'crash' | 'rollback';
	type Frame = {
		at: number; // the log line running now
		adi: number;
		bima: number;
		coin: 'adi' | 'mid' | 'bima' | 'gone';
		server: 'up' | 'down' | 'back';
		end?: 'ok' | 'lost' | 'saved' | 'rolled';
	};
	type Mode = { lines: LineKind[]; skip: number[]; frames: Frame[] };
	const A = START.adi;
	const B = START.bima;
	const MODES: Record<'plain' | 'crash' | 'commit' | 'rollback', Mode> = {
		plain: {
			lines: ['u1', 'u2'],
			skip: [],
			frames: [
				{ at: -1, adi: A, bima: B, coin: 'adi', server: 'up' },
				{ at: 0, adi: A - AMOUNT, bima: B, coin: 'mid', server: 'up' },
				{ at: 1, adi: A - AMOUNT, bima: B + AMOUNT, coin: 'bima', server: 'up' },
				{ at: 2, adi: A - AMOUNT, bima: B + AMOUNT, coin: 'bima', server: 'up', end: 'ok' }
			]
		},
		crash: {
			lines: ['u1', 'crash', 'u2'],
			skip: [2],
			frames: [
				{ at: -1, adi: A, bima: B, coin: 'adi', server: 'up' },
				{ at: 0, adi: A - AMOUNT, bima: B, coin: 'mid', server: 'up' },
				{ at: 1, adi: A - AMOUNT, bima: B, coin: 'gone', server: 'down' },
				{ at: 3, adi: A - AMOUNT, bima: B, coin: 'gone', server: 'back', end: 'lost' }
			]
		},
		commit: {
			lines: ['begin', 'u1', 'u2', 'commit'],
			skip: [],
			frames: [
				{ at: -1, adi: A, bima: B, coin: 'adi', server: 'up' },
				{ at: 0, adi: A, bima: B, coin: 'adi', server: 'up' },
				{ at: 1, adi: A - AMOUNT, bima: B, coin: 'mid', server: 'up' },
				{ at: 2, adi: A - AMOUNT, bima: B + AMOUNT, coin: 'bima', server: 'up' },
				{ at: 3, adi: A - AMOUNT, bima: B + AMOUNT, coin: 'bima', server: 'up', end: 'saved' }
			]
		},
		rollback: {
			lines: ['begin', 'u1', 'crash', 'u2', 'commit', 'rollback'],
			skip: [3, 4],
			frames: [
				{ at: -1, adi: A, bima: B, coin: 'adi', server: 'up' },
				{ at: 0, adi: A, bima: B, coin: 'adi', server: 'up' },
				{ at: 1, adi: A - AMOUNT, bima: B, coin: 'mid', server: 'up' },
				{ at: 2, adi: A - AMOUNT, bima: B, coin: 'gone', server: 'down' },
				{ at: 5, adi: A, bima: B, coin: 'adi', server: 'back', end: 'rolled' }
			]
		}
	};
	const COIN_AT = { adi: [64, 52], mid: [180, 16], bima: [296, 52], gone: [180, 16] };

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let safe = $state(true); // the switch on the try it scene
	let fi = $state(0); // frame index

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const mode = $derived(
		scene === 0
			? MODES.plain
			: scene === 1
				? MODES.crash
				: scene === 2
					? MODES.commit
					: scene === 5 && !safe
						? MODES.crash
						: MODES.rollback
	);
	const frame = $derived(mode.frames[Math.min(fi, mode.frames.length - 1)]);
	const fmt = $derived(new Intl.NumberFormat(tx.locale));
	const money = (n: number) => `${tx.currency} ${fmt.format(n)}`;

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	// Step through the frames, hold the ending, then play again. The remember scene stays on the
	// ending so the rule can sink in.
	$effect(() => {
		const m = mode;
		const sc = scene;
		const last = m.frames.length - 1;
		if (reduced || sc === 4) {
			fi = last;
			return;
		}
		fi = 0;
		let t: ReturnType<typeof setTimeout>;
		const step = () => {
			if (fi < last) {
				fi += 1;
				t = setTimeout(step, 1400);
			} else {
				t = setTimeout(() => {
					fi = 0;
					t = setTimeout(step, 900);
				}, 3000);
			}
		};
		t = setTimeout(step, 900);
		return () => clearTimeout(t);
	});

	const sqlOf = $derived<Record<LineKind, string>>({
		begin: 'BEGIN;',
		u1: `UPDATE ${tx.tableName} SET ${tx.balanceCol} = ${tx.balanceCol} - ${AMOUNT}\n  WHERE ${tx.nameCol} = '${tx.sender}';`,
		u2: `UPDATE ${tx.tableName} SET ${tx.balanceCol} = ${tx.balanceCol} + ${AMOUNT}\n  WHERE ${tx.nameCol} = '${tx.receiver}';`,
		commit: 'COMMIT;',
		crash: tx.crashLine,
		rollback: 'ROLLBACK;'
	});
	function lineState(k: number, kind: LineKind) {
		if (kind === 'crash' || kind === 'rollback') return frame.at >= k ? 'shown' : 'hidden';
		if (frame.server === 'back' && mode.skip.includes(k)) return 'skipped';
		if (k < frame.at) return 'done';
		if (k === frame.at) return 'run';
		return 'wait';
	}
	const total = $derived(frame.adi + frame.bima);
	const lost = $derived(A + B - total);
	const inTx = $derived(mode.lines[0] === 'begin');

	function toggle() {
		safe = !safe;
		onstate?.(safe ? 'on' : 'off');
	}
</script>

{#snippet account(x: number, who: string, balance: number, tag: string | null, good: boolean)}
	<g transform="translate({x} 76)">
		<rect width="112" height="70" rx="10" class="acct" />
		<rect x="10" y="12" width="18" height="13" rx="3" class="chip" />
		<text x="102" y="23" class="who">{who}</text>
		{#key balance}
			<text x="10" y="54" class="bal" class:changed={balance !== (who === tx.sender ? A : B)}
				>{money(balance)}</text
			>
		{/key}
		{#if tag}
			<g transform="translate(56 70)" in:fade={{ duration: 250 }}>
				<rect x="-34" y="-9" width="68" height="18" rx="9" class="tag" class:good />
				<text y="4" class="tag-text" class:good>{tag}</text>
			</g>
		{/if}
	</g>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 5}
					<button type="button" class="switch" role="switch" aria-checked={safe} onclick={toggle}>
						<span>{tx.txLabel}</span>
						<span class="track" class:on={safe}><span class="knob"></span></span>
						<b class:on={safe}>{safe ? tx.txOn : tx.txOff}</b>
					</button>
				{/if}

				<div class="card">
					<svg viewBox="0 0 360 172" class="scene" aria-hidden="true">
						{@render account(
							8,
							tx.sender,
							frame.adi,
							frame.end === 'saved' ? tx.savedTag : null,
							true
						)}
						{@render account(
							240,
							tx.receiver,
							frame.bima,
							frame.end === 'saved' ? tx.savedTag : null,
							true
						)}

						<!-- the database server, a small rack -->
						<g transform="translate(150 84)" class="rack" class:down={frame.server === 'down'}>
							<rect width="60" height="62" rx="6" class="rack-body" />
							{#each [0, 1, 2] as k (k)}
								<rect x="7" y={8 + k * 18} width="46" height="12" rx="3" class="slot" />
								<circle cx="45" cy={14 + k * 18} r="2.4" class="led" />
							{/each}
						</g>
						<text x="180" y="166" class="srv" class:bad={frame.server === 'down'}>
							{frame.server === 'down'
								? tx.crashedTag
								: frame.server === 'back'
									? tx.backTag
									: tx.serverLabel}
						</text>

						<!-- the coin on its way -->
						<path d="M64 60 Q180 -10 296 60" class="route" />
						<g
							class="coin"
							class:gone={frame.coin === 'gone'}
							style="transform:translate({COIN_AT[frame.coin][0]}px,{COIN_AT[frame.coin][1]}px)"
						>
							<circle r="13" class="coin-body" />
							<text y="4" class="coin-text">{tx.currency}</text>
						</g>
					</svg>
					<p class="total" class:good={lost === 0} class:bad={lost > 0}>
						{tx.totalLabel}
						<b>{money(total)}</b>
						<span>{lost > 0 ? tx.totalLost.replace('{amount}', fmt.format(lost)) : tx.totalOk}</span
						>
					</p>
				</div>

				<div class="log" class:tx={inTx}>
					<p class="log-label">{tx.logLabel}</p>
					{#each mode.lines as kind, k (k)}
						{@const st = lineState(k, kind)}
						{#if st !== 'hidden'}
							<div
								class="line {st} {kind}"
								in:fade={{ duration: kind === 'crash' || kind === 'rollback' ? 300 : 0 }}
							>
								{#if kind === 'crash'}
									<span class="bolt">!</span>{sqlOf[kind]}
								{:else}
									<code>{sqlOf[kind]}</code>
								{/if}
							</div>
						{/if}
					{/each}
				</div>

				{#if s === 4}
					<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1.5px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.switch .track {
		position: relative;
		height: 20px;
		width: 36px;
		border-radius: 999px;
		background: var(--color-danger);
		transition: background 0.25s;
	}
	.switch .track.on {
		background: var(--color-grass);
	}
	.switch .knob {
		position: absolute;
		top: 2px;
		left: 2px;
		height: 16px;
		width: 16px;
		border-radius: 999px;
		background: var(--color-card);
		transition: transform 0.25s;
	}
	.switch .track.on .knob {
		transform: translateX(16px);
	}
	.switch b {
		min-width: 3em;
		text-align: left;
		color: var(--color-danger);
	}
	.switch b.on {
		color: var(--color-grass);
	}

	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px 12px;
	}
	.scene {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.acct {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.chip {
		fill: var(--color-amber);
		opacity: 0.7;
	}
	.who {
		fill: var(--color-ink);
		font-size: 13px;
		font-weight: 700;
		text-anchor: end;
	}
	.bal {
		fill: var(--color-ink);
		font-size: 13px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.bal.changed {
		fill: var(--color-brand);
	}
	.tag {
		fill: var(--color-amber-soft);
	}
	.tag.good {
		fill: var(--color-grass-soft);
	}
	.tag-text {
		fill: var(--color-amber);
		font-size: 10.5px;
		font-weight: 800;
		text-anchor: middle;
	}
	.tag-text.good {
		fill: var(--color-grass);
	}
	.rack-body {
		fill: var(--color-ink);
		opacity: 0.85;
		transition: opacity 0.4s;
	}
	.slot {
		fill: var(--color-faint);
		opacity: 0.35;
	}
	.led {
		fill: var(--color-grass);
		transition: fill 0.3s;
	}
	.rack.down .rack-body {
		opacity: 0.35;
	}
	.rack.down .led {
		fill: var(--color-faint);
	}
	.srv {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.srv.bad {
		fill: var(--color-danger);
	}
	.route {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.coin {
		transition:
			transform 1s cubic-bezier(0.3, 0.7, 0.3, 1),
			opacity 0.5s;
	}
	.coin.gone {
		opacity: 0;
	}
	.coin-body {
		fill: var(--color-amber);
		stroke: color-mix(in srgb, var(--color-amber) 60%, var(--color-ink));
		stroke-width: 1.5;
	}
	.coin-text {
		fill: var(--color-card);
		font-size: 9.5px;
		font-weight: 800;
		text-anchor: middle;
	}
	.total {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 10px;
		margin: 6px 0 0;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.total b {
		color: var(--color-ink);
	}
	.total.good span {
		color: var(--color-grass);
	}
	.total.bad span {
		color: var(--color-danger);
	}

	.log {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 12px;
	}
	.log.tx {
		border-color: color-mix(in srgb, var(--color-brand) 45%, var(--color-line));
	}
	.log-label {
		margin: 0 0 6px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.line {
		border-radius: 8px;
		padding: 3px 8px;
		font-size: 12px;
		transition:
			background 0.3s,
			opacity 0.3s;
	}
	.line code {
		white-space: pre-wrap;
		word-break: break-word;
		font-family: var(--font-mono, ui-monospace, monospace);
		color: var(--color-ink);
	}
	.line.wait {
		opacity: 0.4;
	}
	.line.run {
		background: var(--color-brand-soft);
	}
	.line.skipped {
		opacity: 0.3;
	}
	.line.skipped code {
		text-decoration: line-through;
	}
	.line.begin code,
	.line.commit code,
	.line.rollback code {
		font-weight: 700;
		color: var(--color-brand);
	}
	.line.rollback {
		background: var(--color-grass-soft);
	}
	.line.rollback code {
		color: var(--color-grass);
	}
	.line.crash {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--color-danger-soft);
		font-weight: 700;
		color: var(--color-danger);
	}
	.bolt {
		display: inline-grid;
		height: 16px;
		width: 16px;
		place-items: center;
		border-radius: 999px;
		background: var(--color-danger);
		font-size: 11px;
		color: var(--color-card);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.line {
			font-size: 11.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.coin,
		.line,
		.led,
		.rack-body,
		.switch .track,
		.switch .knob {
			transition: none;
		}
	}
</style>
