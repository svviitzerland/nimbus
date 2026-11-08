<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { MfaText } from '$lib/chapters/security/mfa/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as MfaText);

	type Phase = 'idle' | 'checking' | 'taken' | 'armed' | 'askCode' | 'guess' | 'locked' | 'welcome';
	let phase = $state<Phase>('idle');
	let mfaOn = $state(false);
	let guess = $state('');
	let typed = $state('');
	let wrong = $state(false);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// The authenticator app, a fresh six digit code every 30 seconds.
	const PERIOD = 30;
	let code = $state('');
	let prevCode = '';
	let left = $state(PERIOD);
	const sixDigits = () => String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
	$effect(() => {
		code = sixDigits();
		const tick = setInterval(() => {
			left -= 1;
			if (left <= 0) {
				prevCode = code;
				code = sixDigits();
				left = PERIOD;
			}
		}, 1000);
		return () => clearInterval(tick);
	});

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function later(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, reduced() ? Math.min(ms, 200) : ms));
	}

	function attack() {
		phase = 'checking';
		if (!mfaOn) {
			later(900, () => {
				phase = 'taken';
				onstate?.('noMfa');
			});
			return;
		}
		later(900, () => (phase = 'askCode'));
		let t = 1700;
		for (let i = 0; i < 3; i++) {
			later(t, () => {
				guess = sixDigits();
				phase = 'guess';
			});
			t += 750;
		}
		later(t, () => {
			phase = 'locked';
			onstate?.('stuck');
		});
	}
	function turnOn() {
		mfaOn = true;
		phase = 'armed';
	}
	function submit() {
		if (typed.length !== 6) return;
		if (typed === code || (prevCode && typed === prevCode)) {
			wrong = false;
			phase = 'welcome';
			onstate?.('you');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		} else {
			wrong = true;
			onstate?.('wrongCode');
		}
	}
	function onCodeInput() {
		typed = typed.replace(/\D/g, '').slice(0, 6);
		wrong = false;
	}

	const status = $derived.by(() => {
		if (phase === 'checking') return tx.status.checking;
		if (phase === 'taken') return tx.status.taken;
		if (phase === 'askCode') return tx.status.askCode;
		if (phase === 'guess') return tx.status.guessing.replace('{code}', guess);
		if (phase === 'locked' || phase === 'welcome') return tx.status.locked;
		return tx.status.idle;
	});
	const showCode = $derived(mfaOn && ['askCode', 'guess', 'locked', 'welcome'].includes(phase));
	// The countdown ring, drawn as an arc that shrinks as the code gets older.
	const arc = $derived.by(() => {
		const f = Math.min(left / PERIOD, 0.9999);
		const a = 2 * Math.PI * f;
		const x = 10 + 8 * Math.sin(a);
		const y = 10 - 8 * Math.cos(a);
		return `M10 2A8 8 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
	});
	const spaced = (c: string) => (c ? `${c.slice(0, 3)} ${c.slice(3)}` : '');

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="btns">
		{#if phase === 'idle'}
			<CallToActionButton onclick={attack}>
				{tx.attackBtn}
			</CallToActionButton>
		{:else if phase === 'taken'}
			<CallToActionButton onclick={turnOn}>
				{tx.mfaOnBtn}
			</CallToActionButton>
		{:else if phase === 'armed'}
			<CallToActionButton onclick={attack}>
				{tx.attackAgainBtn}
			</CallToActionButton>
		{:else if phase === 'locked' || phase === 'welcome'}
			<form
				class="you"
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<label class="ylabel" for="nimbus-mfa-code">
					{phase === 'welcome' ? tx.status.welcome : tx.codePrompt}
				</label>
				<div class="yrow">
					<input
						id="nimbus-mfa-code"
						class="codein"
						class:bad={wrong}
						class:ok={phase === 'welcome'}
						inputmode="numeric"
						autocomplete="one-time-code"
						placeholder="000000"
						disabled={phase === 'welcome'}
						bind:value={typed}
						oninput={onCodeInput}
					/>
					<button type="submit" class="go" disabled={typed.length !== 6 || phase === 'welcome'}
						>{tx.submitBtn}</button
					>
				</div>
				{#if wrong}<span class="err">{tx.status.wrong}</span>{/if}
			</form>
		{/if}
	</div>

	<div class="scene">
		<!-- the attacker and his laptop -->
		<div class="side">
			<div class="who">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="12" cy="8" r="4" fill="var(--color-danger)" />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-danger)" />
				</svg>
				<span class="wname">{tx.attackerLabel}</span>
				<span class="wsub">{tx.attackerSub}</span>
			</div>
			<span class="stolen">{tx.stolenChip}</span>
			<div class="laptop">
				<div
					class="screen"
					class:taken={phase === 'taken'}
					class:blocked={phase === 'locked' || phase === 'welcome'}
				>
					<p class="ltitle">{tx.loginTitle}</p>
					<span class="field"><i>{tx.emailField}</i>you@nimbus.com</span>
					<span class="field"><i>{tx.passwordField}</i>••••••••</span>
					{#if showCode}
						<span class="field code pop" class:miss={phase === 'guess'}>
							<i>{tx.codeField}</i>{phase === 'guess' ? spaced(guess) : '••• •••'}
						</span>
					{/if}
					<p
						class="status"
						class:bad={phase === 'taken'}
						class:good={phase === 'locked' || phase === 'welcome'}
					>
						{status}
					</p>
				</div>
				<div class="base"></div>
			</div>
		</div>

		<!-- your phone, with the authenticator app -->
		<div class="side">
			<div class="who">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="12" cy="8" r="4" fill="var(--color-brand)" />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-brand)" />
				</svg>
				<span class="wname">{tx.phoneLabel}</span>
			</div>
			<span class="mchip" class:on={mfaOn}>{mfaOn ? tx.mfaOnChip : tx.mfaOffChip}</span>
			<div class="phone" class:off={!mfaOn}>
				<span class="notch"></span>
				<p class="app">{tx.appName}</p>
				{#if mfaOn}
					<div class="otp pop">
						<span class="acct">{tx.appAccount}</span>
						<span class="digits">{spaced(code)}</span>
						<span class="timer">
							<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
								<circle
									cx="10"
									cy="10"
									r="8"
									fill="none"
									stroke="var(--color-line)"
									stroke-width="3"
								/>
								<path
									d={arc}
									fill="none"
									stroke="var(--color-brand)"
									stroke-width="3"
									stroke-linecap="round"
								/>
							</svg>
							{tx.secondsLeft.replace('{n}', String(left))}
						</span>
					</div>
				{:else}
					<div class="empty">
						<span class="bar"></span>
						<span class="bar short"></span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 380px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		overflow-y: auto;
	}
	.btns {
		display: flex;
		min-height: 46px;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.you {
		display: flex;
		width: 100%;
		max-width: 300px;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.ylabel {
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.yrow {
		display: flex;
		width: 100%;
		gap: 6px;
	}
	.codein {
		min-width: 0;
		flex: 1;
		border-radius: 10px;
		border: 1.5px solid var(--color-brand);
		background: var(--color-card);
		color: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 18px;
		letter-spacing: 0.25em;
		text-align: center;
		padding: 6px 8px;
		outline: none;
	}
	.codein.bad {
		border-color: var(--color-danger);
	}
	.codein.ok {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.go {
		border-radius: 10px;
		background: var(--color-ink);
		color: var(--color-paper);
		font-size: 13px;
		font-weight: 700;
		padding: 0 14px;
	}
	.go:disabled {
		opacity: 0.4;
	}
	.err {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-danger);
	}
	.scene {
		display: grid;
		width: 100%;
		grid-template-columns: 1.25fr 1fr;
		gap: 10px;
		align-items: start;
	}
	.side {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.wname {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.wsub {
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.stolen,
	.mchip {
		border-radius: 999px;
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-size: 9px;
		font-weight: 800;
		padding: 1px 7px;
		white-space: nowrap;
	}
	.mchip {
		background: var(--color-line);
		color: var(--color-muted);
	}
	.mchip.on {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.laptop {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}
	.screen {
		display: flex;
		width: 100%;
		min-height: 150px;
		flex-direction: column;
		gap: 4px;
		border-radius: 10px 10px 4px 4px;
		border: 5px solid var(--color-ink);
		background: var(--color-card);
		padding: 8px;
		transition: background 0.3s;
	}
	.screen.taken {
		background: var(--color-danger-soft);
	}
	.screen.blocked {
		background: var(--color-grass-soft);
	}
	.base {
		width: 112%;
		height: 7px;
		border-radius: 0 0 8px 8px;
		background: var(--color-line);
	}
	.ltitle {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.field {
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 2px 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		color: var(--color-ink);
		white-space: nowrap;
		overflow: hidden;
	}
	.field i {
		font-family: var(--font-sans);
		font-style: normal;
		font-size: 8px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.field.code {
		border-color: var(--color-amber);
	}
	.field.miss {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.status {
		margin-top: auto;
		font-size: 9.5px;
		font-weight: 700;
		line-height: 1.25;
		color: var(--color-muted);
	}
	.status.bad {
		color: var(--color-danger);
	}
	.status.good {
		color: var(--color-grass);
	}
	.phone {
		display: flex;
		width: 108px;
		height: 168px;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 8px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
		transition: opacity 0.3s;
	}
	.phone.off {
		opacity: 0.6;
	}
	.notch {
		width: 30px;
		height: 4px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.app {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.otp {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: 10px;
		background: var(--color-paper);
		padding: 8px 4px;
	}
	.acct {
		text-align: center;
		font-size: 8.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.digits {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--color-ink);
	}
	.timer {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 9px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.empty {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 5px;
		padding: 8px 4px;
	}
	.bar {
		height: 6px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.bar.short {
		width: 60%;
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 16px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.screen {
			min-height: 180px;
			padding: 10px;
		}
		.ltitle,
		.field {
			font-size: 12px;
		}
		.status {
			font-size: 11px;
		}
		.phone {
			width: 130px;
			height: 200px;
		}
		.digits {
			font-size: 21px;
		}
	}
</style>
