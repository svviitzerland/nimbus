<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Server from '$lib/components/Server.svelte';
	import Laptop from '$lib/components/Laptop.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Acts from '$lib/components/stages/crypto/Acts.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SniffingText } from '$lib/chapters/security/sniffing/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as SniffingText);

	type Token = 'http' | 'https' | 'mitmHttp' | 'mitmHttps';
	type Line = { text: string; tone: 'bad' | 'ok' | 'muted'; tag?: string };

	// Two acts. 0 = the snooper only listens, 1 = the snooper runs the hotspot.
	let act = $state(0);
	const actDone = $state([false, false]);
	const tried = new SvelteSet<Token>();
	let wifi = $state<'' | 'real' | 'twin'>('');
	let flying = $state<Token | ''>('');
	let last = $state<Token | ''>('');
	let lines = $state<Line[]>([]);
	let note = $state('');
	let timers: ReturnType<typeof setTimeout>[] = [];
	let completed = false;

	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function clearAll() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	// Pretend noise, so every HTTPS capture looks a little different.
	function noise() {
		const hex = '0123456789abcdef';
		let s = '';
		for (let i = 0; i < 24; i++) {
			s += hex[Math.floor(Math.random() * 16)];
			if (i % 4 === 3 && i < 23) s += ' ';
		}
		return s;
	}

	function captured(token: Token): Line[] {
		if (token === 'http')
			return [
				{ text: 'POST /login HTTP/1.1', tone: 'muted' },
				{ text: 'Host nimbus.com', tone: 'muted' },
				{ text: 'user=sari&pass=kucing123', tone: 'bad', tag: tx.readableTag }
			];
		if (token === 'https')
			return [
				{ text: 'TLS to nimbus.com', tone: 'muted' },
				{ text: noise(), tone: 'ok', tag: tx.scrambledTag }
			];
		if (token === 'mitmHttp')
			return [
				{ text: 'GET / HTTP/1.1 Host nimbus.com', tone: 'muted' },
				{ text: tx.capture.swapped, tone: 'bad' }
			];
		return [
			{ text: 'TLS hello for nimbus.com', tone: 'muted' },
			{ text: tx.capture.refused, tone: 'ok' }
		];
	}

	function send(token: Token) {
		if (flying) return;
		clearAll();
		flying = token;
		last = '';
		if (act === 0) note = token === 'http' ? tx.notes.http : tx.notes.https;
		timers.push(
			setTimeout(
				() => {
					flying = '';
					last = token;
					lines = [...lines, ...captured(token)].slice(-6);
					tried.add(token);
					note = tx.notes[token];
					onstate?.(token);
					if (act === 0 && tried.has('http') && tried.has('https')) actDone[0] = true;
					if (act === 1 && tried.has('mitmHttp') && tried.has('mitmHttps')) {
						actDone[1] = true;
						if (!completed) {
							completed = true;
							oncomplete?.();
						}
					}
				},
				reduced() ? 300 : 1400
			)
		);
	}

	function join(which: 'real' | 'twin') {
		wifi = which;
		note = tx.notes[which];
		onstate?.(which);
	}

	function nextAct() {
		clearAll();
		act = 1;
		flying = '';
		last = '';
		lines = [];
		note = tx.notes.pick;
	}

	const shownNote = $derived(note || tx.notes.idle);
	// the scheme shown in the phone's address bar
	const secure = $derived.by(() => {
		const t = flying || last;
		if (!t) return null;
		return t === 'https' || t === 'mitmHttps';
	});
	const middleIsSnooper = $derived(act === 1 && wifi === 'twin');
</script>

{#snippet lock(size: number, open: boolean, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke={color} stroke-width="2.4" />
		<path
			d={open ? 'M8.5 10.5V6a3.5 3.5 0 0 1 7 0v.5' : 'M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3'}
			stroke={color}
			stroke-width="2.4"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

{#snippet wifiIcon(size: number, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"
			stroke={color}
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<circle cx="12" cy="19.3" r="1.6" fill={color} />
	</svg>
{/snippet}

<div class="wrap">
	<Acts
		names={tx.acts}
		current={act}
		done={actDone}
		label={tx.actLabel.replace('{n}', String(act + 1))}
	/>

	<!-- the action for this act, kept up top and clear of Nim -->
	<div class="btns">
		{#if act === 0 && actDone[0]}
			<CallToActionButton onclick={nextAct}>
				{#snippet children()}{tx.nextAct}{/snippet}
			</CallToActionButton>
		{:else if act === 0}
			<CallToActionButton onclick={() => send('http')} disabled={!!flying}>
				{#snippet children()}{tx.sendHttp}{/snippet}
			</CallToActionButton>
			<CallToActionButton onclick={() => send('https')} disabled={!!flying}>
				{#snippet children()}{tx.sendHttps}{/snippet}
			</CallToActionButton>
		{:else if wifi !== 'twin'}
			<div class="picker" role="group" aria-label={tx.pickWifi}>
				<p class="phead">{tx.pickWifi}</p>
				<button type="button" class="net" class:on={wifi === 'real'} onclick={() => join('real')}>
					{@render wifiIcon(16, 'var(--color-muted)')}
					<span class="nname">{tx.wifiReal}</span>
					<span class="bars"><i></i><i></i><i class="off"></i></span>
				</button>
				<button type="button" class="net" onclick={() => join('twin')}>
					{@render wifiIcon(16, 'var(--color-muted)')}
					<span class="nname">{tx.wifiTwin}</span>
					<span class="strong">{tx.strongSignal}</span>
					<span class="bars"><i></i><i></i><i></i></span>
				</button>
			</div>
		{:else}
			<CallToActionButton onclick={() => send('mitmHttp')} disabled={!!flying}>
				{#snippet children()}{tx.openHttp}{/snippet}
			</CallToActionButton>
			<CallToActionButton onclick={() => send('mitmHttps')} disabled={!!flying}>
				{#snippet children()}{tx.openHttps}{/snippet}
			</CallToActionButton>
		{/if}
	</div>

	<div class="scene">
		<!-- you, a small phone whose screen we can change -->
		<div class="actor">
			<div class="phone">
				<div class="addr">
					{#if secure === null}
						<span class="dot"></span>
					{:else}
						{@render lock(10, !secure, secure ? 'var(--color-grass)' : 'var(--color-danger)')}
					{/if}
					<span class="url">nimbus.com</span>
					{#if secure !== null}
						<span class="scheme" class:safe={secure}>{secure ? 'HTTPS' : 'HTTP'}</span>
					{/if}
				</div>
				<div class="pbody">
					{#if act === 0}
						<p class="ptitle">{tx.loginTitle}</p>
						<span class="flabel">{tx.userLabel}</span>
						<span class="field">sari</span>
						<span class="flabel">{tx.passLabel}</span>
						<span class="field">••••••••</span>
						{#if last}
							<span class="ok pop">{tx.loggedIn}</span>
						{:else}
							<span class="pbtn">{tx.loginBtn}</span>
						{/if}
					{:else if last === 'mitmHttp'}
						<p class="ptitle">{tx.pageWelcome}</p>
						<div class="bar"></div>
						<div class="bar short"></div>
						<div class="evil pop">
							<span class="etag">{tx.tamperedTag}</span>
							<b>{tx.tamperedTitle}</b>
							<span>{tx.tamperedBody}</span>
							<span class="field">0000 0000 0000</span>
						</div>
					{:else if last === 'mitmHttps'}
						<div class="warn pop">
							{@render lock(18, true, 'var(--color-danger)')}
							<b>{tx.warnTitle}</b>
							<span>{tx.warnBody}</span>
							<span class="pbtn">{tx.warnBack}</span>
						</div>
					{:else}
						<p class="blank">{tx.blankPage}</p>
					{/if}
				</div>
			</div>
			<span class="alabel">{tx.youLabel}</span>
		</div>

		<!-- the road through the WiFi, or through the snooper's laptop -->
		<div class="road">
			<div class="wire"></div>
			<div class="mid" class:faded={act === 1 && wifi === ''}>
				{#if middleIsSnooper}
					<div class="lap pop"><Laptop led="warn" /></div>
					<span class="mlabel bad">{tx.twinLabel}</span>
				{:else}
					<span class="router">{@render wifiIcon(20, 'var(--color-brand)')}</span>
					<span class="mlabel">{act === 1 && wifi === 'real' ? tx.wifiReal : tx.routerLabel}</span>
				{/if}
			</div>

			{#if flying}
				{#key flying}
					<div class="chip" class:stop={flying === 'mitmHttps'}>
						{#if flying === 'http' || flying === 'mitmHttp'}
							{@render lock(10, true, 'var(--color-danger)')}
							{flying === 'http' ? 'pass=kucing123' : 'GET /'}
						{:else}
							<span class="sealed">{@render lock(10, false, '#fff')}8f3a c1e0</span>
						{/if}
					</div>
				{/key}
			{/if}
		</div>

		<!-- nimbus.com -->
		<div class="actor srv">
			<div class="srvbox"><Server slots={3} active={!!last && last !== 'mitmHttps'} /></div>
			<span class="alabel">{tx.serverLabel}</span>
		</div>
	</div>

	<!-- the snooper and what they captured -->
	<div class="spy">
		<div class="who">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle cx="12" cy="8" r="4" fill="var(--color-faint)" />
				<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-faint)" />
			</svg>
			<span>{middleIsSnooper ? tx.twinLabel : tx.snooperLabel}</span>
		</div>
		<div class="cap" aria-live="polite">
			<p class="ctitle">{tx.captureTitle}</p>
			{#if lines.length === 0}
				<p class="cempty">{tx.captureEmpty}</p>
			{:else}
				{#each lines as l, i (i)}
					<p class="cline {l.tone}">
						<span class="ctext">{l.text}</span>
						{#if l.tag}<span class="ctag {l.tone}">{l.tag}</span>{/if}
					</p>
				{/each}
			{/if}
		</div>
	</div>

	<p class="note">{shownNote}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.btns {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		min-height: 46px;
	}
	.btns :global(.cta) {
		padding: 10px 16px;
		font-size: 13px;
	}

	/* WiFi picker */
	.picker {
		display: flex;
		width: min(92vw, 300px);
		flex-direction: column;
		gap: 6px;
	}
	.phead {
		text-align: center;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.net {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
		text-align: left;
		color: var(--color-ink);
		transition: border-color 0.2s;
	}
	.net:hover,
	.net.on {
		border-color: var(--color-brand);
	}
	.nname {
		flex: 1;
		font-size: 13px;
		font-weight: 700;
	}
	.strong {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 7px;
		white-space: nowrap;
	}
	.bars {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 12px;
	}
	.bars i {
		width: 3px;
		border-radius: 1px;
		background: var(--color-ink);
	}
	.bars i:nth-child(1) {
		height: 5px;
	}
	.bars i:nth-child(2) {
		height: 8px;
	}
	.bars i:nth-child(3) {
		height: 12px;
	}
	.bars i.off {
		background: var(--color-line);
	}

	/* the scene */
	.scene {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 4px;
		width: min(94vw, 390px);
	}
	.actor {
		display: flex;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.phone {
		width: 112px;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 4px;
		border-radius: 8px 8px 0 0;
		border-bottom: 1px solid var(--color-line);
		padding: 4px 5px;
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.url {
		flex: 1;
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.scheme {
		border-radius: 4px;
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-size: 7px;
		font-weight: 800;
		padding: 1px 3px;
	}
	.scheme.safe {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pbody {
		display: flex;
		height: 150px;
		flex-direction: column;
		gap: 3px;
		border-radius: 0 0 12px 12px;
		background: var(--color-paper);
		padding: 7px 6px;
		overflow: hidden;
	}
	.ptitle {
		font-family: var(--font-display);
		font-size: 11px;
		color: var(--color-ink);
	}
	.flabel {
		font-size: 7.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.field {
		border-radius: 5px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 2px 5px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 8.5px;
		color: var(--color-ink);
	}
	.pbtn {
		margin-top: 3px;
		border-radius: 6px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 3px;
		text-align: center;
		font-size: 8.5px;
		font-weight: 700;
	}
	.ok {
		margin-top: 3px;
		justify-content: center;
		border-radius: 6px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		padding: 3px;
		font-size: 8.5px;
		font-weight: 800;
	}
	.bar {
		height: 6px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.bar.short {
		width: 60%;
	}
	.evil,
	.warn {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 3px;
		margin-top: 4px;
		border-radius: 8px;
		border: 1.5px solid var(--color-danger);
		background: var(--color-danger-soft);
		padding: 5px;
		font-size: 8px;
		color: var(--color-ink);
	}
	.warn {
		align-items: center;
		margin-top: 0;
		height: 100%;
		justify-content: center;
		text-align: center;
	}
	.evil b,
	.warn b {
		font-size: 9px;
	}
	.etag {
		align-self: flex-start;
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		font-size: 7px;
		font-weight: 800;
		padding: 1px 5px;
	}
	.blank {
		margin: auto;
		text-align: center;
		font-size: 9px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.road {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 150px;
	}
	.wire {
		position: absolute;
		top: 30%;
		left: 0;
		right: 0;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.mid {
		position: absolute;
		top: calc(30% + 10px);
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		transform: translateX(-50%);
		transition: opacity 0.3s;
	}
	.mid.faded {
		opacity: 0.35;
	}
	.router {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.lap {
		width: 60px;
		height: 44px;
	}
	.lap > :global(.laptop) {
		transform: scale(0.42);
		transform-origin: top left;
	}
	.mlabel {
		max-width: 80px;
		text-align: center;
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.mlabel.bad {
		color: var(--color-danger);
	}
	.srvbox {
		width: 60px;
		height: 82px;
	}
	.srvbox > :global(.server) {
		transform: scale(0.7);
		transform-origin: top left;
	}
	.chip {
		position: absolute;
		top: calc(30% - 22px);
		left: 0;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 8.5px;
		font-weight: 700;
		padding: 2px 7px;
		white-space: nowrap;
		animation: fly 1.4s linear forwards;
	}
	.chip.stop {
		animation-name: flystop;
	}
	.sealed {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		margin: -2px -7px;
		border-radius: 999px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 2px 7px;
	}
	@keyframes fly {
		from {
			left: 0;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		to {
			left: 60%;
			opacity: 0;
		}
	}
	@keyframes flystop {
		from {
			left: 0;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		to {
			left: 30%;
			opacity: 0.4;
		}
	}

	/* the snooper */
	.spy {
		display: flex;
		width: min(92vw, 360px);
		flex-direction: column;
		gap: 6px;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.cap {
		display: flex;
		min-height: 96px;
		flex-direction: column;
		gap: 3px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
	}
	.ctitle {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.cempty {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.cline {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		line-height: 1.4;
		animation: popin 0.25s ease;
	}
	.ctext {
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.cline.muted {
		color: var(--color-faint);
	}
	.cline.bad {
		color: var(--color-danger);
		font-weight: 700;
	}
	.cline.ok {
		color: var(--color-grass);
	}
	.ctag {
		flex: none;
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 8.5px;
		font-weight: 800;
		padding: 1px 6px;
	}
	.ctag.bad {
		background: var(--color-danger);
		color: #fff;
	}
	.ctag.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pop {
		display: inline-flex;
		animation: popin 0.25s ease;
	}
	.evil.pop,
	.warn.pop {
		display: flex;
	}
	@keyframes popin {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.note {
		min-height: 2.6em;
		max-width: 330px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.pop,
		.cline {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 16px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.scene {
			width: 560px;
			gap: 10px;
		}
		.phone {
			width: 150px;
		}
		.pbody {
			height: 190px;
			gap: 4px;
		}
		.url {
			font-size: 10.5px;
		}
		.ptitle {
			font-size: 14px;
		}
		.flabel {
			font-size: 9.5px;
		}
		.field,
		.pbtn,
		.ok {
			font-size: 10.5px;
		}
		.evil,
		.warn {
			font-size: 10px;
		}
		.evil b,
		.warn b {
			font-size: 11px;
		}
		.road {
			height: 190px;
		}
		.lap {
			width: 80px;
			height: 60px;
		}
		.lap > :global(.laptop) {
			transform: scale(0.58);
		}
		.mlabel,
		.alabel {
			font-size: 11.5px;
		}
		.mlabel {
			max-width: 120px;
		}
		.srvbox {
			width: 78px;
			height: 105px;
		}
		.srvbox > :global(.server) {
			transform: scale(0.9);
		}
		.chip {
			font-size: 10.5px;
		}
		.spy {
			width: 460px;
		}
		.cline {
			font-size: 12px;
		}
		.note {
			max-width: 460px;
			font-size: 14px;
		}
	}
</style>
