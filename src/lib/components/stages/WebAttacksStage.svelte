<script lang="ts">
	// Guided SQL injection and XSS lesson. A browser types by itself, the request travels to the
	// server, and on to the database (login) or to another visitor's laptop (comments). A code
	// strip under the picture shows what the server really built from the text, with the typed
	// part marked as data or as code. Each attack plays out, then fails once its fix turns on.
	// Nothing is ever run, the login is checked by the toy database in attacks2/toySql.ts and the
	// comment is only ever shown as text. The optional play, on the last beat, is one fix switch.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { WebAttacksText } from '$lib/chapters/security/web-attacks/types';
	import { gluedLogin, paramLogin, USERS, type ToyResult } from './attacks2/toySql';
	import { guided } from './attacks2/guided.svelte';
	import { sceneClock } from './attacks2/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as WebAttacksText);

	const g = guided({
		beat: () => beat,
		last: () => tx.steps.length - 1,
		onshow: (v) => onshow?.(v),
		oncomplete: () => oncomplete?.()
	});
	const step = $derived(g.step);
	const last = $derived(tx.steps.length - 1);

	let fixOn = $state(true);
	function setFix(v: boolean) {
		fixOn = v;
		onstate?.(v ? 'fixOn' : 'fixOff');
	}

	const clock = sceneClock(() => [step, fixOn]);

	const SQLI = "' OR '1'='1' --";
	// Split so the closing tag never ends this script block.
	const XSS = '<script>steal(cookie)</' + 'script>';
	const NORMAL = 'nim';

	type Kind = 'sql' | 'xss';
	type Scene = { kind: Kind; input: string; fixed: boolean; attack: boolean };
	const ROUND = 7200;

	const scene = $derived.by<Scene>(() => {
		const s = step;
		if (s <= 1) return { kind: 'sql', input: NORMAL, fixed: false, attack: false };
		if (s === 2) return { kind: 'sql', input: SQLI, fixed: false, attack: true };
		if (s === 3) return { kind: 'sql', input: SQLI, fixed: true, attack: true };
		if (s === 4) return { kind: 'xss', input: XSS, fixed: false, attack: true };
		if (s === last) {
			// Both attacks take turns, with the fix as the learner left it.
			const k: Kind = clock.reduced || Math.floor(clock.t / ROUND) % 2 === 0 ? 'sql' : 'xss';
			return { kind: k, input: k === 'sql' ? SQLI : XSS, fixed: fixOn, attack: true };
		}
		return { kind: 'xss', input: XSS, fixed: true, attack: true };
	});

	/** Where the round is, 0 typing, 1 to the server, 2 onwards, 3 the result is in. */
	const local = $derived(clock.reduced ? 1e9 : clock.t % ROUND);
	const typeEnd = $derived(scene.input.length * 55 + 300);
	const phase = $derived(
		local < typeEnd ? 0 : local < typeEnd + 900 ? 1 : local < typeEnd + 1800 ? 2 : 3
	);
	const typed = $derived(scene.input.slice(0, Math.floor(local / 55)));

	const result = $derived.by<ToyResult>(() => {
		if (scene.kind !== 'sql') return { kind: 'none' };
		const pass = scene.attack ? 'x' : 'cloud42';
		return scene.fixed ? paramLogin(scene.input, pass) : gluedLogin(scene.input, pass);
	});
	const matchedId = $derived(phase >= 2 && result.kind === 'row' ? result.row.id : 0);
	const hacked = $derived(scene.attack && !scene.fixed && phase >= 3);
	const blocked = $derived(scene.attack && scene.fixed && phase >= 3);

	const loginLine = $derived.by(() => {
		if (phase < 3) return '';
		if (result.kind === 'row') return tx.login.welcome.replace('{user}', result.row.name);
		if (result.kind === 'error') return tx.login.broken;
		return tx.login.wrong;
	});

	type Pt = { x: number; y: number };
	const SPOTS: Pt[] = [
		{ x: 200, y: 96 },
		{ x: 266, y: 96 },
		{ x: 348, y: 96 }
	];
	const pkt = $derived(SPOTS[Math.min(2, phase)]);
	const pktOn = $derived(phase === 1 || phase === 2);

	const escaped = (s: string) =>
		s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pick" role="group" aria-label={tx.fixLabel}>
				<span class="cap">{tx.fixLabel}</span>
				<div class="chips">
					<button
						type="button"
						class="chip off"
						class:on={!fixOn}
						aria-pressed={!fixOn}
						onclick={() => setFix(false)}>{tx.fix.off}</button
					>
					<button
						type="button"
						class="chip ok"
						class:on={fixOn}
						aria-pressed={fixOn}
						onclick={() => setFix(true)}>{tx.fix.on}</button
					>
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 460 200" class="scene" role="img" aria-label={tx.steps[i].title}>
			<line x1="208" y1="96" x2="236" y2="96" class="wire" />
			<line x1="296" y1="96" x2="340" y2="96" class="wire" />

			<!-- the browser window -->
			<rect x="8" y="14" width="200" height="164" rx="10" class="shell" />
			<path d="M8 24a10 10 0 0 1 10 -10H198a10 10 0 0 1 10 10V32H8Z" class="bar" />
			{#each [20, 30, 40] as cx (cx)}<circle {cx} cy="23" r="2.6" class="dot" />{/each}
			<text x="200" y="26" text-anchor="end" class="url">nimbus.com</text>

			{#if scene.kind === 'sql'}
				<text x="22" y="50" class="h">{tx.login.title}</text>
				<text x="22" y="64" class="small">{tx.login.userLabel}</text>
				<rect x="22" y="68" width="172" height="18" rx="4" class="field" class:hot={scene.attack} />
				<text x="27" y="80.5" class="mono">{typed}</text>
				<text x="22" y="99" class="small">{tx.login.passLabel}</text>
				<rect x="22" y="103" width="172" height="18" rx="4" class="field" />
				<text x="27" y="115.5" class="mono">&#8226;&#8226;&#8226;&#8226;&#8226;</text>
				<rect x="22" y="128" width="58" height="18" rx="9" class="btn" />
				<text x="51" y="140.5" text-anchor="middle" class="btnT">{tx.login.submit}</text>
				{#if loginLine}
					<text x="22" y="166" class="res" class:bad={hacked} class:good={!scene.attack || blocked}
						>{loginLine}</text
					>
				{/if}
			{:else}
				<text x="22" y="50" class="h">{tx.comments.title}</text>
				<rect x="22" y="58" width="172" height="20" rx="6" class="bubble" />
				<text x="28" y="71.5" class="small ink">{tx.comments.seed}</text>
				<rect x="22" y="86" width="172" height="34" rx="4" class="field" class:hot={scene.attack} />
				<text x="27" y="100" class="mono">{typed}</text>
				<rect x="22" y="128" width="46" height="18" rx="9" class="btn" />
				<text x="45" y="140.5" text-anchor="middle" class="btnT">{tx.comments.post}</text>
				{#if phase >= 3}
					<text x="22" y="166" class="res good">{tx.comments.posted}</text>
				{/if}
			{/if}
			<text x="108" y="194" text-anchor="middle" class="lbl">{tx.browserLabel}</text>

			<!-- the server -->
			<rect x="236" y="50" width="60" height="96" rx="8" class="shell" />
			{#each [58, 88, 118] as y (y)}
				<rect x="243" {y} width="46" height="22" rx="4" class="unit" />
				<circle cx="252" cy={y + 11} r="2.8" class="led" class:busy={phase === 1} />
				<line x1="260" y1={y + 8} x2="282" y2={y + 8} class="vent" />
				<line x1="260" y1={y + 14} x2="276" y2={y + 14} class="vent" />
			{/each}
			{#if scene.fixed}
				<g transform="translate(266 34)" class="shield" class:pulse={blocked}>
					<path d="M0 -12L10 -8V0C10 7 5 11 0 13C-5 11 -10 7 -10 0V-8Z" />
					<path d="M-4 0L-1 3L5 -4" class="tick" />
				</g>
			{/if}
			<text x="266" y="164" text-anchor="middle" class="lbl">{tx.serverLabel}</text>

			{#if scene.kind === 'sql'}
				<!-- the database -->
				<path d="M350 50V140a50 12 0 0 0 100 0V50" class="cyl" />
				<ellipse cx="400" cy="50" rx="50" ry="12" class="cylTop" />
				{#each USERS as u, n (u.id)}
					<rect
						x="362"
						y={74 + n * 26}
						width="76"
						height="20"
						rx="5"
						class="dbrow"
						class:hit={matchedId === u.id}
						class:bad={matchedId === u.id && scene.attack}
					/>
					<text x="370" y={88 + n * 26} class="mono">{u.id}</text>
					<text x="384" y={88 + n * 26} class="mono">{u.name}</text>
				{/each}
				{#if phase >= 2 && result.kind !== 'row'}
					<text x="400" y="138" text-anchor="middle" class="small">{tx.login.noMatch}</text>
				{/if}
				<text x="400" y="176" text-anchor="middle" class="lbl">{tx.dbLabel}</text>
			{:else}
				<!-- another visitor's laptop -->
				<rect x="334" y="40" width="120" height="96" rx="8" class="shell" />
				<rect x="340" y="46" width="108" height="84" rx="4" class="screen" />
				<text x="346" y="60" class="small h2">{tx.comments.title}</text>
				<!-- the first comment wraps onto two lines so it stays inside its bubble -->
				<rect x="346" y="66" width="96" height="24" rx="5" class="bubble" />
				<foreignObject x="349" y="68" width="90" height="21">
					<p class="popT">{tx.comments.seed}</p>
				</foreignObject>
				{#if phase >= 2}
					<rect x="344" y="94" width="100" height="16" rx="5" class="bubble" />
					{#if scene.fixed}
						<text x="347" y="104.5" class="tiny mono2">{scene.input}</text>
					{/if}
				{/if}
				{#if hacked}
					<g class="popup">
						<rect x="352" y="70" width="84" height="44" rx="6" class="pop" />
						<text x="358" y="84" class="tiny bold">{tx.comments.popupTitle}</text>
						<foreignObject x="356" y="87" width="78" height="26">
							<p class="popT">{tx.comments.popupBody}</p>
						</foreignObject>
					</g>
				{/if}
				<path d="M326 138H462L456 146H332Z" class="base" />
				<text x="394" y="166" text-anchor="middle" class="lbl">{tx.visitorLabel}</text>
			{/if}

			<!-- the request on its way -->
			<circle
				cx="0"
				cy="0"
				r="6"
				class="pkt"
				class:off={!pktOn}
				class:snap={phase === 0}
				class:bad={scene.attack && !scene.fixed}
				style="transform: translate({pkt.x}px, {pkt.y}px)"
			/>
		</svg>

		<!-- what the server really built from the text -->
		<div class="strip" class:dim={phase < 1 && !clock.reduced}>
			{#if scene.kind === 'sql'}
				<span class="sCap">{tx.strip.query}</span>
				{#if scene.fixed}
					<code>SELECT * FROM users WHERE name = ? AND pass = ?</code>
					<span class="sCap">{tx.strip.params}</span>
					<code>name = <span class="in data">"{scene.input}"</span></code>
					<span class="tag data">{tx.dataTag}</span>
				{:else}
					<code
						>SELECT * FROM users WHERE name = '<span class="in" class:code={scene.attack}
							>{scene.input}</span
						>' AND pass = '&#8226;&#8226;&#8226;'</code
					>
					<span class="tag" class:code={scene.attack} class:data={!scene.attack}
						>{scene.attack ? tx.codeTag : tx.dataTag}</span
					>
				{/if}
			{:else}
				<span class="sCap">{tx.strip.page}</span>
				{#if scene.fixed}
					<code>&lt;p&gt;<span class="in data">{escaped(scene.input)}</span>&lt;/p&gt;</code>
					<span class="tag data">{tx.dataTag}</span>
				{:else}
					<code>&lt;p&gt;<span class="in code">{scene.input}</span>&lt;/p&gt;</code>
					<span class="tag code">{tx.codeTag}</span>
				{/if}
			{/if}
		</div>

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
	.chip.off.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.chip.ok.on {
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
	}

	/* ---- svg parts ---- */
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bar {
		fill: var(--color-paper);
	}
	.dot {
		fill: var(--color-line);
	}
	.url {
		font-size: 7.5px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.screen {
		fill: var(--color-paper);
	}
	.base {
		fill: var(--color-line);
	}
	.h {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.h2 {
		font-weight: 700;
		fill: var(--color-ink);
	}
	.small {
		font-size: 7.5px;
		fill: var(--color-muted);
	}
	.small.ink {
		fill: var(--color-ink);
	}
	.tiny {
		font-size: 6px;
		fill: var(--color-muted);
	}
	.tiny.bold {
		font-weight: 800;
		fill: var(--color-danger);
	}
	.mono,
	.mono2 {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 8.5px;
		fill: var(--color-ink);
	}
	.mono2 {
		font-size: 5.3px;
	}
	.field {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.field.hot {
		stroke: var(--color-amber);
	}
	.bubble {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.btn {
		fill: var(--color-brand);
	}
	.btnT {
		font-size: 7.5px;
		font-weight: 700;
		fill: #fff;
	}
	.res {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.res.bad {
		fill: var(--color-danger);
	}
	.res.good {
		fill: var(--color-grass);
	}
	.lbl {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
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
	.led.busy {
		fill: var(--color-amber);
	}
	.shield path {
		fill: var(--color-grass);
	}
	.shield .tick {
		fill: none;
		stroke: #fff;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.shield.pulse {
		animation: pulse 1.4s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.6;
		}
	}
	.cyl {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.cylTop {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.dbrow {
		fill: var(--color-paper);
		stroke: var(--color-line);
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.dbrow.hit {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.dbrow.hit.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.pop {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.popT {
		margin: 0;
		font-size: 6px;
		line-height: 1.3;
		color: var(--color-muted);
	}
	.popup {
		animation: appear 0.35s ease both;
	}
	@keyframes appear {
		from {
			opacity: 0;
		}
	}
	.pkt {
		fill: var(--color-brand);
		transition:
			transform 0.85s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.3s;
	}
	.pkt.bad {
		fill: var(--color-danger);
	}
	.pkt.snap {
		transition: opacity 0.3s;
	}
	.pkt.off {
		opacity: 0;
	}

	/* ---- the code strip ---- */
	.strip {
		display: flex;
		width: 100%;
		max-width: 460px;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 10px 12px;
		transition: opacity 0.3s;
	}
	.strip.dim {
		opacity: 0.55;
	}
	.sCap {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	code {
		overflow-wrap: anywhere;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-ink);
	}
	.in {
		border-radius: 4px;
		padding: 0 2px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.in.code {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 700;
	}
	.in.data {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.tag {
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 10.5px;
		font-weight: 800;
		color: #fff;
		background: var(--color-brand);
	}
	.tag.code {
		background: var(--color-danger);
	}
	.tag.data {
		background: var(--color-grass);
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt,
		.dbrow,
		.strip,
		.chip {
			transition: none;
		}
		.shield.pulse,
		.popup {
			animation: none;
		}
	}
</style>
