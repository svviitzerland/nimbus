<script lang="ts">
	import { onDestroy } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import type { LessonText, ApiStyleText } from '$lib/chapters/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		beat = 0,
		oncomplete,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as ApiStyleText);
	const style = $derived(tx.style);

	type Kind = 'get' | 'post' | 'put' | 'delete' | 'graphql' | 'grpc' | 'webhook' | 'data';
	type Chip = { label: string; body?: string; kind: Kind; dir: 'out' | 'back' };
	type Row = { id: number; price?: number; side?: 'in' | 'out'; note?: boolean };

	// language neutral demo data (icons plus numbers), so the same stage reads fine in any language
	const base: Row[] = [
		{ id: 1, price: 90000 },
		{ id: 2, price: 15000 },
		{ id: 3, price: 120000 }
	];
	const withNew: Row[] = [...base, { id: 4, price: 25000 }];
	const withPut: Row[] = withNew.map((r) => (r.id === 2 ? { ...r, price: 9000 } : r));
	const withDel: Row[] = withPut.filter((r) => r.id !== 2);
	const wsMsgs: Row[] = [
		{ id: 1, side: 'in' },
		{ id: 2, side: 'out' },
		{ id: 3, side: 'in' }
	];

	let rows = $state<Row[]>([]);
	let chip = $state<Chip | null>(null);
	let wsOpen = $state(false);
	let serverHit = $state(false);
	let running = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];

	const PLAY = $derived(tx.intro.length - 1);
	const isAnimBeat = $derived(style === 'rest' ? beat >= 1 && beat <= 4 : beat === 1);

	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
	function reset() {
		timers.forEach(clearTimeout);
		timers = [];
		chip = null;
		wsOpen = false;
		serverHit = false;
		running = false;
	}

	const OUT = 1300;
	const BACK = 1300;

	type Exchange = {
		out: string;
		outBody?: string;
		kind: Kind;
		back: string;
		backBody?: string;
		result: Row[];
	};
	// client asks (with a body), it reaches the server, the server answers (with a body), phone updates
	function exchange(e: Exchange) {
		running = true;
		chip = { label: e.out, body: e.outBody, kind: e.kind, dir: 'out' };
		at(OUT, () => {
			chip = null;
			serverHit = true;
		});
		at(OUT + 300, () => (chip = { label: e.back, body: e.backBody, kind: 'data', dir: 'back' }));
		at(OUT + 300 + BACK, () => {
			chip = null;
			serverHit = false;
			rows = e.result.map((r) => ({ ...r }));
			running = false;
		});
	}

	// the server reaches out first (webhook)
	function push(label: string, body: string, result: Row[]) {
		running = true;
		chip = { label, body, kind: 'webhook', dir: 'back' };
		at(BACK, () => {
			chip = null;
			rows = result.map((r) => ({ ...r }));
			running = false;
		});
	}

	// the line stays open, messages arrive one by one (websocket)
	function stream() {
		running = true;
		wsOpen = true;
		rows = [];
		wsMsgs.forEach((m, i) => at(700 + i * 1100, () => (rows = [...rows, m])));
		at(700 + wsMsgs.length * 1100, () => (running = false));
	}

	function runBeat(b: number) {
		reset();
		if (style === 'rest') {
			if (b === 1) {
				rows = [];
				exchange({ out: 'GET /products', kind: 'get', back: '200 OK', result: base });
			} else if (b === 2) {
				rows = base.map((r) => ({ ...r }));
				exchange({
					out: 'POST /products',
					outBody: '{ price: 25000 }',
					kind: 'post',
					back: '201 Created',
					backBody: '{ id: 4, price: 25000 }',
					result: withNew
				});
			} else if (b === 3) {
				rows = withNew.map((r) => ({ ...r }));
				exchange({
					out: 'PUT /products/2',
					outBody: '{ price: 9000 }',
					kind: 'put',
					back: '200 OK',
					backBody: '{ id: 2, price: 9000 }',
					result: withPut
				});
			} else if (b === 4) {
				rows = withPut.map((r) => ({ ...r }));
				exchange({
					out: 'DELETE /products/2',
					kind: 'delete',
					back: '200 OK',
					backBody: '{ ok: true }',
					result: withDel
				});
			}
		} else if (b === 1) {
			rows = [];
			if (style === 'graphql')
				exchange({
					out: '{ product { name price } }',
					kind: 'graphql',
					back: '200 OK',
					backBody: '{ name, price: 90000 }',
					result: base
				});
			else if (style === 'grpc')
				exchange({
					out: 'getProduct(2)',
					kind: 'grpc',
					back: 'OK',
					backBody: '{ name, price: 90000 }',
					result: base
				});
			else if (style === 'websocket') stream();
			else push('payment.paid', '{ amount: 250000 }', [{ id: 1, note: true, price: 250000 }]);
		}
	}

	// ---- run the animation when its beat is reached, and unlock Next on the last beat ----
	let stagedBeat = -1;
	$effect(() => {
		onshow?.(true);
		// these lessons need no action on the last beat, so unlock Next the moment we reach it
		if (beat >= PLAY) oncomplete?.();
		if (beat === stagedBeat) return;
		stagedBeat = beat;
		reset();
		if (isAnimBeat) runBeat(beat);
		else if (beat === 0) rows = [];
	});

	onDestroy(reset);
</script>

<div class="ak">
	<div class="frame">
		<!-- client: a phone -->
		<div class="side">
			<span class="slabel">{tx.clientLabel}</span>
			<div class="phone">
				<span class="notch"></span>
				<div class="screen">
					{#if style === 'websocket'}
						<div class="chat">
							{#each rows as r (r.id)}
								<span class="bubble {r.side}" transition:fade={{ duration: 200 }}></span>
							{/each}
						</div>
					{:else if rows.length === 0}
						<div class="empty">{tx.clientLabel}</div>
					{:else}
						<div class="list">
							{#each rows as r (r.id)}
								<div class="row" class:note={r.note} transition:slide={{ duration: 220 }}>
									<span class="thumb"></span>
									{#if r.note}<span class="bell" aria-hidden="true">!</span>{/if}
									<span class="price">{r.price ? 'Rp' + r.price.toLocaleString('id-ID') : ''}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- the wire: straight, left to right, carrying the request and the response -->
		<div class="lane">
			<div class="wireline" class:ws={wsOpen}></div>
			{#if wsOpen}
				<div class="wsflow" aria-hidden="true">
					<span class="wd a"></span><span class="wd b"></span><span class="wd c"></span>
				</div>
			{:else if chip}
				{#key chip}
					<div class="chip {chip.kind} {chip.dir}">
						<span class="dir" aria-hidden="true">{chip.dir === 'out' ? '→' : '←'}</span>
						<span class="lines">
							<span class="l1">{chip.label}</span>
							{#if chip.body}<span class="l2">{chip.body}</span>{/if}
						</span>
					</div>
				{/key}
			{/if}
		</div>

		<!-- server -->
		<div class="side">
			<span class="slabel">{tx.serverLabel}</span>
			<div class="server" class:hit={serverHit}>
				<span class="rack" aria-hidden="true"><i></i><i></i><i></i></span>
			</div>
		</div>
	</div>

	{#if isAnimBeat}
		<CallToActionButton disabled={running} onclick={() => runBeat(beat)}
			>{tx.replayBtn}</CallToActionButton
		>
	{/if}
</div>

<style>
	.ak {
		display: flex;
		width: min(96vw, 680px);
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 18px;
	}
	.frame {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.side {
		display: flex;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.slabel {
		font-size: 11px;
		font-weight: 800;
		color: #5b6675;
	}

	/* phone, about twice as tall as it is wide like a real one */
	.phone {
		position: relative;
		width: 128px;
		border-radius: 18px;
		border: 1px solid #e2dccf;
		background: #fff;
		padding: 9px 7px 8px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.1);
	}
	.notch {
		position: absolute;
		top: 5px;
		left: 50%;
		height: 4px;
		width: 32px;
		transform: translateX(-50%);
		border-radius: 3px;
		background: #e7e1d7;
	}
	.screen {
		margin-top: 6px;
		display: flex;
		min-height: 220px;
		flex-direction: column;
		border-radius: 12px;
		background: linear-gradient(#fbfcfe, #f3f6fb);
		padding: 8px 7px;
	}
	.empty {
		margin: auto;
		font-size: 10.5px;
		font-weight: 700;
		color: #b7bec8;
	}
	.list {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 5px;
		border-radius: 8px;
		border: 1px solid #e9eef6;
		background: #fff;
		padding: 6px 6px;
	}
	.row.note {
		border-color: #cdead9;
		background: #f3fbf6;
	}
	.thumb {
		height: 14px;
		width: 14px;
		flex: none;
		border-radius: 5px;
		background: linear-gradient(135deg, #dbe8fb, #c8dbf7);
	}
	/* on a pushed note the bell takes the thumbnail's place, so the price still fits the phone */
	.row.note .thumb {
		display: none;
	}
	.bell {
		font-size: 11px;
		font-weight: 900;
		color: #2f8a57;
	}
	.price {
		flex: 1;
		text-align: right;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: #2e6fe0;
	}
	.row.note .price {
		color: #2f8a57;
	}
	.chat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.bubble {
		height: 14px;
		width: 62%;
		border-radius: 9px;
	}
	.bubble.in {
		align-self: flex-start;
		background: #e7eef9;
	}
	.bubble.out {
		align-self: flex-end;
		background: #d6c9f2;
	}

	/* server */
	.server {
		display: flex;
		height: 64px;
		width: 56px;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		border: 1px solid #e2dccf;
		background: #fff;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
		transition:
			box-shadow 0.2s,
			border-color 0.2s;
	}
	.server.hit {
		border-color: #b9c6f0;
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.16);
	}
	.rack {
		display: flex;
		width: 30px;
		flex-direction: column;
		gap: 4px;
	}
	.rack i {
		height: 5px;
		border-radius: 2px;
		background: #e0e7f2;
	}
	.server.hit .rack i {
		background: #b9c6f0;
	}

	/* the wire and the chip that travels straight across it */
	.lane {
		position: relative;
		display: flex;
		min-width: 0;
		flex: 1;
		align-items: center;
		justify-content: center;
		height: 150px;
	}
	.wireline {
		width: 100%;
		height: 2px;
		border-radius: 2px;
		background: repeating-linear-gradient(90deg, #d7dde6 0 6px, transparent 6px 11px);
		transition: height 0.2s;
	}
	.wireline.ws {
		height: 8px;
		background: linear-gradient(90deg, #efeafc, #e4dbf8);
		box-shadow: inset 0 0 0 1px #d6c9f2;
	}
	.chip {
		position: absolute;
		top: 50%;
		left: 0;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
		border-radius: 9px;
		padding: 6px 11px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		color: #fff;
		transform: translate(-50%, -50%);
		box-shadow: 0 7px 18px rgba(22, 40, 60, 0.22);
	}
	.chip .dir {
		font-size: 13px;
		font-weight: 800;
		opacity: 0.75;
	}
	.lines {
		display: flex;
		flex-direction: column;
		gap: 1px;
		line-height: 1.25;
	}
	.l1 {
		font-size: 11.5px;
		font-weight: 800;
	}
	.l2 {
		font-size: 10px;
		font-weight: 600;
		opacity: 0.85;
	}
	.chip.out {
		animation: flyR 1.3s linear forwards;
	}
	.chip.back {
		animation: flyL 1.3s linear forwards;
	}
	.chip.get {
		background: #2e6fe0;
	}
	.chip.post {
		background: #2f8a57;
	}
	.chip.put {
		background: #d98a2b;
	}
	.chip.delete {
		background: #d3584a;
	}
	.chip.graphql {
		background: #d63aa8;
	}
	.chip.grpc {
		background: #2aa19a;
	}
	.chip.webhook {
		background: #d98a2b;
	}
	.chip.data {
		background: #fff;
		color: #2f7d54;
		border: 1px solid #b9e0c8;
	}
	@keyframes flyR {
		0% {
			left: 1%;
			opacity: 0;
		}
		16% {
			opacity: 1;
		}
		84% {
			opacity: 1;
		}
		100% {
			left: 99%;
			opacity: 0;
		}
	}
	@keyframes flyL {
		0% {
			left: 99%;
			opacity: 0;
		}
		16% {
			opacity: 1;
		}
		84% {
			opacity: 1;
		}
		100% {
			left: 1%;
			opacity: 0;
		}
	}

	.wsflow {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 0;
	}
	.wd {
		position: absolute;
		top: 50%;
		height: 9px;
		width: 9px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: #7a5cd0;
	}
	.wd.a {
		animation: wsR 2.2s linear infinite;
	}
	.wd.b {
		animation: wsL 2.2s linear infinite;
		animation-delay: 0.7s;
	}
	.wd.c {
		animation: wsR 2.2s linear infinite;
		animation-delay: 1.4s;
	}
	@keyframes wsR {
		0% {
			left: 4%;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			left: 96%;
			opacity: 0;
		}
	}
	@keyframes wsL {
		0% {
			left: 96%;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			left: 4%;
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wd {
			animation: none;
			opacity: 0.6;
		}
	}
	@media (max-width: 430px) {
		.phone {
			width: 120px;
		}
		.screen {
			min-height: 204px;
		}
		.row {
			gap: 4px;
			padding: 5px;
		}
		.thumb {
			height: 12px;
			width: 12px;
		}
		.price {
			font-size: 10px;
		}
		.l1 {
			font-size: 10.5px;
		}
		.l2 {
			font-size: 9px;
		}
	}
	:global(.dark) .slabel {
		color: #97a3ae;
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
	:global(.dark) .empty {
		color: #6b7885;
	}
	:global(.dark) .row {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .row.note {
		border-color: #2a4a38;
		background: #142a1e;
	}
	:global(.dark) .thumb {
		background: linear-gradient(135deg, #1a2d4a, #1a365e);
	}
	:global(.dark) .row.note .thumb {
		background: linear-gradient(135deg, #2a4a38, #1a3a2a);
	}
	:global(.dark) .bell {
		color: #5bb87e;
	}
	:global(.dark) .price {
		color: #7daae0;
	}
	:global(.dark) .row.note .price {
		color: #5bb87e;
	}
	:global(.dark) .bubble.in {
		background: #1a2d4a;
	}
	:global(.dark) .bubble.out {
		background: #2a2050;
	}
	:global(.dark) .server {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .server.hit {
		border-color: #3a5a8e;
	}
	:global(.dark) .rack i {
		background: #2c3746;
	}
	:global(.dark) .server.hit .rack i {
		background: #5a8fd4;
	}
	:global(.dark) .wireline {
		background: repeating-linear-gradient(90deg, #3a4a5c 0 6px, transparent 6px 11px);
	}
	:global(.dark) .wireline.ws {
		background: linear-gradient(90deg, #1a1540, #2a1a50);
		box-shadow: inset 0 0 0 1px #3a2a60;
	}
	:global(.dark) .chip.data {
		background: #1b2533;
		color: #5bb87e;
		border-color: #2a4a38;
	}
	:global(.dark) .replay {
		border-color: #2c3746;
		background: #1b2533;
		color: #7daae0;
	}
	:global(.dark) .replay:enabled:hover {
		border-color: #4a7ab8;
	}
</style>
