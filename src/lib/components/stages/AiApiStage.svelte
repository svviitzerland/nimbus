<script lang="ts">
	// A guided "watch" stage. The nimbus app on a phone asks a question, packs a request with a
	// model name and an API key, and sends it over the internet to an AI provider. The model reads
	// it as tokens, sends JSON back with a token count, and a taxi meter turns the count into a
	// bill. The only optional play, on the last beat, asks for a long answer to make the meter run.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { AiApiText } from '$lib/chapters/ai/ai-api/types';
	import { phaseAt, sceneClock, wrap } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as AiApiText);

	type Scene =
		| 'app'
		| 'provider'
		| 'request'
		| 'key'
		| 'tokens'
		| 'response'
		| 'meter'
		| 'remember'
		| 'try';
	const SCENES: Scene[] = [
		'app',
		'provider',
		'request',
		'key',
		'tokens',
		'response',
		'meter',
		'remember',
		'try'
	];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
	/** A pretend price, ten dollars per million tokens, the same for tokens in and out. */
	const PRICE = 0.00001;

	let peek = $state<number | null>(null);
	let long = $state(false);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, long]);
	const t = $derived(clock.t);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const ask = $derived(scene === 'try' && long ? tx.long : tx.short);
	const total = $derived(ask.tokensIn + ask.tokensOut);

	// ---- the envelope on the wire ----
	const OUT_X = 116;
	const IN_X = 226;
	const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
	const env = $derived.by((): { x: number; show: boolean; key: boolean } => {
		if (scene === 'request') {
			const { ph, p } = phaseAt(
				[
					{ ph: 'wait', ms: 1800 },
					{ ph: 'go', ms: 1400 },
					{ ph: 'rest', ms: 1000 }
				],
				t
			);
			if (ph === 'wait') return { x: OUT_X, show: true, key: false };
			if (ph === 'go') return { x: lerp(OUT_X, IN_X, p), show: true, key: false };
			return { x: IN_X, show: false, key: false };
		}
		if (scene === 'key') return { x: (OUT_X + IN_X) / 2, show: true, key: true };
		if (scene === 'response' && t < 1400)
			return { x: lerp(IN_X, OUT_X, t / 1400), show: true, key: false };
		if (scene === 'try') {
			if (t < 1100) return { x: lerp(OUT_X, IN_X, t / 1100), show: true, key: true };
			if (t >= 1600 && t < 2700)
				return { x: lerp(IN_X, OUT_X, (t - 1600) / 1100), show: true, key: false };
		}
		return { x: OUT_X, show: false, key: false };
	});

	const qShown = $derived(scene !== 'app' || t > 500);
	const replyShown = $derived(
		scene === 'meter' ||
			scene === 'remember' ||
			(scene === 'response' && t > 1400) ||
			(scene === 'try' && t > 2700)
	);
	const thinking = $derived(
		!clock.reduced &&
			(scene === 'tokens' ||
				(scene === 'request' && t % 4200 > 3200) ||
				(scene === 'try' && t > 1100 && t < 1600))
	);

	// ---- the code card ----
	type Card = 'none' | 'request' | 'tokens' | 'response';
	const card = $derived<Card>(
		scene === 'app' || scene === 'provider'
			? 'none'
			: scene === 'request' || scene === 'key'
				? 'request'
				: scene === 'tokens'
					? 'tokens'
					: scene === 'try' && t < 1600
						? 'request'
						: 'response'
	);
	const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 3) + '...' : s);
	// Real request and response shapes, shown as code, so they are kept as they are.
	const REQ = $derived([
		'POST api.provider.ai/v1/chat',
		'key: sk_****9f3a',
		'{ "model": "mini",',
		`  "message": "${cut(ask.question, 24)}" }`
	]);
	const RES = $derived([
		`{ "reply": "${cut(ask.reply, 22)}",`,
		'  "usage": {',
		`    "input_tokens": ${ask.tokensIn},`,
		`    "output_tokens": ${ask.tokensOut} } }`
	]);
	const lines = $derived(card === 'request' ? REQ : card === 'response' ? RES : []);
	const linesShown = $derived(
		scene === 'request'
			? Math.min(4, Math.floor(t / 350) + 1)
			: scene === 'response'
				? t < 1400
					? 0
					: Math.min(4, Math.floor((t - 1400) / 300) + 1)
				: 4
	);
	const hot = (k: number) =>
		(scene === 'key' && k === 1) ||
		((scene === 'meter' || scene === 'remember' || (scene === 'try' && t > 2700)) && k >= 2);

	const chips = $derived.by(() => {
		let x = 22;
		return tx.tokenChips.map((c) => {
			const w = c.length * 5.6 + 14;
			const out = { c, x, w };
			x += w + 6;
			return out;
		});
	});
	const chipsShown = $derived(
		scene === 'tokens' ? Math.min(chips.length, Math.floor(t / 380) + 1) : chips.length
	);

	// ---- the taxi meter ----
	const meterOn = $derived(active >= 6);
	const frac = $derived(
		scene === 'meter'
			? Math.min(1, t / 2200)
			: scene === 'try'
				? t < 2700
					? 0
					: Math.min(1, (t - 2700) / 2000)
				: 1
	);
	const ticked = $derived(Math.round(frac * total));
	const fare = $derived('$' + (ticked * PRICE).toFixed(4));
	const perDay = $derived(tx.perDay.replace('{cost}', '$' + Math.round(total * PRICE * 10000)));

	// ---- the phone chat ----
	const qLines = $derived(wrap(ask.question, 16));
	const qH = $derived(qLines.length * 9.5 + 8);
	const rTop = $derived(46 + qH + 8);
	const rLines = $derived.by(() => {
		const all = wrap(ask.reply, 19);
		const max = Math.floor((196 - rTop - 8) / 9.5);
		if (all.length <= max) return all;
		const keep = all.slice(0, max);
		keep[max - 1] = keep[max - 1] + '...';
		return keep;
	});

	const LIT: Record<Scene, string[]> = {
		app: ['phone'],
		provider: ['phone', 'provider', 'wire'],
		request: ['phone', 'wire', 'card'],
		key: ['wire', 'card'],
		tokens: ['provider', 'card'],
		response: ['phone', 'wire', 'card', 'provider'],
		meter: ['card', 'meter'],
		remember: ['meter'],
		try: ['phone', 'wire', 'card', 'provider', 'meter']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	function toggle() {
		long = !long;
		onstate?.(long ? 'long' : 'short');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={toggle}>
				{long ? tx.shortBtn : tx.longBtn}
			</button>
		{/if}
		<svg viewBox="0 0 360 330" class="pic" role="img" aria-label={tx.picture}>
			<!-- the internet line between the app and the provider -->
			<g class="part" class:dim={!lit('wire')}>
				<path d="M114 92 H252" class="wire" class:off={active < 1} />
			</g>

			<!-- the phone with the nimbus app -->
			<g class="part" class:dim={!lit('phone')}>
				<text x="63" y="12" text-anchor="middle" class="label">{tx.appLabel}</text>
				<rect x="12" y="18" width="102" height="190" rx="16" class="phone" />
				<rect x="19" y="28" width="88" height="172" rx="10" class="screen" />
				<text x="27" y="40" class="brand">{tx.appName}</text>
				<path d="M23 44 H103" class="rule-line" />
				{#if qShown}
					<g class="pop">
						<rect x="31" y="46" width="72" height={qH} rx="7" class="qbub" />
						{#each qLines as l, k (k)}
							<text x="36" y={56 + k * 9.5} class="qtext">{l}</text>
						{/each}
					</g>
				{/if}
				{#if replyShown}
					<g class="pop">
						<rect x="23" y={rTop} width="80" height={rLines.length * 9.5 + 8} rx="7" class="rbub" />
						{#each rLines as l, k (k)}
							<text x="28" y={rTop + 10 + k * 9.5} class="rtext">{l}</text>
						{/each}
					</g>
				{/if}
			</g>

			<!-- the AI provider -->
			<g class="part" class:dim={!lit('provider')}>
				<text x="300" y="12" text-anchor="middle" class="label">{tx.providerLabel}</text>
				<rect x="252" y="18" width="96" height="124" rx="10" class="rack" />
				{#each [28, 48] as y (y)}
					<rect x="260" {y} width="80" height="14" rx="4" class="unit" />
					<circle cx="330" cy={y + 7} r="2.4" class="led" class:blink={thinking} />
				{/each}
				<g class="chip" class:busy={thinking}>
					<rect x="274" y="76" width="52" height="52" rx="8" class="chipbody" />
					{#each [86, 96, 106, 116] as y (y)}
						<path d="M268 {y} H274 M326 {y} H332" class="pin" />
					{/each}
					<text x="300" y="105" text-anchor="middle" class="chiptext">{tx.modelLabel}</text>
				</g>
			</g>

			<!-- the envelope -->
			{#if env.show}
				<g transform="translate({env.x} 82)" class="env">
					<rect width="24" height="17" rx="3" class="envbody" />
					<path d="M1 2 L12 10 L23 2" class="envflap" />
					{#if env.key}
						<g transform="translate(16 -9)" class="keyicon">
							<circle cx="3" cy="4" r="3.2" />
							<path d="M6 4 H13 M10 4 V7 M12.5 4 V6.5" />
						</g>
					{/if}
				</g>
			{/if}

			<!-- the code card -->
			{#if card !== 'none'}
				<g class="part" class:dim={!lit('card')}>
					<rect x="12" y="220" width="228" height="104" rx="10" class="card" />
					<text x="22" y="237" class="cardtitle"
						>{card === 'request'
							? tx.requestTitle
							: card === 'response'
								? tx.responseTitle
								: tx.tokensTitle}</text
					>
					{#if card === 'tokens'}
						{#each chips.slice(0, chipsShown) as c (c.x)}
							<g class="pop">
								<rect x={c.x} y="250" width={c.w} height="22" rx="6" class="tok" />
								<text x={c.x + c.w / 2} y="265" text-anchor="middle" class="toktext">{c.c}</text>
							</g>
						{/each}
						{#if chipsShown === chips.length}
							<text x="22" y="300" class="count"
								>{tx.tokensCount.replace('{n}', String(chips.length))}</text
							>
						{/if}
					{:else}
						{#each lines.slice(0, linesShown) as l, k (k)}
							{#if hot(k)}
								<rect
									x="18"
									y={246 + k * 15}
									width="216"
									height="14"
									rx="3"
									class="hot"
									class:key={k === 1 && card === 'request'}
								/>
							{/if}
							<text x="22" y={256 + k * 15} class="code">{l}</text>
						{/each}
					{/if}
				</g>
			{/if}

			<!-- the taxi meter -->
			{#if meterOn}
				<g class="part pop" class:dim={!lit('meter')}>
					{#if scene === 'remember'}
						<rect x="270" y="204" width="58" height="16" rx="4" class="roof" />
						<text x="299" y="215.5" text-anchor="middle" class="roofText">{tx.memo}</text>
					{/if}
					<rect x="250" y="220" width="98" height="104" rx="12" class="meter" />
					<text x="299" y="238" text-anchor="middle" class="label">{tx.meterTitle}</text>
					<rect x="258" y="246" width="82" height="34" rx="6" class="display" />
					<text x="299" y="268" text-anchor="middle" class="digits"
						>{tx.meterTokens.replace('{n}', String(ticked))}</text
					>
					<text x="299" y="306" text-anchor="middle" class="fare">{fare}</text>
				</g>
			{/if}
		</svg>
		{#if scene === 'remember'}
			<p class="rule">{tx.rule}</p>
		{:else if scene === 'meter' || (scene === 'try' && frac >= 1)}
			<p class="note">{perDay}</p>
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
		max-width: 440px;
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
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.note {
		margin: 0;
		max-width: 340px;
		text-align: center;
		font-size: 13px;
		color: var(--color-muted);
	}
	.part {
		transition: opacity 0.4s;
	}
	.part.dim {
		opacity: 0.35;
	}
	.label {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
	}
	.wire {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.5;
		stroke-linecap: round;
		transition: stroke 0.4s;
	}
	.wire.off {
		stroke: var(--color-line);
	}
	.phone {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.screen {
		fill: var(--color-paper);
	}
	.brand {
		fill: var(--color-brand);
		font-size: 10px;
		font-weight: 800;
	}
	.rule-line {
		stroke: var(--color-line);
		stroke-width: 1;
	}
	.qbub {
		fill: var(--color-brand);
	}
	.qtext {
		fill: var(--color-card);
		font-size: 7.2px;
		font-weight: 600;
	}
	.rbub {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.rtext {
		fill: var(--color-ink);
		font-size: 7px;
	}
	.rack {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.unit {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.led.blink {
		animation: blink 0.5s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.2;
		}
	}
	.chipbody {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.chip.busy .chipbody {
		animation: glow 1s ease-in-out infinite;
	}
	@keyframes glow {
		50% {
			fill: var(--color-brand);
		}
	}
	.pin {
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.chiptext {
		fill: var(--color-brand);
		font-size: 10px;
		font-weight: 800;
	}
	.envbody {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.envflap {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.3;
		stroke-linejoin: round;
	}
	.keyicon circle,
	.keyicon path {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.cardtitle {
		fill: var(--color-brand);
		font-size: 9.5px;
		font-weight: 800;
	}
	.code {
		fill: var(--color-ink);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 7.6px;
	}
	.hot {
		fill: var(--color-grass-soft);
	}
	.hot.key {
		fill: var(--color-amber-soft);
	}
	.tok {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.toktext {
		fill: var(--color-brand);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9px;
		font-weight: 700;
	}
	.count {
		fill: var(--color-muted);
		font-size: 9.5px;
		font-weight: 700;
	}
	.meter {
		fill: var(--color-card);
		stroke: var(--color-amber);
		stroke-width: 1.8;
	}
	.display {
		fill: var(--color-ink);
	}
	.digits {
		fill: var(--color-paper);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11px;
		font-weight: 700;
	}
	.fare {
		fill: var(--color-amber);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		font-weight: 800;
	}
	.roof {
		fill: var(--color-amber);
	}
	.roofText {
		fill: var(--color-card);
		font-size: 8.5px;
		font-weight: 800;
	}
	.pop {
		animation: pop 0.4s ease both;
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
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.wire {
			transition: none;
		}
		.pop,
		.led.blink,
		.chip.busy .chipbody {
			animation: none;
		}
	}
</style>
