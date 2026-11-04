<script lang="ts">
	// Guided DDoS lesson. Real visitors (phones) send a calm trickle of requests to the
	// nimbus.com server. Then one troublemaker, then a whole botnet of cameras and routers floods
	// it until it goes down. A shield (rate limit, then a CDN) rises in front and the flood breaks
	// against it while real visitors pass. The only optional play, on the last beat, is switching
	// the shield off and on. Requests are plain CSS animated dots, still under reduced motion.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DdosText, ShieldMode } from '$lib/chapters/security/ddos/types';
	import { guided } from './attacks2/guided.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DdosText);

	const g = guided({
		beat: () => beat,
		last: () => tx.steps.length - 1,
		onshow: (v) => onshow?.(v),
		oncomplete: () => oncomplete?.()
	});
	const step = $derived(g.step);
	const last = $derived(tx.steps.length - 1);

	const MODES: ShieldMode[] = ['off', 'on'];
	let shield = $state<ShieldMode>('on');
	function choose(m: ShieldMode) {
		shield = m;
		onstate?.(m === 'on' ? 'shieldOn' : 'shieldOff');
	}

	type Cfg = {
		attack: 'none' | 'one' | 'many';
		guard: 'none' | 'rate' | 'cdn';
		load: number;
		served: number;
	};
	const CALM: Cfg = { attack: 'none', guard: 'none', load: 0.22, served: 100 };
	const FLOOD: Cfg = { attack: 'many', guard: 'none', load: 1, served: 4 };
	const SAFE: Cfg = { attack: 'many', guard: 'cdn', load: 0.3, served: 100 };
	const cfg = $derived.by<Cfg>(() => {
		switch (step) {
			case 0:
				return CALM;
			case 1:
				return { attack: 'one', guard: 'none', load: 0.78, served: 65 };
			case 2:
			case 3:
				return FLOOD;
			case 4:
				return { attack: 'many', guard: 'rate', load: 0.82, served: 55 };
			default:
				if (step === last) return shield === 'on' ? SAFE : FLOOD;
				return SAFE;
		}
	});
	const status = $derived(cfg.load >= 0.95 ? 'down' : cfg.load >= 0.6 ? 'slow' : 'up');

	const SERVER_X = 384;
	const SHIELD_X = 306;
	const PHONES = [44, 80, 116];

	type Dot = { x: number; y: number; dx: number; dy: number; d: number; f: number; bad: boolean };
	/** Requests as dots, each with a start, a travel distance, and a delay along the loop. */
	const dots = $derived.by<Dot[]>(() => {
		const out: Dot[] = [];
		const real = 6;
		for (let k = 0; k < real; k++) {
			const y = PHONES[k % 3];
			out.push({
				x: 64,
				y,
				dx: SERVER_X - 64,
				dy: 96 + (k % 3) * 22 - y,
				d: (k / real) * 2.6,
				f: k / real,
				bad: false
			});
		}
		const count = cfg.attack === 'none' ? 0 : cfg.attack === 'one' ? 12 : 30;
		const stopShare = cfg.guard === 'cdn' ? 0.95 : cfg.guard === 'rate' ? 0.5 : 0;
		for (let k = 0; k < count; k++) {
			const y = cfg.attack === 'one' ? 190 : 156 + (k % 5) * 16;
			const ty = 88 + (k % 6) * 16;
			const stop = (k * 7) % 20 < stopShare * 20;
			const endX = stop ? SHIELD_X - 4 : SERVER_X;
			out.push({
				x: 104,
				y,
				dx: endX - 104,
				dy: (ty - y) * ((endX - 104) / (SERVER_X - 104)),
				d: (k / count) * 1.6,
				f: (k % 10) / 10,
				bad: true
			});
		}
		return out;
	});

	// The botnet, a little crowd of cameras and routers.
	const BOTS = Array.from({ length: 12 }, (_, k) => ({
		x: 20 + (k % 4) * 21,
		y: 150 + Math.floor(k / 4) * 26,
		cam: k % 2 === 0
	}));
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pick" role="group" aria-label={tx.pickLabel}>
				<span class="cap">{tx.pickLabel}</span>
				<div class="chips">
					{#each MODES as m (m)}
						<button
							type="button"
							class="chip m-{m}"
							class:on={shield === m}
							aria-pressed={shield === m}
							onclick={() => choose(m)}>{tx.modes[m]}</button
						>
					{/each}
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 460 262" class="scene" role="img" aria-label={tx.steps[i].title}>
			<!-- real visitors, three phones -->
			<text x="40" y="20" text-anchor="middle" class="lbl">{tx.visitorsLabel}</text>
			{#each PHONES as y (y)}
				<rect x="30" y={y - 14} width="20" height="30" rx="4" class="phone" />
				<rect x="33" y={y - 10} width="14" height="20" rx="1.5" class="phoneScreen" />
			{/each}

			<!-- the attacker side -->
			{#if cfg.attack === 'one'}
				<g class="fadein">
					<rect x="22" y="176" width="56" height="34" rx="5" class="shell bad" />
					<rect x="27" y="181" width="46" height="24" rx="2" class="badScreen" />
					<path d="M16 212H84L80 218H20Z" class="baseBad" />
					<text x="50" y="240" text-anchor="middle" class="lbl bad">{tx.attackerLabel}</text>
				</g>
			{:else if cfg.attack === 'many'}
				<g class="fadein">
					{#each BOTS as b, k (k)}
						{#if b.cam}
							<rect x={b.x} y={b.y} width="16" height="12" rx="3" class="bot" />
							<circle cx={b.x + 8} cy={b.y + 6} r="3.4" class="lens" />
						{:else}
							<rect x={b.x} y={b.y + 4} width="16" height="9" rx="2" class="bot" />
							<line x1={b.x + 4} y1={b.y + 4} x2={b.x + 2} y2={b.y - 2} class="antenna" />
							<line x1={b.x + 12} y1={b.y + 4} x2={b.x + 14} y2={b.y - 2} class="antenna" />
						{/if}
					{/each}
					<text x="52" y="240" text-anchor="middle" class="lbl bad">{tx.botsLabel}</text>
				</g>
			{/if}
			{#if i === 3}
				<g class="fadein">
					<rect x="10" y="246" width="84" height="16" rx="8" class="stamp" />
					<text x="52" y="257.5" text-anchor="middle" class="stampT">{tx.stamp}</text>
				</g>
			{/if}

			<!-- the shield -->
			{#if cfg.guard !== 'none'}
				<g class="fadein">
					<rect
						x={SHIELD_X - 2}
						y="40"
						width="16"
						height="196"
						rx="8"
						class="shield"
						class:full={cfg.guard === 'cdn'}
					/>
					<text x={SHIELD_X + 6} y="28" text-anchor="middle" class="lbl good">
						{cfg.guard === 'cdn' ? tx.cdnLabel : tx.rateLabel}
					</text>
					{#if cfg.guard === 'cdn'}
						{#each [70, 138, 206] as y (y)}
							<circle cx={SHIELD_X + 6} cy={y} r="4" class="edge" />
						{/each}
					{/if}
				</g>
			{/if}

			<!-- the requests -->
			{#each dots as dt, k (k)}
				<circle
					cx={dt.x}
					cy={dt.y}
					r={dt.bad ? 2.8 : 3.6}
					class="dot"
					class:bad={dt.bad}
					class:lost={!dt.bad && status === 'down'}
					style="--dx:{dt.dx}px; --dy:{dt.dy}px; --f:{dt.f}; animation-delay:{dt.d}s"
				/>
			{/each}

			<!-- nimbus.com -->
			<text x="416" y="52" text-anchor="middle" class="state {status}">{tx.states[status]}</text>
			<g class="server {status}">
				<rect x={SERVER_X} y="62" width="64" height="124" rx="9" class="shell" />
				{#each [72, 110, 148] as y, n (y)}
					<rect x={SERVER_X + 7} {y} width="50" height="30" rx="4" class="unit" />
					<circle
						cx={SERVER_X + 17}
						cy={y + 15}
						r="3.2"
						class="led"
						style="animation-delay:{n * 0.12}s"
					/>
					<line x1={SERVER_X + 27} y1={y + 11} x2={SERVER_X + 49} y2={y + 11} class="vent" />
					<line x1={SERVER_X + 27} y1={y + 19} x2={SERVER_X + 43} y2={y + 19} class="vent" />
				{/each}
			</g>
			<text x="416" y="204" text-anchor="middle" class="lbl">{tx.serverLabel}</text>
			<rect x={SERVER_X} y="212" width="64" height="6" rx="3" class="track" />
			<rect x={SERVER_X} y="212" width={64 * cfg.load} height="6" rx="3" class="load {status}" />
			<foreignObject x={SERVER_X - 20} y="222" width="104" height="34">
				<p class="served {status}">{tx.served.replace('{n}', String(cfg.served))}</p>
			</foreignObject>
		</svg>

		{#if i === 6}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={g.select} {visual} />
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
	.pick {
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
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}
	.chip.m-off.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.chip.m-on.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.rule {
		margin: 0;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 5px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
		text-align: center;
	}

	/* ---- svg parts ---- */
	.lbl {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.lbl.bad {
		fill: var(--color-danger);
	}
	.lbl.good {
		fill: var(--color-grass);
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.shell.bad {
		stroke: var(--color-danger);
	}
	.badScreen {
		fill: var(--color-danger-soft);
	}
	.baseBad {
		fill: var(--color-line);
	}
	.phone {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.phoneScreen {
		fill: var(--color-brand-soft);
	}
	.bot {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.3;
	}
	.lens {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.antenna {
		stroke: var(--color-danger);
		stroke-width: 1.3;
		stroke-linecap: round;
	}
	.stamp {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.stampT {
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-amber);
	}
	.shield {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.5;
		opacity: 0.75;
	}
	.shield.full {
		opacity: 1;
		stroke-width: 2.5;
	}
	.edge {
		fill: var(--color-grass);
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
	.server.slow .led {
		fill: var(--color-amber);
		animation: blink 0.6s ease-in-out infinite alternate;
	}
	.server.down .led {
		fill: var(--color-danger);
		animation: blink 0.3s ease-in-out infinite alternate;
	}
	.server.down .shell {
		stroke: var(--color-danger);
	}
	@keyframes blink {
		to {
			opacity: 0.3;
		}
	}
	.state {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-grass);
	}
	.state.slow {
		fill: var(--color-amber);
	}
	.state.down {
		fill: var(--color-danger);
	}
	.track {
		fill: var(--color-line);
	}
	.load {
		fill: var(--color-grass);
		transition: width 0.6s ease;
	}
	.load.slow {
		fill: var(--color-amber);
	}
	.load.down {
		fill: var(--color-danger);
	}
	.served {
		margin: 0;
		font-size: 9.5px;
		font-weight: 600;
		line-height: 1.3;
		text-align: center;
		color: var(--color-grass);
	}
	.served.slow {
		color: var(--color-amber);
	}
	.served.down {
		color: var(--color-danger);
	}
	.fadein {
		animation: fadein 0.5s ease both;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
	}

	/* the requests travelling */
	.dot {
		fill: var(--color-brand);
		opacity: 0;
		animation: travel 2.6s linear infinite;
	}
	.dot.bad {
		fill: var(--color-danger);
		animation-duration: 1.6s;
	}
	.dot.lost {
		fill: var(--color-faint);
	}
	@keyframes travel {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			transform: translate(var(--dx), var(--dy));
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
			opacity: 0.85;
			transform: translate(calc(var(--dx) * var(--f)), calc(var(--dy) * var(--f)));
		}
		.server .led,
		.fadein {
			animation: none !important;
		}
		.load,
		.chip {
			transition: none;
		}
	}
</style>
