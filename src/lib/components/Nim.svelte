<script lang="ts">
	// Nim, the little cloud in a hard hat. Nim is alive, not a sticker. Nim floats and breathes,
	// blinks now and then, looks toward your pointer, moves the mouth while a line is being
	// spoken (`talking`), does a small hop whenever the mood changes, and giggles when poked.
	// Everything calms down for people who prefer reduced motion.
	import { onMount } from 'svelte';
	import type { Mood } from '$lib/chapters/types';

	let {
		mood = 'calm',
		size = 76,
		talking = false,
		lively = true
	}: {
		mood?: Mood;
		size?: number;
		/** Mouth moves like Nim is speaking. */
		talking?: boolean;
		/** Blink, follow the pointer, and react to pokes. Off for tiny decorative uses. */
		lively?: boolean;
	} = $props();

	const sparkleEyes = $derived(mood === 'excited' || mood === 'idea');
	const openSmile = $derived(mood === 'excited' || mood === 'idea');
	// moods whose eyes are plain dots can blink and look around
	const roundEyes = $derived(!sparkleEyes && mood !== 'wink');

	let svg: SVGSVGElement | undefined = $state();
	let blink = $state(false);
	let look = $state({ x: 0, y: 0 });
	let giggle = $state(0);
	let reduced = $state(false);

	onMount(() => {
		reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
		if (!lively || reduced) return;
		let t: ReturnType<typeof setTimeout>;
		const nextBlink = () => {
			t = setTimeout(
				() => {
					blink = true;
					setTimeout(() => (blink = false), 140);
					nextBlink();
				},
				2200 + Math.random() * 3200
			);
		};
		nextBlink();
		// eyes drift back to the middle when the pointer has been still for a while
		let idle: ReturnType<typeof setTimeout>;
		const onMove = (e: PointerEvent) => {
			if (!svg) return;
			const r = svg.getBoundingClientRect();
			const dx = e.clientX - (r.left + r.width / 2);
			const dy = e.clientY - (r.top + r.height * 0.55);
			const d = Math.hypot(dx, dy) || 1;
			const pull = Math.min(1, d / 260);
			look = { x: (dx / d) * 2.4 * pull, y: (dy / d) * 1.8 * pull };
			clearTimeout(idle);
			idle = setTimeout(() => (look = { x: 0, y: 0 }), 3500);
		};
		window.addEventListener('pointermove', onMove, { passive: true });
		return () => {
			clearTimeout(t);
			clearTimeout(idle);
			window.removeEventListener('pointermove', onMove);
		};
	});

	/** A poke makes Nim giggle (a wiggle plus a little heart). */
	export function poke() {
		if (reduced) return;
		giggle += 1;
	}
	const giggling = $derived(giggle > 0);
	$effect(() => {
		if (!giggle) return;
		const t = setTimeout(() => (giggle = 0), 900);
		return () => clearTimeout(t);
	});
	const eyeT = $derived(
		`translate(${look.x.toFixed(2)}px, ${look.y.toFixed(2)}px)${blink && roundEyes ? ' scaleY(0.12)' : ''}`
	);
</script>

<svg
	bind:this={svg}
	width={size}
	height={size}
	viewBox="0 0 100 100"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class="nim"
	class:still={!lively || reduced}
	role="img"
	aria-label="Nim"
>
	<!-- soft shadow on the ground, it shrinks when Nim floats up -->
	<ellipse cx="50" cy="94" rx="24" ry="3.2" class="ground" />

	<g class="float">
		{#key mood}
			<g class="hop">
				<g class="body" class:giggle={giggling}>
					<!-- lightbulb (a fresh idea) -->
					{#if mood === 'idea'}
						<g class="bulb">
							<line x1="50" y1="3" x2="50" y2="6.5" class="ray" />
							<line x1="38.5" y1="8" x2="41" y2="10.5" class="ray" />
							<line x1="61.5" y1="8" x2="59" y2="10.5" class="ray" />
							<circle cx="50" cy="17" r="8" fill="#ffe08a" stroke="#dd9e36" stroke-width="1.4" />
							<rect x="46.5" y="23" width="7" height="3.6" rx="1.2" fill="#c9881f" />
						</g>
					{/if}

					<!-- little cloud arms, they wave when Nim is happy or excited -->
					<g class="arm left" class:wave={mood === 'excited'}>
						<circle cx="18" cy="70" r="6.5" class="puff" />
					</g>
					<g class="arm right" class:wave={mood === 'excited' || mood === 'happy'}>
						<circle cx="82" cy="70" r="6.5" class="puff" />
					</g>

					<!-- cloud body, with a soft shade at the bottom so it feels round -->
					<g class="cloud">
						<ellipse cx="50" cy="68" rx="33" ry="19" class="puff" />
						<circle cx="33" cy="60" r="15" class="puff" />
						<circle cx="50" cy="50" r="20" class="puff" />
						<circle cx="67" cy="60" r="15" class="puff" />
						<path d="M22 74 Q50 90 78 74 Q72 86 50 87 Q28 86 22 74 Z" class="shade" />
					</g>

					<!-- hard hat -->
					<g class="hat">
						<path d="M35 44a15 13 0 0 1 30 0Z" fill="#dd9e36" />
						<path
							d="M38 42a12 10 0 0 1 9 -9"
							stroke="#f3c56f"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<rect x="31" y="42" width="38" height="5" rx="2.5" fill="#dd9e36" />
						<rect x="47" y="30" width="6" height="8" rx="3" fill="#c9881f" />
					</g>

					<!-- eyes -->
					<g class="eyes" style="transform:{eyeT}">
						{#if mood === 'thinking'}
							<circle cx="44" cy="54.5" r="2.4" class="ink" />
							<circle cx="60" cy="54.5" r="2.4" class="ink" />
						{:else if mood === 'surprised'}
							<circle cx="43" cy="56" r="3.7" class="ink" />
							<circle cx="59" cy="56" r="3.7" class="ink" />
							<circle cx="44.3" cy="54.6" r="1.1" fill="#fff" />
							<circle cx="60.3" cy="54.6" r="1.1" fill="#fff" />
						{:else if mood === 'worried' || mood === 'sad'}
							<circle cx="43" cy="57" r="2.6" class="ink" />
							<circle cx="59" cy="57" r="2.6" class="ink" />
						{:else if sparkleEyes}
							<path
								d="M43 51.5l1.3 2.7 2.7 1.3-2.7 1.3-1.3 2.7-1.3-2.7-2.7-1.3 2.7-1.3z"
								class="ink sparkle"
							/>
							<path
								d="M59 51.5l1.3 2.7 2.7 1.3-2.7 1.3-1.3 2.7-1.3-2.7-2.7-1.3 2.7-1.3z"
								class="ink sparkle"
							/>
						{:else if mood === 'wink'}
							<path
								d="M40 56.5q3 3 6 0"
								stroke="#16212b"
								stroke-width="1.8"
								stroke-linecap="round"
							/>
							<circle cx="59" cy="56" r="2.8" class="ink" />
							<circle cx="60" cy="55" r="0.9" fill="#fff" />
						{:else}
							<circle cx="43" cy="56" r="2.8" class="ink" />
							<circle cx="59" cy="56" r="2.8" class="ink" />
							<circle cx="44" cy="55" r="0.9" fill="#fff" />
							<circle cx="60" cy="55" r="0.9" fill="#fff" />
						{/if}
					</g>

					<!-- brows carry most of the feeling -->
					{#if mood === 'thinking'}
						<path d="M40 49.5q4-3 8 0" class="brow" />
					{:else if mood === 'worried'}
						<path d="M39 51l7 2.4" class="brow" />
						<path d="M63 51l-7 2.4" class="brow" />
					{:else if mood === 'sad'}
						<path d="M40 53.5l6 -1.5" class="brow" />
						<path d="M60 53.5l-6 -1.5" class="brow" />
					{/if}

					<!-- cheeks, rosier when Nim is pleased -->
					<circle
						cx="36"
						cy="62"
						r="3.2"
						class="cheek"
						class:warm={mood === 'happy' || openSmile || giggling}
					/>
					<circle
						cx="64"
						cy="62"
						r="3.2"
						class="cheek"
						class:warm={mood === 'happy' || openSmile || giggling}
					/>

					<!-- mouth, it moves while Nim is speaking -->
					{#if talking && !reduced}
						<g class="talk">
							<ellipse cx="50" cy="64" rx="3.6" ry="3" class="ink" />
							<ellipse cx="50" cy="65.6" rx="2" ry="1" fill="#ff8f86" />
						</g>
					{:else if openSmile || giggling}
						<path d="M42 61q8 11 16 0z" class="ink" />
						<path d="M45.5 65.6q4.5 2.6 9 0q-4.5 -1.6 -9 0z" fill="#ff8f86" />
					{:else if mood === 'happy' || mood === 'wink'}
						<path d="M43 62q7 8 14 0" class="mouth" />
					{:else if mood === 'surprised'}
						<ellipse cx="50" cy="64.5" rx="2.8" ry="3.4" class="ink" />
					{:else if mood === 'worried'}
						<path d="M45 65q5 2 10 0" class="mouth thin" />
					{:else if mood === 'sad'}
						<path d="M44 66q6 -4.5 12 0" class="mouth thin" />
					{:else if mood === 'thinking'}
						<path d="M46 64.5q3 -1.6 7 0.4" class="mouth thin" />
					{:else}
						<path d="M45 63q5 4 10 0" class="mouth" />
					{/if}

					<!-- accessory -->
					{#if mood === 'worried'}
						<path d="M71 49q2.6 4 0 7q-2.6-3 0-7z" fill="#5aa9e6" class="drip" />
					{:else if mood === 'sad'}
						<path d="M41 60q1.8 3 0 5q-1.8-2 0-5z" fill="#5aa9e6" class="drip" />
					{:else if mood === 'excited'}
						<path
							d="M77 38l0.9 2.3 2.3 0.9-2.3 0.9-0.9 2.3-0.9-2.3-2.3-0.9 2.3-0.9z"
							fill="#dd9e36"
							class="twinkle"
						/>
						<path
							d="M23 42l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z"
							fill="#dd9e36"
							class="twinkle late"
						/>
					{:else if mood === 'thinking'}
						<circle cx="74" cy="40" r="1.6" class="dot d1" />
						<circle cx="79" cy="34" r="2.2" class="dot d2" />
						<circle cx="85" cy="27" r="2.8" class="dot d3" />
					{/if}
				</g>
			</g>
		{/key}
	</g>

	<!-- a tiny heart floats up after a poke -->
	{#if giggling}
		{#key giggle}
			<path
				d="M78 30c-2-3.4-7-2.2-7 1.4 0 2.8 4 5 7 7.4 3-2.4 7-4.6 7-7.4 0-3.6-5-4.8-7-1.4z"
				fill="#ff7a8a"
				class="heart"
			/>
		{/key}
	{/if}
</svg>

<style>
	.nim {
		overflow: visible;
		display: block;
	}
	.puff {
		fill: #fff;
	}
	.shade {
		fill: #dfe9f4;
		opacity: 0.7;
	}
	.ground {
		fill: rgba(22, 40, 60, 0.12);
		transform-box: fill-box;
		transform-origin: center;
	}
	.ink {
		fill: #16212b;
	}
	.brow {
		stroke: #16212b;
		stroke-width: 1.6;
		stroke-linecap: round;
		fill: none;
	}
	.mouth {
		stroke: #16212b;
		stroke-width: 2.4;
		stroke-linecap: round;
		fill: none;
	}
	.mouth.thin {
		stroke-width: 2.2;
	}
	.cheek {
		fill: #ffb3a8;
		opacity: 0.55;
		transition: opacity 0.3s;
	}
	.cheek.warm {
		opacity: 0.9;
	}
	.ray {
		stroke: #dd9e36;
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.dot {
		fill: #fff;
		stroke: #c8d6e4;
		stroke-width: 1;
	}
	.eyes {
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 0.18s ease-out;
	}
	.float,
	.hop,
	.body,
	.arm,
	.hat,
	.talk,
	.bulb,
	.heart,
	.twinkle,
	.drip,
	.dot {
		transform-box: fill-box;
		transform-origin: center;
	}
	.body {
		transform-origin: 50% 100%;
	}
	.hop {
		transform-origin: 50% 100%;
	}
	.arm.left {
		transform-origin: 100% 50%;
	}
	.arm.right {
		transform-origin: 0% 50%;
	}

	@media (prefers-reduced-motion: no-preference) {
		.nim:not(.still) .float {
			animation: float 3.6s ease-in-out infinite;
		}
		.nim:not(.still) .ground {
			animation: ground 3.6s ease-in-out infinite;
		}
		.nim:not(.still) .body {
			animation: breathe 3.6s ease-in-out infinite;
		}
		.nim:not(.still) .hop {
			animation: hop 0.55s cubic-bezier(0.3, 1.6, 0.5, 1) both;
		}
		.body.giggle {
			animation: giggle 0.8s ease-in-out both !important;
		}
		.giggle .hat {
			animation: hat 0.8s ease-out both;
		}
		.arm.wave {
			animation: wave 1.1s ease-in-out infinite;
		}
		.arm.left.wave {
			animation-delay: 0.3s;
		}
		.talk {
			animation: talk 0.26s ease-in-out infinite alternate;
		}
		.bulb {
			animation: glow 1.8s ease-in-out infinite;
		}
		.twinkle {
			animation: twinkle 1.6s ease-in-out infinite;
		}
		.twinkle.late {
			animation-delay: 0.8s;
		}
		.sparkle {
			transform-box: fill-box;
			transform-origin: center;
			animation: twinkle 2.2s ease-in-out infinite;
		}
		.drip {
			animation: drip 2.4s ease-in infinite;
		}
		.dot {
			animation: think 1.8s ease-in-out infinite;
		}
		.d2 {
			animation-delay: 0.25s;
		}
		.d3 {
			animation-delay: 0.5s;
		}
		.heart {
			animation: heart 0.9s ease-out both;
		}
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3.5px);
		}
	}
	@keyframes ground {
		0%,
		100% {
			transform: scaleX(1);
			opacity: 1;
		}
		50% {
			transform: scaleX(0.82);
			opacity: 0.7;
		}
	}
	@keyframes breathe {
		0%,
		100% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1.015, 0.985);
		}
	}
	@keyframes hop {
		0% {
			transform: scale(1.12, 0.86);
		}
		45% {
			transform: translateY(-7px) scale(0.94, 1.08);
		}
		100% {
			transform: none;
		}
	}
	@keyframes giggle {
		0%,
		100% {
			transform: rotate(0);
		}
		20% {
			transform: rotate(-8deg) scale(1.04, 0.96);
		}
		40% {
			transform: rotate(7deg);
		}
		60% {
			transform: rotate(-5deg);
		}
		80% {
			transform: rotate(3deg);
		}
	}
	@keyframes hat {
		0%,
		100% {
			transform: none;
		}
		30% {
			transform: translateY(-6px) rotate(-6deg);
		}
		60% {
			transform: translateY(0) rotate(3deg);
		}
	}
	@keyframes wave {
		0%,
		100% {
			transform: rotate(0);
		}
		50% {
			transform: translateY(-5px) rotate(-14deg);
		}
	}
	@keyframes talk {
		from {
			transform: scaleY(0.35);
		}
		to {
			transform: scaleY(1.1);
		}
	}
	@keyframes glow {
		0%,
		100% {
			transform: translateY(0);
			opacity: 1;
		}
		50% {
			transform: translateY(-1.5px);
			opacity: 0.85;
		}
	}
	@keyframes twinkle {
		0%,
		100% {
			transform: scale(1) rotate(0);
		}
		50% {
			transform: scale(0.7) rotate(45deg);
		}
	}
	@keyframes drip {
		0% {
			transform: translateY(0);
			opacity: 1;
		}
		80% {
			transform: translateY(6px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 0;
		}
	}
	@keyframes think {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(0.85);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes heart {
		0% {
			transform: translateY(6px) scale(0.4);
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		100% {
			transform: translateY(-14px) scale(1.1);
			opacity: 0;
		}
	}
</style>
