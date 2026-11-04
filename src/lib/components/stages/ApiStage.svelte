<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import type { LessonText, ApiText } from '$lib/chapters/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as ApiText);

	type Product = { id: number; name: string; price: number };
	// The backend owns the data; the phone shows nothing until it asks the API for it.
	const data = untrack(() => (text as ApiText).products.map((p) => ({ ...p })));

	let loaded = $state(false);
	let phase = $state<'idle' | 'req' | 'work' | 'resp'>('idle');
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const PLAY = $derived(tx.intro.length - 1);
	const isPlay = $derived(beat >= PLAY);
	const JSON_BEAT = 3;
	const focusCol = $derived(
		beat === 0 ? 'front' : beat === 1 ? 'back' : beat === 2 || beat === JSON_BEAT ? 'api' : ''
	);
	// The JSON beat shows one product the way the API really sends it, keys and values in braces.
	const sample = $derived(tx.products[1] ?? tx.products[0]);
	const jsonRows = $derived(
		sample
			? [
					{ key: 'id', value: String(sample.id), str: false },
					{ key: 'name', value: sample.name, str: true },
					{ key: 'price', value: String(sample.price), str: false }
				]
			: []
	);
	const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID');

	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	$effect(() => {
		onshow?.(true); // keep the scene visible while Nim introduces each part
	});

	function fetchData() {
		if (phase !== 'idle') return;
		loaded = false;
		phase = 'req';
		at(930, () => (phase = 'work'));
		at(1860, () => (phase = 'resp'));
		at(2790, () => {
			phase = 'idle';
			loaded = true;
			onstate?.('fetch');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		});
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="api">
	<div class="cols">
		<!-- frontend: the phone the person sees, empty until it asks -->
		<div class="side">
			<div class="slabel">{tx.frontendLabel}<span>{tx.frontendSub}</span></div>
			<div class="phone" class:hl={focusCol === 'front'}>
				<span class="notch"></span>
				<div class="screen">
					<div class="apphead">{tx.appTitle}</div>
					{#if loaded}
						<div class="applist">
							{#each data as p (p.id)}
								<div class="arow" transition:slide={{ duration: 360 }}>
									<span class="an">{p.name}</span>
									<span class="ap">{rupiah(p.price)}</span>
								</div>
							{/each}
						</div>
					{:else}
						<div class="empty">{tx.emptyHint}</div>
					{/if}
					{#if phase !== 'idle'}
						<div class="wait" transition:fade={{ duration: 180 }}>
							<span class="dot"></span><span class="dot"></span><span class="dot"></span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- the API: the door between them -->
		<div class="lane" class:hl={focusCol === 'api'}>
			<span class="apitag">{tx.apiLabel}</span>
			<div class="wireline"></div>
			{#if phase === 'req'}
				<div class="chip out">{tx.reqLabel}</div>
			{:else if phase === 'resp'}
				<div class="chip back">{tx.respLabel}</div>
			{/if}
		</div>

		<!-- backend: the server that holds the data -->
		<div class="side">
			<div class="slabel">{tx.backendLabel}<span>{tx.backendSub}</span></div>
			<div class="server" class:reading={phase === 'work'} class:hl={focusCol === 'back'}>
				<div class="dbhead">
					<span class="disc" aria-hidden="true"></span>{tx.tableLabel}
				</div>
				<div class="dbrows">
					{#each data as p (p.id)}
						<div class="dbrow">
							<span class="did">{p.id}</span>
							<span class="dn">{p.name}</span>
							<span class="dp">{p.price}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	{#if beat === JSON_BEAT && sample}
		<div class="json" transition:fade={{ duration: 220 }}>
			<span class="jtag">JSON</span>
			<div class="code">
				<div class="jp">{'{'}</div>
				{#each jsonRows as r, k (r.key)}
					<div class="jl">
						<span class="jk">"{r.key}"</span><span class="jp">:</span>
						<span class={r.str ? 'js' : 'jn'}>{r.str ? `"${r.value}"` : r.value}</span
						>{#if k < jsonRows.length - 1}<span class="jp">,</span>{/if}
					</div>
				{/each}
				<div class="jp">{'}'}</div>
			</div>
		</div>
	{/if}

	{#if isPlay}
		<CallToActionButton disabled={phase !== 'idle'} onclick={fetchData}
			>{tx.fetchBtn}</CallToActionButton
		>
	{/if}
</div>

<style>
	.api {
		display: flex;
		width: min(96vw, 700px);
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	.cols {
		display: flex;
		width: 100%;
		align-items: stretch;
		justify-content: center;
		gap: 6px;
	}
	.side {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 6px;
	}
	.slabel {
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 12px;
		font-weight: 800;
		color: #2b3640;
	}
	.slabel span {
		font-size: 9.5px;
		font-weight: 600;
		color: #9aa3ae;
	}

	/* a phone about twice as tall as it is wide, like a real one */
	.phone {
		position: relative;
		width: 132px;
		flex: none;
		border-radius: 18px;
		border: 1px solid #e2dccf;
		background: #fff;
		padding: 9px 7px 8px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.1);
		transition: box-shadow 0.25s;
	}
	.notch {
		position: absolute;
		top: 5px;
		left: 50%;
		height: 4px;
		width: 34px;
		transform: translateX(-50%);
		border-radius: 3px;
		background: #e7e1d7;
	}
	.screen {
		position: relative;
		margin-top: 6px;
		display: flex;
		min-height: 230px;
		flex-direction: column;
		overflow: hidden;
		border-radius: 12px;
		background: linear-gradient(#fbfcfe, #f3f6fb);
		padding: 9px 7px;
	}
	.apphead {
		margin-bottom: 7px;
		font-family: 'Fraunces', Georgia, serif;
		font-size: 13px;
		font-weight: 600;
		color: #2b4a72;
	}
	.applist {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.arow {
		display: flex;
		flex-direction: column;
		gap: 1px;
		border-radius: 8px;
		border: 1px solid #e9eef6;
		background: #fff;
		padding: 6px 8px;
	}
	.an {
		font-size: 11px;
		font-weight: 600;
		color: #2a3340;
	}
	.ap {
		font-size: 11px;
		font-weight: 700;
		color: #2e6fe0;
	}
	.empty {
		margin: auto;
		text-align: center;
		font-size: 11px;
		font-weight: 600;
		color: #aab2bd;
	}
	.wait {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		background: rgba(247, 249, 252, 0.55);
		backdrop-filter: blur(1px);
	}
	.wait .dot {
		height: 7px;
		width: 7px;
		border-radius: 50%;
		background: #9cc0f3;
		animation: bob 0.9s ease-in-out infinite;
	}
	.wait .dot:nth-child(2) {
		animation-delay: 0.15s;
	}
	.wait .dot:nth-child(3) {
		animation-delay: 0.3s;
	}

	.lane {
		position: relative;
		display: flex;
		min-width: 58px;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		align-self: center;
		height: 156px;
		border-radius: 12px;
		transition: background 0.25s;
	}
	.apitag {
		position: absolute;
		top: 50%;
		margin-top: -34px;
		border-radius: 999px;
		background: #2b3640;
		padding: 2px 10px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: #fff;
	}
	.wireline {
		width: 100%;
		height: 2px;
		border-radius: 2px;
		background: repeating-linear-gradient(90deg, #d7dde6 0 6px, transparent 6px 11px);
	}
	.chip {
		position: absolute;
		top: 50%;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		border-radius: 8px;
		padding: 4px 9px;
		font-size: 10.5px;
		font-weight: 800;
		box-shadow: 0 5px 14px rgba(22, 40, 60, 0.16);
	}
	.chip.out {
		background: #2e6fe0;
		color: #fff;
		animation: flyR 0.93s ease-in forwards;
	}
	.chip.back {
		background: #fff;
		color: #2f8a57;
		border: 1px solid #b9e0c8;
		animation: flyL 0.93s ease-out forwards;
	}
	@keyframes flyR {
		0% {
			left: 0;
			transform: translate(-50%, -50%);
			opacity: 0;
		}
		18% {
			opacity: 1;
		}
		82% {
			opacity: 1;
		}
		100% {
			left: 100%;
			transform: translate(-50%, -50%);
			opacity: 0;
		}
	}
	@keyframes flyL {
		0% {
			left: 100%;
			transform: translate(-50%, -50%);
			opacity: 0;
		}
		18% {
			opacity: 1;
		}
		82% {
			opacity: 1;
		}
		100% {
			left: 0;
			transform: translate(-50%, -50%);
			opacity: 0;
		}
	}

	.server {
		width: 152px;
		flex: none;
		overflow: hidden;
		border-radius: 13px;
		border: 1px solid #e2dccf;
		background: #fff;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.07);
		transition: box-shadow 0.2s;
	}
	.server.reading {
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.16);
	}
	.dbhead {
		display: flex;
		align-items: center;
		gap: 6px;
		border-bottom: 1px solid #eee8dd;
		background: #faf9f6;
		padding: 7px 10px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: #5b6675;
	}
	.disc {
		height: 11px;
		width: 11px;
		flex: none;
		border-radius: 50%;
		border: 2px solid #b9c6d6;
		background: radial-gradient(circle at 50% 50%, #fff 30%, #dde6f0 32%);
	}
	.dbrows {
		display: flex;
		flex-direction: column;
		padding: 6px;
		gap: 4px;
	}
	.dbrow {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 7px;
		background: #f7f9fc;
		padding: 5px 8px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 10.5px;
	}
	.did {
		display: inline-flex;
		height: 16px;
		width: 16px;
		flex: none;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		background: #e7eef9;
		font-size: 9px;
		font-weight: 800;
		color: #6b86b3;
	}
	.dn {
		flex: 1;
		font-weight: 600;
		color: #2a3340;
	}
	.dp {
		font-weight: 700;
		color: #c08327;
	}

	.json {
		position: relative;
		border-radius: 14px;
		border: 1px solid #e2dccf;
		background: #fff;
		padding: 14px 18px 12px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.07);
	}
	.jtag {
		position: absolute;
		top: -9px;
		left: 14px;
		border-radius: 999px;
		background: #2b3640;
		padding: 1px 9px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: #fff;
	}
	.jl {
		padding-left: 1.4em;
	}
	.json .code {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12.5px;
		line-height: 1.6;
		color: #2a3340;
	}
	.jp {
		color: #9aa3ae;
	}
	.jk {
		font-weight: 700;
		color: #2e6fe0;
	}
	.js {
		color: #2f8a57;
	}
	.jn {
		color: #c08327;
		font-weight: 700;
	}
	.hl.phone,
	.hl.server {
		border-color: #cadcf7;
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.16);
	}
	.lane.hl {
		background: rgba(46, 111, 224, 0.07);
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.5;
		}
		50% {
			transform: translateY(-4px);
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wait .dot {
			animation: none;
		}
	}
	@media (max-width: 420px) {
		.phone {
			width: 116px;
		}
		.screen {
			min-height: 200px;
		}
		.server {
			width: 134px;
		}
		.dbrow,
		.an,
		.ap {
			font-size: 10px;
		}
	}
	:global(.dark) .slabel {
		color: #e0dcd4;
	}
	:global(.dark) .slabel span {
		color: #6b7885;
	}
	:global(.dark) .phone {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .notch {
		background: #2c3746;
	}
	:global(.dark) .screen {
		background: linear-gradient(#141c2a, #121a24);
	}
	:global(.dark) .apphead {
		color: #7daae0;
	}
	:global(.dark) .arow {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .an {
		color: #e0dcd4;
	}
	:global(.dark) .empty {
		color: #6b7885;
	}
	:global(.dark) .wait {
		background: rgba(18, 26, 36, 0.55);
	}
	:global(.dark) .wait .dot {
		background: #5a8fd4;
	}
	:global(.dark) .apitag {
		background: #e0dcd4;
		color: #1b2533;
	}
	:global(.dark) .wireline {
		background: repeating-linear-gradient(90deg, #3a4a5c 0 6px, transparent 6px 11px);
	}
	:global(.dark) .chip.back {
		background: #1b2533;
		color: #5bb87e;
		border-color: #2a4a38;
	}
	:global(.dark) .server {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .dbhead {
		border-bottom-color: #2c3746;
		background: #141c2a;
		color: #97a3ae;
	}
	:global(.dark) .disc {
		border-color: #3a4a5c;
		background: radial-gradient(circle at 50% 50%, #1b2533 30%, #3a4a5c 32%);
	}
	:global(.dark) .dbrow {
		background: #141c2a;
	}
	:global(.dark) .did {
		background: #1a2d4a;
		color: #7daae0;
	}
	:global(.dark) .dn {
		color: #e0dcd4;
	}
	:global(.dark) .json {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .json .code {
		color: #e0dcd4;
	}
	:global(.dark) .jtag {
		background: #e0dcd4;
		color: #1b2533;
	}
	:global(.dark) .jk {
		color: #7daae0;
	}
	:global(.dark) .js {
		color: #5bb87e;
	}
	:global(.dark) .hl.phone,
	:global(.dark) .hl.server {
		border-color: #2a4a6e;
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.25);
	}
	:global(.dark) .lane.hl {
		background: rgba(46, 111, 224, 0.12);
	}
</style>
