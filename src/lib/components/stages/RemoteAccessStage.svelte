<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Terminal from '../Terminal.svelte';
	import type { LessonText, RemoteAccessText } from '$lib/chapters/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as RemoteAccessText);

	let view = $state<'' | 'ssh' | 'rdp'>('');
	let connecting = $state(false);
	let connected = $state(false);
	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// SSH typing session state
	let sci = $state(0);
	let stc = $state(0);
	let sout = $state(false);

	function schedule(fn: () => void, d: number) {
		timers.push(setTimeout(fn, d));
	}
	function sshType() {
		if (sci >= tx.sshSession.length) return;
		const cmd = tx.sshSession[sci].cmd;
		if (stc < cmd.length) {
			stc += 1;
			schedule(sshType, 72);
		} else if (!sout) {
			schedule(() => {
				sout = true;
				schedule(sshAdvance, 720);
			}, 360);
		}
	}
	function sshAdvance() {
		sci += 1;
		stc = 0;
		sout = false;
		schedule(sshType, 540);
	}

	function go(v: 'ssh' | 'rdp') {
		view = v;
		connecting = true;
		connected = false;
		sci = 0;
		stc = 0;
		sout = false;
		timers.forEach(clearTimeout);
		timers = [];
		schedule(() => {
			connecting = false;
			connected = true;
			onstate?.(v);
			tried.add(v);
			if (tried.size === 2 && !done) {
				done = true;
				onstate?.('both');
				oncomplete?.();
			}
			if (v === 'ssh') schedule(sshType, 520);
		}, 1050);
	}

	const sshLines = $derived.by(() => {
		const out: { text: string; tone?: 'cmd' | 'out' | 'ok' | 'muted'; caret?: boolean }[] = [
			{ text: tx.sshCmd, tone: 'cmd' }
		];
		if (connecting) out.push({ text: tx.sshConnecting, tone: 'muted' });
		if (connected) {
			out.push({ text: tx.sshOk, tone: 'ok' });
			for (let i = 0; i < tx.sshSession.length; i++) {
				if (i < sci) {
					out.push({ text: tx.sshSession[i].cmd, tone: 'cmd' });
					for (const o of tx.sshSession[i].out) out.push({ text: o, tone: 'out' });
				} else if (i === sci) {
					out.push({ text: tx.sshSession[i].cmd.slice(0, stc), tone: 'cmd', caret: !sout });
					if (sout) for (const o of tx.sshSession[i].out) out.push({ text: o, tone: 'out' });
				}
			}
			if (sci >= tx.sshSession.length) out.push({ text: '', tone: 'cmd', caret: true });
		}
		return out;
	});

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<!-- the faraway server, in a data center -->
	<div class="dc" class:live={connected}>
		<span class="rack"><i></i><i></i><i></i></span>
		<span class="dctext">{tx.serverLabel}<span class="dcsub">{tx.dcLabel}</span></span>
	</div>

	<!-- the remote connection coming down to your screen -->
	<div class="link" class:flow={connecting || connected}><span class="dot"></span></div>

	<!-- your computer at home, where the server's screen shows up -->
	<div class="computer">
		<div class="monitor">
			<div class="screen" class:lit={connected}>
				{#if view === ''}
					<div class="locked">
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<rect
								x="5"
								y="10.5"
								width="14"
								height="9.5"
								rx="2.4"
								stroke="#7d8a96"
								stroke-width="2"
							/>
							<path
								d="M8.2 10.5V7.6a3.8 3.8 0 0 1 7.6 0v2.9"
								stroke="#7d8a96"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
						<span>{tx.lockedNote}</span>
					</div>
				{:else if connecting}
					<div class="conn"><span class="spin"></span>{tx.connecting}</div>
				{:else if view === 'ssh'}
					<Terminal prompt={tx.sshPrompt} lines={sshLines} bare fill />
				{:else}
					<!-- full screen Windows style desktop -->
					<div class="win11">
						<span class="rbadge">{tx.rdpHost}</span>
						<div class="dwin">
							<div class="dwbar">
								<span class="dwtitle">{tx.rdpTitle}</span>
								<span class="dwctrls"><i></i><i></i><b></b></span>
							</div>
							<div class="dwbody">
								<div class="dwside"><span></span><span></span><span></span></div>
								<div class="dwmain">
									<span class="dwl"></span><span class="dwl s"></span><span class="dwl"></span>
									<div class="dwfiles"><i></i><i></i><i></i><i></i></div>
								</div>
							</div>
						</div>
						<span class="rhint">{tx.rdpHint}</span>
						<div class="taskbar">
							<span class="winlogo"><i></i><i></i><i></i><i></i></span>
							<span class="tsearch"></span>
							<span class="tapp"></span>
							<span class="tapp"></span>
							<span class="tclock">9:41<small>19/06</small></span>
						</div>
					</div>
				{/if}
			</div>
			<div class="neck"></div>
			<div class="base"></div>
		</div>
		<span class="hlabel">{tx.homeLabel}</span>
	</div>

	<div class="acts">
		<button
			type="button"
			class="line"
			class:dim={tried.has('ssh')}
			disabled={connecting}
			onclick={() => go('ssh')}>{tx.pickSsh}</button
		>
		<button
			type="button"
			class="cta"
			class:dim={tried.has('rdp')}
			disabled={connecting}
			onclick={() => go('rdp')}>{tx.pickRdp}</button
		>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0;
		width: min(94vw, 360px);
		height: 100%;
	}
	.dc {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border-radius: 11px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		padding: 8px 13px;
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.07);
		transition: border-color 0.3s ease;
	}
	.dc.live {
		border-color: #3a9c64;
	}
	.rack {
		display: inline-flex;
		flex-direction: column;
		gap: 3px;
	}
	.rack i {
		width: 22px;
		height: 3.5px;
		border-radius: 2px;
		background: #d8e0e7;
		transition: background 0.3s ease;
	}
	.dc.live .rack i {
		background: #3a9c64;
	}
	.dctext {
		display: inline-flex;
		flex-direction: column;
		line-height: 1.2;
		font-size: 12px;
		font-weight: 700;
		color: #2b3640;
	}
	.dcsub {
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.link {
		position: relative;
		width: 0;
		height: 30px;
		border-left: 2px solid #d8d2c6;
		transition: border-color 0.3s ease;
	}
	.link.flow {
		border-color: #2e6fe0;
	}
	.dot {
		position: absolute;
		left: -4px;
		top: -6px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #2e6fe0;
		opacity: 0;
	}
	.link.flow .dot {
		animation: drop 1s linear infinite;
	}
	@keyframes drop {
		0% {
			top: -4px;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			top: 28px;
			opacity: 0;
		}
	}
	.computer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.monitor {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.screen {
		width: 320px;
		max-width: 92vw;
		height: 196px;
		border-radius: 12px;
		background: #1c2530;
		padding: 9px;
		box-shadow: 0 16px 34px rgba(22, 40, 60, 0.2);
		display: flex;
		overflow: hidden;
		transition: background 0.3s ease;
	}
	.screen.lit {
		background: #222c38;
	}
	.locked {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: #7d8a96;
		font-size: 11.5px;
		font-weight: 600;
	}
	.conn {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		color: #9fb1c0;
		font-size: 11.5px;
		font-weight: 600;
	}
	.spin {
		width: 22px;
		height: 22px;
		border: 3px solid rgba(255, 255, 255, 0.22);
		border-top-color: #6fd39a;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* full screen Windows style desktop */
	.win11 {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 7px;
		overflow: hidden;
		background:
			radial-gradient(120% 80% at 22% 14%, rgba(120, 190, 255, 0.5), transparent 60%),
			radial-gradient(90% 70% at 84% 90%, rgba(60, 120, 220, 0.55), transparent 55%),
			linear-gradient(150deg, #2557a8, #163d7e 70%);
		animation: pop 0.4s ease both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.rbadge {
		position: absolute;
		top: 8px;
		right: 8px;
		border-radius: 999px;
		background: rgba(16, 33, 47, 0.42);
		color: #eaf2ff;
		font-size: 9px;
		font-weight: 700;
		padding: 2px 9px;
		backdrop-filter: blur(3px);
	}
	.dwin {
		position: absolute;
		top: 26px;
		left: 50%;
		transform: translateX(-50%);
		width: 196px;
		border-radius: 9px;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 12px 26px rgba(16, 33, 47, 0.35);
	}
	.dwbar {
		display: flex;
		align-items: center;
		height: 26px;
		padding: 0 5px 0 11px;
		background: #f3f4f6;
		border-bottom: 1px solid #e7e8ec;
	}
	.dwtitle {
		font-size: 10px;
		font-weight: 700;
		color: #3a4650;
	}
	.dwctrls {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding-right: 4px;
	}
	.dwctrls i,
	.dwctrls b {
		width: 9px;
		height: 1.6px;
		background: #6a7480;
	}
	.dwctrls i:nth-child(2) {
		width: 8px;
		height: 8px;
		background: none;
		border: 1.4px solid #6a7480;
		border-radius: 1px;
	}
	.dwctrls b {
		width: 9px;
		height: 9px;
		background: none;
		position: relative;
	}
	.dwctrls b::before,
	.dwctrls b::after {
		content: '';
		position: absolute;
		left: 0;
		top: 4px;
		width: 11px;
		height: 1.6px;
		background: #d3584a;
	}
	.dwctrls b::before {
		transform: rotate(45deg);
	}
	.dwctrls b::after {
		transform: rotate(-45deg);
	}
	.dwbody {
		display: flex;
		height: 78px;
	}
	.dwside {
		width: 48px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px 8px;
		background: #fafafc;
		border-right: 1px solid #eef0f3;
	}
	.dwside span {
		height: 6px;
		border-radius: 3px;
		background: #dfe3e9;
	}
	.dwside span:first-child {
		background: #c7d6ee;
	}
	.dwmain {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 11px 12px;
	}
	.dwl {
		height: 6px;
		border-radius: 3px;
		background: #e6e9ee;
	}
	.dwl.s {
		width: 60%;
		background: #cdd7e6;
	}
	.dwfiles {
		display: flex;
		gap: 8px;
		margin-top: 3px;
	}
	.dwfiles i {
		width: 22px;
		height: 18px;
		border-radius: 3px;
		background: linear-gradient(160deg, #ffe08a, #f4c64e);
		box-shadow: inset 0 4px 0 #fff0c2;
	}
	.rhint {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 30px;
		text-align: center;
		font-size: 9px;
		font-weight: 600;
		color: #dceaff;
		text-shadow: 0 1px 3px rgba(16, 33, 47, 0.5);
	}
	.taskbar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		height: 24px;
		background: rgba(232, 240, 252, 0.72);
		backdrop-filter: blur(6px);
		border-top: 1px solid rgba(255, 255, 255, 0.4);
	}
	.winlogo {
		display: inline-grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.6px;
	}
	.winlogo i {
		width: 6px;
		height: 6px;
		border-radius: 1px;
		background: #2b7cd3;
	}
	.tsearch {
		width: 40px;
		height: 12px;
		border-radius: 7px;
		background: #fff;
		border: 1px solid #d3deec;
	}
	.tapp {
		width: 13px;
		height: 13px;
		border-radius: 3px;
		background: #cdd9ea;
	}
	.tclock {
		position: absolute;
		right: 8px;
		display: inline-flex;
		flex-direction: column;
		align-items: flex-end;
		line-height: 1.1;
		font-size: 8.5px;
		font-weight: 700;
		color: #25313f;
	}
	.tclock small {
		font-size: 7.5px;
		font-weight: 600;
		color: #5a6675;
	}
	.neck {
		width: 44px;
		height: 13px;
		background: linear-gradient(#222c38, #1a232e);
	}
	.base {
		width: 108px;
		height: 8px;
		border-radius: 0 0 7px 7px;
		background: #1c2530;
	}
	.hlabel {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-top: 13px;
	}
	.cta {
		border-radius: 12px;
		background: #16212b;
		color: #fff;
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line {
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		color: var(--color-ink);
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:enabled:hover {
		border-color: var(--color-ink);
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.55;
	}
	.dim::after {
		content: ' ✓';
		color: #3a9c64;
	}
	.cta.dim::after {
		color: #8fd6ae;
	}
	@media (prefers-reduced-motion: reduce) {
		.spin,
		.win11 {
			animation-duration: 0.01s;
		}
		.link.flow .dot {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
		}
		.screen {
			width: 420px;
			height: 256px;
		}
		.dwin {
			width: 250px;
		}
		.dwbody {
			height: 104px;
		}
		.dctext {
			font-size: 13px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .dc {
		border-color: #2c3746;
		background: #1b2533;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
	}
	:global(.dark) .dc.live {
		border-color: #3a9c64;
	}
	:global(.dark) .rack i {
		background: #2c3746;
	}
	:global(.dark) .dc.live .rack i {
		background: #3a9c64;
	}
	:global(.dark) .dctext {
		color: #e0dcd4;
	}
	:global(.dark) .link {
		border-color: #3a4a5c;
	}
	:global(.dark) .link.flow {
		border-color: #2e6fe0;
	}
	:global(.dark) .screen {
		background: #0f1720;
	}
	:global(.dark) .screen.lit {
		background: #141c28;
	}
	:global(.dark) .locked {
		color: #6b7885;
	}
	:global(.dark) .conn {
		color: #6b7885;
	}
	:global(.dark) .spin {
		border-color: rgba(255, 255, 255, 0.12);
		border-top-color: #6fd39a;
	}
	:global(.dark) .dwin {
		background: #1b2533;
		box-shadow: 0 12px 26px rgba(0, 0, 0, 0.4);
	}
	:global(.dark) .dwbar {
		background: #141c2a;
		border-bottom-color: #2c3746;
	}
	:global(.dark) .dwtitle {
		color: #e0dcd4;
	}
	:global(.dark) .dwctrls i,
	:global(.dark) .dwctrls b {
		background: #6b7885;
	}
	:global(.dark) .dwctrls i:nth-child(2) {
		background: none;
		border-color: #6b7885;
	}
	:global(.dark) .dwside {
		background: #121a24;
		border-right-color: #2c3746;
	}
	:global(.dark) .dwside span {
		background: #2c3746;
	}
	:global(.dark) .dwside span:first-child {
		background: #1a2d4a;
	}
	:global(.dark) .dwl {
		background: #2c3746;
	}
	:global(.dark) .dwl.s {
		background: #1a2d4a;
	}
	:global(.dark) .dwfiles i {
		background: linear-gradient(160deg, #8a6a20, #7a5a18);
		box-shadow: inset 0 4px 0 #a08030;
	}
	:global(.dark) .rhint {
		color: #97a3ae;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	}
	:global(.dark) .taskbar {
		background: rgba(14, 22, 33, 0.72);
		border-top-color: rgba(255, 255, 255, 0.08);
	}
	:global(.dark) .tsearch {
		background: #1b2533;
		border-color: #2c3746;
	}
	:global(.dark) .tapp {
		background: #2c3746;
	}
	:global(.dark) .tclock {
		color: #e0dcd4;
	}
	:global(.dark) .tclock small {
		color: #97a3ae;
	}
	:global(.dark) .neck {
		background: linear-gradient(#141c28, #0f1720);
	}
	:global(.dark) .base {
		background: #0f1720;
	}
	:global(.dark) .cta {
		background: #2a3748;
		color: #e0dcd4;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
	}
	:global(.dark) .line {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .cta.dim::after {
		color: #5bb87e;
	}
</style>
