<script lang="ts">
	// Guided "watch" stage for config and secrets. The app.js editor sits on top. First the
	// database address and the payment key are typed straight into it (hard coding), which breaks
	// on the server and leaks the key on GitHub. Then the code asks for them by name (environment
	// variables), the laptop keeps its values in .env (listed in .gitignore, so it never travels),
	// and the server gets its own values from the host dashboard. No interaction, it plays itself.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import { sceneClock } from '$lib/components/stages/backend-guided/clock.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ConfigSecretsText } from '$lib/chapters/web/config-secrets/types';

	let { text, beat = 0, oncomplete, onshow }: StageProps = $props();
	const tx = $derived(text as ConfigSecretsText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const clock = sceneClock(() => step);
	/** True once the current scene has played for `ms` (always true under reduced motion). */
	const after = (ms: number) => clock.reduced || clock.t > ms;

	// Real looking values, the same in every language (they are code).
	const LAPTOP = { db: 'localhost:5432', key: 'sk_test_4f9a' };
	const SERVER = { db: 'db.nimbus.com:5432', key: 'sk_live_7c2e' };
	const NEW_KEY = 'sk_live_91bd';

	type CodeLine = { code: string; tone?: 'warn' | 'bad' | 'good' };
	const lines = $derived.by<CodeLine[]>(() => {
		const use: CodeLine[] = [{ code: 'connect(db)' }, { code: 'charge(order, payKey)' }];
		if (step === 0) return use;
		if (step <= 2)
			return [
				{ code: `const db = "${LAPTOP.db}"`, tone: 'warn' },
				{ code: `const payKey = "${SERVER.key}"`, tone: step === 2 ? 'bad' : 'warn' },
				...use
			];
		const fresh = step === 3 ? 'good' : undefined;
		return [
			{ code: 'const db = process.env.DATABASE_URL', tone: fresh },
			{ code: 'const payKey = process.env.PAY_KEY', tone: fresh },
			...use
		];
	});
</script>

{#snippet visual()}
	<div class="vis">
		<div class="win">
			<div class="bar">
				<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="fname">app.js</span>
			</div>
			<div class="code">
				{#each lines as l, k (l.code + k)}
					<div class="ln {l.tone ?? ''}" in:fade={{ duration: 260, delay: k * 60 }}>{l.code}</div>
				{/each}
			</div>
		</div>

		<div class="row">
			{#key step}
				<div class="scene" in:fade={{ duration: 300 }}>
					{#if step === 0}
						<div class="pair">
							{#each [{ label: tx.laptopLabel, v: LAPTOP }, { label: tx.serverLabel, v: SERVER }] as p (p.label)}
								<div class="card">
									<p class="cap">{p.label}</p>
									<p class="name">DATABASE_URL</p>
									<p class="val">{p.v.db}</p>
									<p class="name">PAY_KEY</p>
									<p class="val">{p.v.key}</p>
								</div>
							{/each}
						</div>
					{:else if step === 1}
						<div class="card wide">
							<p class="cap">{tx.serverLabel}</p>
							<p class="name">const db</p>
							<p class="val" class:struck={after(900)}>{LAPTOP.db}</p>
							<p class="note bad" class:show={after(900)}>
								<span class="x" aria-hidden="true"></span>{tx.noDb}
							</p>
						</div>
					{:else if step === 2}
						<div class="card wide">
							<p class="cap">
								{tx.repoLabel}<span class="pill">{tx.publicTag}</span>
							</p>
							<p class="file">app.js</p>
							<p class="val leak">payKey = "{SERVER.key}"</p>
							<p class="note bad" class:show={after(1200)}>
								<span class="eye" aria-hidden="true"></span>{tx.botFound}
							</p>
						</div>
					{:else if step === 3}
						<div class="envbox">
							<p class="cap">{tx.envBox}</p>
							<div class="chips">
								<span class="chip">DATABASE_URL</span>
								<span class="chip">PAY_KEY</span>
							</div>
							<p class="small">{tx.envCaption}</p>
						</div>
					{:else if step === 4}
						<div class="win small-win">
							<div class="bar">
								<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
								<span class="fname">.env</span>
								<span class="where">{tx.laptopLabel}</span>
							</div>
							<div class="code">
								<div class="ln" class:hid={!after(400)}>DATABASE_URL={LAPTOP.db}</div>
								<div class="ln" class:hid={!after(900)}>PAY_KEY={LAPTOP.key}</div>
							</div>
						</div>
					{:else if step === 5}
						<div class="pair">
							<div class="win small-win">
								<div class="bar">
									<span class="fname">.gitignore</span>
								</div>
								<div class="code">
									<div class="ln good">.env</div>
								</div>
							</div>
							<div class="card">
								<p class="cap">{tx.repoLabel}</p>
								<p class="filerow" class:hid={!after(700)}>
									<span class="tick" aria-hidden="true"></span>app.js<em>{tx.sent}</em>
								</p>
								<p class="filerow" class:hid={!after(1100)}>
									<span class="tick" aria-hidden="true"></span>.gitignore<em>{tx.sent}</em>
								</p>
								<p class="filerow home" class:hid={!after(1500)}>
									<span class="x" aria-hidden="true"></span>.env<em>{tx.stayed}</em>
								</p>
							</div>
						</div>
					{:else if step === 6}
						<div class="win dash">
							<div class="bar">
								<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
								<span class="fname">{tx.dashboard}</span>
							</div>
							<div class="dbody">
								<p class="dtitle">{tx.dashTitle}</p>
								<div class="drow" class:hid={!after(500)}>
									<span class="name">DATABASE_URL</span>
									<span class="val">{SERVER.db}</span>
								</div>
								<div class="drow" class:hid={!after(1000)}>
									<span class="name">PAY_KEY</span>
									<span class="val dots">••••••••</span>
								</div>
							</div>
						</div>
					{:else if step === 7}
						<div class="rules">
							{#each [{ f: 'app.js', to: tx.repoLabel, w: tx.where.code, c: 'open' }, { f: '.env', to: tx.laptopLabel, w: tx.where.env, c: 'home' }, { f: tx.dashboard, to: tx.serverLabel, w: tx.where.dash, c: 'srv' }] as r, k (r.f)}
								<div class="rrow {r.c}" class:hid={!after(300 + k * 500)}>
									<span class="rf">{r.f}</span>
									<span class="rw">{r.to}, {r.w}</span>
								</div>
							{/each}
							<p class="rule" class:hid={!after(1900)}>{tx.rule}</p>
						</div>
					{:else}
						<div class="card wide keys">
							<p class="cap">PAY_KEY</p>
							<p class="keyrow">
								<span class="val" class:struck={after(700)}>{SERVER.key}</span>
								<span class="pill bad" class:hid={!after(700)}>{tx.revoked}</span>
							</p>
							<p class="keyrow" class:hid={!after(1600)}>
								<span class="val goodv">{NEW_KEY}</span>
								<span class="pill good">{tx.fresh}</span>
							</p>
						</div>
					{/if}
				</div>
			{/key}
		</div>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding: 0 4px 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		max-width: 420px;
		flex-direction: column;
		gap: 12px;
	}
	.win {
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid var(--color-line);
		padding: 7px 10px;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.lights {
		display: inline-flex;
		gap: 4px;
	}
	.lights i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.fname {
		flex: 1;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 700;
	}
	.where {
		font-weight: 700;
		color: var(--color-brand);
	}
	.code {
		background: var(--color-paper);
		padding: 9px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		line-height: 1.7;
		color: var(--color-ink);
	}
	.ln {
		overflow-wrap: anywhere;
		border-radius: 4px;
		padding: 0 4px;
		transition:
			background 0.3s,
			opacity 0.4s;
	}
	.ln.warn {
		background: var(--color-amber-soft);
	}
	.ln.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 700;
	}
	.ln.good {
		background: var(--color-grass-soft);
	}

	.row {
		display: grid;
		min-height: 168px;
	}
	.scene {
		display: flex;
		grid-area: 1 / 1;
		align-items: center;
		justify-content: center;
	}
	.pair {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		align-items: start;
	}
	.card,
	.envbox {
		min-width: 0;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 12px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.06);
	}
	.card.wide,
	.envbox,
	.dash,
	.rules {
		width: 100%;
	}
	.cap {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 6px;
		font-size: 12px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.name {
		margin: 4px 0 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.03em;
		color: var(--color-faint);
	}
	.val {
		margin: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand);
		overflow-wrap: anywhere;
		transition: color 0.3s;
	}
	.val.struck {
		color: var(--color-danger);
		text-decoration: line-through;
	}
	.val.leak {
		border-radius: 6px;
		background: var(--color-danger-soft);
		padding: 3px 6px;
		color: var(--color-danger);
	}
	.val.goodv {
		color: var(--color-grass);
	}
	.file {
		margin: 0 0 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		color: var(--color-muted);
	}
	.pill {
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-muted);
		transition: opacity 0.4s;
	}
	.pill.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.pill.good {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.note {
		display: flex;
		align-items: center;
		gap: 7px;
		margin: 10px 0 0;
		font-size: 12px;
		font-weight: 700;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.note.show {
		opacity: 1;
		transform: none;
	}
	.note.bad {
		color: var(--color-danger);
	}
	.x,
	.tick,
	.eye {
		position: relative;
		display: inline-block;
		flex: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
	}
	.x {
		background: var(--color-danger-soft);
		border: 1.5px solid var(--color-danger);
	}
	.x::before,
	.x::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 7px;
		height: 1.6px;
		background: var(--color-danger);
		transform: translate(-50%, -50%) rotate(45deg);
	}
	.x::after {
		transform: translate(-50%, -50%) rotate(-45deg);
	}
	.tick {
		background: var(--color-grass-soft);
		border: 1.5px solid var(--color-grass);
	}
	.tick::after {
		content: '';
		position: absolute;
		left: 3.5px;
		top: 1.5px;
		width: 3.5px;
		height: 6px;
		border: solid var(--color-grass);
		border-width: 0 1.6px 1.6px 0;
		transform: rotate(45deg);
	}
	.eye {
		border: 1.5px solid var(--color-danger);
		border-radius: 50% 0;
		transform: rotate(45deg);
	}
	.eye::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-danger);
		transform: translate(-50%, -50%);
	}

	.envbox {
		border: 2px solid var(--color-grass);
		background: var(--color-grass-soft);
		text-align: center;
	}
	.envbox .cap {
		justify-content: center;
		color: var(--color-grass);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin: 6px 0;
	}
	.chip {
		border-radius: 8px;
		border: 1.5px solid var(--color-grass);
		background: var(--color-card);
		padding: 4px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.small {
		margin: 4px 0 0;
		font-size: 12px;
		color: var(--color-muted);
	}
	.small-win {
		width: 100%;
	}
	.filerow {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 5px 0 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
		transition: opacity 0.4s;
	}
	.filerow em {
		margin-left: auto;
		font-family: var(--font-sans, inherit);
		font-size: 10px;
		font-style: normal;
		font-weight: 700;
		color: var(--color-grass);
	}
	.filerow.home {
		color: var(--color-muted);
	}
	.filerow.home em {
		color: var(--color-danger);
	}
	.hid {
		opacity: 0;
	}
	.drow,
	.keyrow,
	.rrow,
	.rule {
		transition: opacity 0.45s;
	}

	.dbody {
		padding: 10px 12px 12px;
	}
	.dtitle {
		margin: 0 0 8px;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.drow {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px 10px;
		border-top: 1px solid var(--color-line);
		padding: 6px 0;
	}
	.drow .name {
		margin: 0;
	}
	.val.dots {
		letter-spacing: 0.1em;
		color: var(--color-muted);
	}

	.rules {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.rrow {
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
	}
	.rf {
		flex: none;
		min-width: 92px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 800;
	}
	.rw {
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.rrow.open .rf {
		color: var(--color-brand);
	}
	.rrow.home .rf {
		color: var(--color-amber);
	}
	.rrow.srv .rf {
		color: var(--color-grass);
	}
	.rule {
		margin: 2px 0 0;
		text-align: center;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.keyrow {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 6px 0 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.ln,
		.val,
		.note,
		.pill,
		.filerow,
		.drow,
		.keyrow,
		.rrow,
		.rule {
			transition: none;
		}
	}
</style>
