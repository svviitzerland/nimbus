<script lang="ts">
	// A guided "watch" stage. A little robot (the agent) sits inside its loop of think, act, and
	// check, with a calendar app beside it and a permission card underneath. The beats play the
	// story by themselves, a chatbot only answers with words, the agent thinks, calls the calendar
	// tool, sees ten is taken, re plans to eleven, asks permission, and books it. The only optional
	// play is allowing or denying the booking on the last beat.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { AgentsText } from '$lib/chapters/ai/agents/types';
	import { phaseAt, sceneClock, wrap } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as AgentsText);

	type Scene = 'ask' | 'tools' | 'think' | 'act' | 'check' | 'permit' | 'done' | 'remember' | 'try';
	const SCENES: Scene[] = [
		'ask',
		'tools',
		'think',
		'act',
		'check',
		'permit',
		'done',
		'remember',
		'try'
	];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
	type Node = 'think' | 'act' | 'check';

	let peek = $state<number | null>(null);
	let decision = $state<'allow' | 'deny' | null>(null);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, decision]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	// the agent's thought bubble
	const thought = $derived(
		scene === 'think' && t > 500
			? tx.think1
			: scene === 'check' && t > 400
				? tx.think2
				: scene === 'permit'
					? tx.think3
					: ''
	);
	const thinking = $derived(scene === 'think' && t <= 500);

	// the tool call travelling to the calendar and back
	const trip = $derived(
		phaseAt(
			[
				{ ph: 'wait', ms: 300 },
				{ ph: 'go', ms: 1400 },
				{ ph: 'back', ms: 1400 },
				{ ph: 'hold', ms: 1 }
			],
			t,
			false
		)
	);
	const packet = $derived(
		scene === 'act' && !clock.reduced && (trip.ph === 'go' || trip.ph === 'back')
			? trip.ph === 'go'
				? 147 + 53 * trip.p
				: 200 - 53 * trip.p
			: null
	);
	const callShown = $derived(scene === 'act' && trip.ph !== 'wait');
	const resultShown = $derived(scene === 'act' && (trip.ph === 'back' || trip.ph === 'hold'));
	const calBusy = $derived(scene === 'act' && trip.ph === 'go' && trip.p > 0.7);

	// which step of the loop is in focus
	const cycle = $derived(
		phaseAt<Node>(
			[
				{ ph: 'think', ms: 900 },
				{ ph: 'act', ms: 900 },
				{ ph: 'check', ms: 900 }
			],
			t
		).ph
	);
	const node = $derived<Node | 'all' | null>(
		scene === 'think'
			? 'think'
			: scene === 'act'
				? 'act'
				: scene === 'check' || scene === 'permit'
					? 'check'
					: scene === 'remember'
						? clock.reduced
							? 'all'
							: cycle
						: scene === 'done'
							? 'all'
							: null
	);
	const nodeOn = (n: Node) => node === 'all' || node === n;

	// the calendar and the booking
	const flagged = $derived(scene === 'check' || scene === 'permit');
	const booked = $derived(
		(scene === 'done' && t > 1000) ||
			scene === 'remember' ||
			(scene === 'try' && decision === 'allow')
	);
	const showArm = $derived(active >= 1);

	// the bottom area
	type Bottom = 'chat' | 'chips' | 'dialog' | 'final' | 'none';
	const bottom = $derived<Bottom>(
		scene === 'ask'
			? 'chat'
			: scene === 'act'
				? 'chips'
				: scene === 'permit'
					? 'dialog'
					: scene === 'done'
						? t > 1000
							? 'final'
							: 'dialog'
						: scene === 'remember'
							? 'final'
							: scene === 'try'
								? decision
									? 'final'
									: 'dialog'
								: 'none'
	);
	const pressed = $derived(scene === 'done' && t > 300 && t <= 1000);
	const finalText = $derived(scene === 'try' && decision === 'deny' ? tx.finalDeny : tx.finalAllow);

	const LIT: Record<Scene, string[]> = {
		ask: ['you', 'bottom'],
		tools: ['agent', 'calendar'],
		think: ['agent'],
		act: ['agent', 'calendar', 'bottom'],
		check: ['agent', 'calendar'],
		permit: ['agent', 'bottom'],
		done: ['calendar', 'bottom'],
		remember: ['agent', 'calendar', 'bottom'],
		try: ['calendar', 'bottom']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	const HOURS = ['09:00', '10:00', '11:00', '12:00'];
	const NODES: { id: Node; x: number; y: number; lx: number; ly: number }[] = [
		{ id: 'think', x: 95, y: 123, lx: 95, ly: 115 },
		{ id: 'act', x: 140, y: 201, lx: 140, ly: 221 },
		{ id: 'check', x: 50, y: 201, lx: 50, ly: 221 }
	];

	function decide(d: 'allow' | 'deny') {
		decision = d;
		onstate?.(d);
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<div class="acts">
				{#if decision}
					<button type="button" class="act ghost" onclick={() => (decision = null)}>
						{tx.again}
					</button>
				{:else}
					<button type="button" class="act ghost" onclick={() => decide('deny')}>{tx.deny}</button>
					<button type="button" class="act" onclick={() => decide('allow')}>{tx.allow}</button>
				{/if}
			</div>
		{/if}
		<svg viewBox="0 0 360 372" class="pic" role="img" aria-label={tx.picture}>
			<!-- what you asked -->
			<g class="part" class:dim={!lit('you')}>
				<circle cx="18" cy="24" r="12" class="you" />
				<circle cx="18" cy="20" r="4" class="youhead" />
				<path d="M10 32 Q18 24 26 32" class="youbody" />
				<g class="rise" class:still={clock.reduced || scene !== 'ask'}>
					<rect x="38" y="8" width="314" height="32" rx="12" class="request" />
					<text x="50" y="28" class="reqtext">{tx.goal}</text>
				</g>
			</g>

			<!-- the agent inside its loop -->
			<g class="part" class:dim={!lit('agent')}>
				{#if thought}
					{@const lines = wrap(thought, 32)}
					<g class="rise" class:still={clock.reduced}>
						<rect
							x="8"
							y="52"
							width="176"
							height={lines.length * 12 + 14}
							rx="12"
							class="thought"
						/>
						{#each lines as l, k (k)}
							<text x="18" y={68 + k * 12} class="thinktext">{l}</text>
						{/each}
					</g>
				{/if}
				<circle cx="95" cy="175" r="52" class="ring" />
				{#if (scene === 'remember' || scene === 'done') && !clock.reduced}
					<circle r="3.5" class="spark">
						<animateMotion
							dur="2.7s"
							repeatCount="indefinite"
							path="M95 123 A52 52 0 1 1 94.9 123"
						/>
					</circle>
				{/if}
				{#each NODES as n (n.id)}
					<circle cx={n.x} cy={n.y} r="6.5" class="node" class:on={nodeOn(n.id)} />
					<text x={n.lx} y={n.ly} text-anchor="middle" class="nodelabel" class:on={nodeOn(n.id)}
						>{tx.loop[n.id]}</text
					>
				{/each}
				<!-- the robot -->
				<path d="M95 158 V149" class="antenna" />
				<circle cx="95" cy="147" r="3.2" class="bulb" class:blink={thinking && !clock.reduced} />
				<rect x="73" y="158" width="44" height="34" rx="10" class="head" />
				{#if thinking && !clock.reduced}
					{#each [0, 1, 2] as k (k)}
						<circle
							cx={86 + k * 9}
							cy="175"
							r="2.6"
							class="dot"
							style="animation-delay:{k * 0.18}s"
						/>
					{/each}
				{:else}
					<circle cx="86" cy="173" r="3.5" class="eye" />
					<circle cx="104" cy="173" r="3.5" class="eye" />
					<path d="M89 183 Q95 186 101 183" class="mouth" />
				{/if}
				{#if scene === 'remember'}
					<text x="95" y="244" text-anchor="middle" class="memo">{tx.memo}</text>
				{/if}
			</g>

			<!-- the arm reaching to the tool -->
			{#if showArm}
				<g class="part" class:dim={!lit('agent') && !lit('calendar')}>
					<path d="M117 178 H200" class="arm" class:reach={scene === 'tools' && !clock.reduced} />
					<circle cx="200" cy="178" r="4" class="hand" />
					{#if packet !== null}
						<circle cx={packet} cy="178" r="4.5" class="packet" class:back={trip.ph === 'back'} />
					{/if}
				</g>
			{/if}

			<!-- the calendar tool -->
			<g class="part" class:dim={!lit('calendar')}>
				<rect x="200" y="52" width="152" height="178" rx="12" class="cal" class:busycal={calBusy} />
				<path d="M200 80 H352" class="sep" />
				<rect x="212" y="60" width="13" height="13" rx="3" class="calicon" />
				<text x="231" y="71" class="caltitle">{tx.calendarLabel}</text>
				<text x="342" y="71" text-anchor="end" class="day">{tx.day}</text>
				{#each HOURS as h, k (h)}
					{@const y = 88 + k * 34}
					<text x="210" y={y + 17} class="hour">{h}</text>
					{#if k === 1}
						<rect
							x="246"
							{y}
							width="98"
							height="26"
							rx="6"
							class="slot sync"
							class:flag={flagged}
						/>
						<text x="254" y={y + 17} class="slottext">{tx.teamSync}</text>
					{:else if k === 2 && booked}
						<g class="rise" class:still={clock.reduced}>
							<rect x="246" {y} width="98" height="26" rx="6" class="slot raka" />
							<text x="254" y={y + 17} class="slottext light">{tx.withRaka}</text>
						</g>
					{:else}
						<rect
							x="246"
							{y}
							width="98"
							height="26"
							rx="6"
							class="slot free"
							class:pick={k === 2 && flagged}
						/>
						<text x="254" y={y + 17} class="freetext">{tx.free}</text>
					{/if}
				{/each}
			</g>

			<!-- the bottom area, a chatbot reply, the tool call, the permission card, or the result -->
			<g class="part" class:dim={!lit('bottom')}>
				{#if bottom === 'chat'}
					{@const lines = wrap(tx.chatOnly, 54)}
					<g class="rise" class:still={clock.reduced}>
						<text x="26" y="264" class="tag">{tx.chatbotLabel}</text>
						<rect
							x="24"
							y="270"
							width="312"
							height={lines.length * 13 + 14}
							rx="10"
							class="bubble"
						/>
						{#each lines as l, k (k)}
							<text x="34" y={286 + k * 13} class="bubbletext">{l}</text>
						{/each}
					</g>
				{:else if bottom === 'chips'}
					{#if callShown}
						<g class="rise" class:still={clock.reduced}>
							<rect x="40" y="262" width="280" height="26" rx="8" class="chip" />
							<text x="52" y="279" class="code">{tx.call}</text>
						</g>
					{/if}
					{#if resultShown}
						<g class="rise" class:still={clock.reduced}>
							<rect x="40" y="296" width="280" height="26" rx="8" class="chip ok" />
							<text x="52" y="313" class="code ok">{tx.result}</text>
						</g>
					{/if}
				{:else if bottom === 'dialog'}
					<g class="rise" class:still={clock.reduced || scene === 'done'}>
						<rect x="24" y="262" width="312" height="92" rx="14" class="dialog" />
						<circle cx="46" cy="286" r="9" class="lock" />
						<path d="M42 285 V282 Q46 277 50 282 V285" class="shackle" />
						<text x="62" y="290" class="dq">{tx.approvalQ}</text>
						<rect x="136" y="312" width="86" height="28" rx="14" class="deny" />
						<text x="179" y="330" text-anchor="middle" class="denytext">{tx.deny}</text>
						<rect
							x="232"
							y="312"
							width="92"
							height="28"
							rx="14"
							class="allow"
							class:pressed
							class:wait={scene === 'permit' && !clock.reduced}
						/>
						<text x="278" y="330" text-anchor="middle" class="allowtext">{tx.allow}</text>
					</g>
				{:else if bottom === 'final'}
					{@const lines = wrap(finalText, 54)}
					<g class="rise" class:still={clock.reduced || scene === 'remember'}>
						<text x="26" y="264" class="tag agent">{tx.agentLabel}</text>
						<rect
							x="24"
							y="270"
							width="312"
							height={lines.length * 13 + 14}
							rx="10"
							class="bubble"
							class:good={finalText === tx.finalAllow}
						/>
						{#each lines as l, k (k)}
							<text x="34" y={286 + k * 13} class="bubbletext">{l}</text>
						{/each}
					</g>
				{/if}
			</g>
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
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.pic {
		display: block;
		width: 100%;
		height: auto;
		max-height: 62vh;
	}
	.acts {
		display: flex;
		gap: 8px;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand);
		padding: 7px 18px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-card);
	}
	.act.ghost {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.part {
		transition: opacity 0.4s;
	}
	.part.dim {
		opacity: 0.35;
	}
	.rise {
		animation: rise 0.45s ease both;
	}
	.rise.still {
		animation: none;
	}
	@keyframes rise {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	.you {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.youhead {
		fill: var(--color-amber);
	}
	.youbody {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.request {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.reqtext {
		fill: var(--color-ink);
		font-size: 10px;
		font-weight: 700;
	}
	.thought {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-opacity: 0.5;
		stroke-width: 1.4;
	}
	.thinktext {
		fill: var(--color-ink);
		font-size: 8.6px;
		font-weight: 600;
		font-style: italic;
	}
	.ring {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 3;
	}
	.spark {
		fill: var(--color-grass);
	}
	.node {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 2;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.node.on {
		fill: var(--color-grass);
		stroke: var(--color-grass);
	}
	.nodelabel {
		fill: var(--color-faint);
		font-size: 9.5px;
		font-weight: 800;
		transition: fill 0.3s;
	}
	.nodelabel.on {
		fill: var(--color-grass);
	}
	.antenna {
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.bulb {
		fill: var(--color-amber);
	}
	.bulb.blink {
		animation: blink 0.8s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}
	.head {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.eye {
		fill: var(--color-brand);
	}
	.mouth {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.dot {
		fill: var(--color-brand);
		animation: bob 0.9s ease-in-out infinite;
	}
	@keyframes bob {
		50% {
			transform: translateY(-3px);
		}
	}
	.memo {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
	}
	.arm {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.arm.reach {
		transform-box: view-box;
		transform-origin: 117px 178px;
		animation: reach 0.9s ease-out both;
	}
	@keyframes reach {
		from {
			transform: scaleX(0);
		}
		to {
			transform: none;
		}
	}
	.hand {
		fill: var(--color-ink);
	}
	.packet {
		fill: var(--color-brand);
	}
	.packet.back {
		fill: var(--color-grass);
	}
	.cal {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.cal.busycal {
		stroke: var(--color-brand);
	}
	.sep {
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.calicon {
		fill: var(--color-danger);
	}
	.caltitle {
		fill: var(--color-ink);
		font-size: 10px;
		font-weight: 800;
	}
	.day {
		fill: var(--color-muted);
		font-size: 9.5px;
		font-weight: 700;
	}
	.hour {
		fill: var(--color-faint);
		font-size: 8.5px;
		font-weight: 700;
	}
	.slot {
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.slot.free {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.slot.free.pick {
		stroke: var(--color-grass);
		fill: var(--color-grass-soft);
	}
	.slot.sync {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.slot.sync.flag {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.slot.raka {
		fill: var(--color-grass);
		stroke: var(--color-grass);
	}
	.slottext {
		fill: var(--color-ink);
		font-size: 9px;
		font-weight: 800;
	}
	.slottext.light {
		fill: var(--color-card);
	}
	.freetext {
		fill: var(--color-faint);
		font-size: 8.5px;
		font-weight: 600;
	}
	.tag {
		fill: var(--color-faint);
		font-size: 8px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.tag.agent {
		fill: var(--color-brand);
	}
	.bubble {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.bubble.good {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-opacity: 0.5;
	}
	.bubbletext {
		fill: var(--color-ink);
		font-size: 9px;
		font-weight: 600;
	}
	.chip {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-opacity: 0.4;
	}
	.chip.ok {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.code {
		fill: var(--color-brand);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9px;
		font-weight: 700;
	}
	.code.ok {
		fill: var(--color-grass);
	}
	.dialog {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.lock {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.shackle {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.dq {
		fill: var(--color-ink);
		font-size: 10px;
		font-weight: 800;
	}
	.deny {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.denytext {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
	}
	.allow {
		fill: var(--color-brand);
		transition: fill 0.2s;
	}
	.allow.wait {
		animation: blink 1.6s ease-in-out infinite;
	}
	.allow.pressed {
		fill: var(--color-grass);
	}
	.allowtext {
		fill: var(--color-card);
		font-size: 10px;
		font-weight: 800;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.node,
		.nodelabel,
		.cal,
		.slot,
		.allow {
			transition: none;
		}
		.rise,
		.bulb.blink,
		.dot,
		.arm.reach,
		.allow.wait {
			animation: none;
		}
	}
</style>
