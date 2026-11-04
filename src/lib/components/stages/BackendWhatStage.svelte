<script lang="ts">
	// Guided "watch" stage. One order travels by itself from the phone (frontend) into the
	// backend server, visiting four drawers (who is it, in stock, save, send receipt), while the
	// database and the email box light up beside it. Nim's beat picks the moment in focus.
	// The only optional play, on the last beat, is logging out and watching the order get stopped.
	import Guide from '$lib/components/Guide.svelte';
	import SvgPhone from '$lib/components/stages/backend-guided/SvgPhone.svelte';
	import { sceneClock } from '$lib/components/stages/backend-guided/clock.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BackendWhatText, BackendStationId } from '$lib/chapters/web/backend-what/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BackendWhatText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const lastBeat = $derived(tx.intro.length - 1);
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(beat >= lastBeat && peek === null);

	let loggedOut = $state(false);
	function toggleLogin() {
		loggedOut = !loggedOut;
		onstate?.(loggedOut ? 'loggedOut' : 'loggedIn');
	}

	const clock = sceneClock(() => [step, loggedOut]);

	const STATIONS: BackendStationId[] = ['who', 'stock', 'save', 'mail'];
	const drawerY = (i: number) => 70 + i * 42;

	/** The order's journey, 0 on the phone, 1 arrived, 2 to 5 at a drawer, 6 done. */
	function loop(t: number, out: boolean, reduced: boolean) {
		if (out) return reduced ? 2 : Math.min(2, Math.floor((t % 4600) / 1000));
		return reduced ? 6 : Math.min(6, Math.floor((t % 8400) / 1000));
	}
	const phase = $derived.by(() => {
		const t = clock.t;
		switch (step) {
			case 0:
				return 0;
			case 1:
				return t < 900 ? 0 : 1;
			case 2:
				return 1;
			case 3:
				return t < 700 ? 1 : 2;
			case 4:
				return t < 700 ? 2 : 3;
			case 5:
				return t < 900 ? 4 : t < 2200 ? 5 : 6;
			case 7:
				return 6;
			default:
				return loop(t, live && loggedOut, clock.reduced);
		}
	});
	const fail = $derived(live && loggedOut && phase >= 2);

	const status = $derived(
		fail ? 'rejected' : phase === 0 ? 'idle' : phase === 6 ? 'done' : 'waiting'
	);
	const ticket = $derived(
		phase === 0
			? { x: 70, y: 226, o: 0 }
			: phase === 1
				? { x: 170, y: drawerY(0) + 17, o: 1 }
				: { x: 170, y: drawerY(Math.min(3, phase - 2)) + 17, o: phase === 6 ? 0 : 1 }
	);
	function drawer(i: number) {
		if (fail && i === 0) return 'bad';
		if (fail) return 'idle';
		if (phase - 2 === i) return 'active';
		if (phase - 2 > i) return 'ok';
		return 'idle';
	}
	const dbOn = $derived(!fail && (phase === 3 || phase === 4));
	const newRow = $derived(!fail && phase >= 4);
	const mailOn = $derived(!fail && phase === 5);
	const rooms = $derived(step === 6);
</script>

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 360 280"
			class="mx-auto block w-full max-w-[420px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- captions -->
			<text x="70" y="24" text-anchor="middle" class="cap" class:hl={step === 0}>
				{tx.frontLabel}
			</text>
			<text x="70" y="40" text-anchor="middle" class="sub" class:room={rooms}>
				{rooms ? tx.roomFront : tx.frontSub}
			</text>
			<text x="236" y="24" text-anchor="middle" class="cap" class:hl={step === 2}>
				{tx.backLabel}
			</text>
			<text x="236" y="40" text-anchor="middle" class="sub" class:room={rooms}>
				{rooms ? tx.roomBack : tx.backSub}
			</text>
			<line x1="140" y1="12" x2="140" y2="272" class="divider" />

			<!-- the wire between them, the API on its beat -->
			<line x1="122" y1="160" x2="158" y2="160" class="wire" class:on={step === 7} />
			{#if step === 7}
				<g class="fade">
					<rect x="122" y="138" width="36" height="16" rx="8" class="apiTag" />
					<text x="140" y="150" text-anchor="middle" class="apiT">{tx.apiLabel}</text>
				</g>
			{/if}

			<!-- you, the phone -->
			<SvgPhone x={18} y={62} w={104} h={200} focus={step === 0}>
				<path d="M27 52a18 17 0 0 1 36 0Z" class="capTop" />
				<rect x="21" y="50" width="48" height="6" rx="3" class="capBrim" />
				<circle cx="45" cy="34" r="2.5" class="capTop" />
				<text x="45" y="84" text-anchor="middle" class="prod">{tx.product}</text>
				<text x="45" y="99" text-anchor="middle" class="price">{tx.price}</text>
				<text x="45" y="124" text-anchor="middle" class="status {status}">
					{tx.phone[status]}
				</text>
				<rect
					x="10"
					y="136"
					width="70"
					height="24"
					rx="12"
					class="buy"
					class:wait={status === 'waiting'}
				/>
				<text x="45" y="152" text-anchor="middle" class="buyT">{tx.buy}</text>
				{#if status === 'done'}
					<g class="fade" transform="translate(66 6)">
						<rect width="18" height="13" rx="2" class="env" />
						<path d="M1 1l8 6 8-6" class="envFlap" />
					</g>
				{/if}
			</SvgPhone>

			<!-- the backend, a server with four drawers -->
			<g class="dimmable" class:dim={step === 0}>
				<rect
					x="158"
					y="58"
					width="130"
					height="184"
					rx="10"
					class="rack"
					class:focus={step === 2}
				/>
				{#each STATIONS as id, i (id)}
					{@const st = drawer(i)}
					<g>
						<rect x="182" y={drawerY(i)} width="98" height="34" rx="6" class="drawer {st}" />
						<circle cx="194" cy={drawerY(i) + 17} r="4" class="led {st}" />
						<text x="204" y={drawerY(i) + 21} class="dT">{tx.stations[id]}</text>
					</g>
				{/each}

				<!-- the email box -->
				<line x1="288" y1="92" x2="304" y2="92" class="wire" class:on={mailOn} />
				<rect x="304" y="78" width="40" height="28" rx="4" class="env" class:on={mailOn} />
				<path d="M306 80l18 13 18-13" class="envFlap" />
				<text x="324" y="122" text-anchor="middle" class="sub">{tx.mailLabel}</text>

				<!-- the database -->
				<line x1="288" y1="196" x2="302" y2="196" class="wire" class:on={dbOn} />
				<path d="M302 178v48a22 7 0 0 0 44 0v-48" class="db" class:on={dbOn} />
				<ellipse cx="324" cy="178" rx="22" ry="7" class="db" class:on={dbOn} />
				<line x1="312" y1="196" x2="336" y2="196" class="row" />
				<line x1="312" y1="206" x2="332" y2="206" class="row" />
				{#if newRow}
					<line x1="312" y1="216" x2="338" y2="216" class="row new fade" />
				{/if}
				<text x="324" y="252" text-anchor="middle" class="sub">{tx.dbLabel}</text>
			</g>

			<!-- the order note, travelling -->
			<g class="move" style="transform:translate({ticket.x}px, {ticket.y}px);opacity:{ticket.o}">
				<rect x="-9" y="-7" width="18" height="14" rx="2" class="note" class:bad={fail} />
				<line x1="-5" y1="-2" x2="5" y2="-2" class="noteL" />
				<line x1="-5" y1="2" x2="2" y2="2" class="noteL" />
			</g>
			<!-- the receipt, flying back to the phone -->
			<g
				class="move slow"
				style="transform:translate({mailOn ? 92 : 316}px, {mailOn ? 84 : 84}px);opacity:{mailOn
					? 1
					: 0}"
			>
				<rect width="18" height="13" rx="2" class="env on" />
				<path d="M1 1l8 6 8-6" class="envFlap" />
			</g>
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={loggedOut} onclick={toggleLogin}>
					{loggedOut ? tx.loginBtn : tx.logoutBtn}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.move {
		transition:
			transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.4s;
	}
	.move.slow {
		transition:
			transform 1.1s cubic-bezier(0.45, 0, 0.2, 1),
			opacity 0.3s;
	}
	.fade {
		animation: fadeIn 0.45s ease-out;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
	}
	.dimmable {
		transition: opacity 0.5s;
	}
	.dimmable.dim {
		opacity: 0.35;
	}
	.cap {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.cap.hl {
		fill: var(--color-brand);
	}
	.sub {
		font-size: 11px;
		fill: var(--color-faint);
	}
	.sub.room {
		fill: var(--color-grass);
		font-weight: 700;
	}
	.divider {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke 0.3s;
	}
	.wire.on {
		stroke: var(--color-brand);
	}
	.apiTag {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.apiT {
		font-size: 10px;
		font-weight: 800;
		fill: var(--color-brand);
	}
	.capTop {
		fill: var(--color-brand);
	}
	.capBrim {
		fill: var(--color-brand);
		opacity: 0.7;
	}
	.prod {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.price {
		font-size: 10px;
		fill: var(--color-muted);
	}
	.status {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.status.waiting {
		fill: var(--color-amber);
	}
	.status.done {
		fill: var(--color-grass);
	}
	.status.rejected {
		fill: var(--color-danger);
	}
	.buy {
		fill: var(--color-brand);
		transition: fill 0.3s;
	}
	.buy.wait {
		fill: var(--color-faint);
	}
	.buyT {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-card);
	}
	.rack {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.4s;
	}
	.rack.focus {
		stroke: var(--color-brand);
		stroke-width: 3;
	}
	.drawer {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.drawer.active {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.drawer.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.led {
		fill: var(--color-line);
		transition: fill 0.3s;
	}
	.led.active {
		fill: var(--color-amber);
		animation: blink 0.8s ease-in-out infinite;
	}
	.led.ok {
		fill: var(--color-grass);
	}
	.led.bad {
		fill: var(--color-danger);
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}
	.dT {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.env {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.env.on {
		stroke: var(--color-brand);
		fill: var(--color-brand-soft);
	}
	.envFlap {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.db {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
		transition: stroke-width 0.3s;
	}
	.db.on {
		stroke-width: 3.5;
	}
	.row {
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.6;
	}
	.row.new {
		stroke: var(--color-grass);
		opacity: 1;
	}
	.note {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.note.bad {
		stroke: var(--color-danger);
	}
	.noteL {
		stroke: var(--color-faint);
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.play {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.play.on {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	@media (prefers-reduced-motion: reduce) {
		.move,
		.move.slow,
		.dimmable,
		.wire,
		.drawer,
		.led,
		.buy {
			transition: none;
		}
		.fade,
		.led.active {
			animation: none;
		}
	}
</style>
