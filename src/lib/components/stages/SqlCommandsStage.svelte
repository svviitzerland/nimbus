<script lang="ts">
	// A guided "watch" stage for the families of SQL commands. Four family chips sit on top, a
	// little editor types one command at a time, and the users table of nimbus.com reacts to it.
	// CREATE builds the empty shape, ALTER adds a column, INSERT fills rows, SELECT, UPDATE and
	// DELETE work on them, GRANT and REVOKE flip a permission, COMMIT saves a change, and the last
	// scene shows the big erasers. Nothing to do, every scene plays and loops by itself.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type {
		SqlCommandsText,
		SqlCommandsUser,
		SqlFamily
	} from '$lib/chapters/web/sql-commands/types';

	let { text, oncomplete, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as SqlCommandsText);

	const FAMILIES: SqlFamily[] = ['ddl', 'dml', 'dcl', 'tcl'];
	const COMMANDS: Record<SqlFamily, string[]> = {
		ddl: ['CREATE', 'ALTER', 'DROP'],
		dml: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
		dcl: ['GRANT', 'REVOKE'],
		tcl: ['COMMIT', 'ROLLBACK']
	};
	const PERMS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
	const APP_PERMS = ['SELECT', 'INSERT', 'UPDATE'];
	// the family in focus on each scene (null means the chips take turns)
	const FAMILY_OF: (SqlFamily | null)[] = [
		null,
		'ddl',
		'ddl',
		'dml',
		'dml',
		'dcl',
		'tcl',
		null,
		null
	];

	type View = {
		exists: boolean;
		cols: number; // 3 without the city column, 4 with it
		rows: SqlCommandsUser[];
		lit: number | null;
		changed: number | null;
		gone: number[];
		status: 'pending' | 'saved' | null;
		dropped: boolean;
		grant: boolean;
	};
	type Phase = { code: string; fam: SqlFamily; apply: (v: View) => View };
	type Plan = { start: View; phases: Phase[]; stack?: boolean };

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	const last = $derived(tx.panels.length - 1);
	const scene = $derived(peek ?? Math.min(beat, last));

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	const base = (over: Partial<View> = {}): View => ({
		exists: true,
		cols: 4,
		rows: tx.users,
		lit: null,
		changed: null,
		gone: [],
		status: null,
		dropped: false,
		grant: false,
		...over
	});
	const moved = (v: View, id: number): SqlCommandsUser[] =>
		v.rows.map((r) => (r.id === id ? { ...r, city: tx.newCity } : r));

	const plan = $derived.by<Plan>(() => {
		const t = tx.tableName;
		const c = tx.columns;
		const u = tx.users;
		const insert = (r: SqlCommandsUser): Phase => ({
			code: `INSERT INTO ${t}\nVALUES (${r.id}, '${r.name}', '${r.email}', '${r.city}');`,
			fam: 'dml',
			apply: (v) => ({ ...v, rows: [...v.rows, r] })
		});
		const update: Phase = {
			code: `UPDATE ${t} SET ${c.city} = '${tx.newCity}'\nWHERE ${c.id} = 2;`,
			fam: 'dml',
			apply: (v) => ({ ...v, lit: null, changed: 2, rows: moved(v, 2) })
		};
		switch (scene) {
			case 0:
				return { start: base({ exists: false, rows: [] }), phases: [] };
			case 1:
				return {
					start: base({ exists: false, cols: 3, rows: [] }),
					phases: [
						{
							code: `CREATE TABLE ${t} (\n  ${c.id} INT,\n  ${c.name} TEXT,\n  ${c.email} TEXT\n);`,
							fam: 'ddl',
							apply: (v) => ({ ...v, exists: true })
						}
					]
				};
			case 2:
				return {
					start: base({ cols: 3, rows: [] }),
					phases: [
						{
							code: `ALTER TABLE ${t}\n  ADD ${c.city} TEXT;`,
							fam: 'ddl',
							apply: (v) => ({ ...v, cols: 4 })
						}
					]
				};
			case 3:
				return { start: base({ rows: [] }), phases: u.map(insert) };
			case 4:
				return {
					start: base(),
					phases: [
						{
							code: `SELECT * FROM ${t}\nWHERE ${c.city} = '${u[0].city}';`,
							fam: 'dml',
							apply: (v) => ({ ...v, lit: 1 })
						},
						update,
						{
							code: `DELETE FROM ${t}\nWHERE ${c.id} = 3;`,
							fam: 'dml',
							apply: (v) => ({ ...v, changed: null, gone: [3] })
						}
					]
				};
			case 5:
				return {
					start: base(),
					phases: [
						{
							code: `GRANT SELECT ON ${t}\nTO ${tx.staffUser};`,
							fam: 'dcl',
							apply: (v) => ({ ...v, grant: true })
						},
						{
							code: `REVOKE SELECT ON ${t}\nFROM ${tx.staffUser};`,
							fam: 'dcl',
							apply: (v) => ({ ...v, grant: false })
						}
					]
				};
			case 6:
				return {
					start: base(),
					stack: true,
					phases: [
						{ code: 'BEGIN;', fam: 'tcl', apply: (v) => v },
						{ ...update, apply: (v) => ({ ...update.apply(v), status: 'pending' }) },
						{ code: 'COMMIT;', fam: 'tcl', apply: (v) => ({ ...v, status: 'saved' }) }
					]
				};
			case 7:
				return { start: base(), phases: [] };
			default:
				return {
					start: base(),
					phases: [
						{
							code: `DELETE FROM ${t};`,
							fam: 'dml',
							apply: (v) => ({ ...v, gone: v.rows.map((r) => r.id) })
						},
						{ code: `DROP TABLE ${t};`, fam: 'ddl', apply: (v) => ({ ...v, dropped: true }) }
					]
				};
		}
	});

	let view = $state<View>({
		exists: false,
		cols: 4,
		rows: [],
		lit: null,
		changed: null,
		gone: [],
		status: null,
		dropped: false,
		grant: false
	});
	let phase = $state(0);
	let typed = $state(0);

	// One little script per scene. Type the command, let the table react, hold, then the next
	// command. After the last one the scene rests a moment and plays again from the start.
	$effect(() => {
		const p = plan;
		const n = p.phases.length;
		if (reduced || n === 0) {
			view = p.phases.reduce((v, ph) => ph.apply(v), p.start);
			phase = Math.max(0, n - 1);
			typed = n ? p.phases[n - 1].code.length : 0;
			return;
		}
		let t: ReturnType<typeof setTimeout>;
		const start = () => {
			view = p.start;
			phase = 0;
			typed = 0;
			t = setTimeout(type, 600);
		};
		const type = () => {
			const len = p.phases[phase].code.length;
			if (typed < len) {
				typed += 1;
				t = setTimeout(type, 34);
			} else {
				t = setTimeout(() => {
					view = p.phases[phase].apply(view);
					t = setTimeout(next, 1700);
				}, 350);
			}
		};
		const next = () => {
			if (phase < n - 1) {
				phase += 1;
				typed = 0;
				t = setTimeout(type, 300);
			} else {
				t = setTimeout(start, 2200);
			}
		};
		start();
		return () => clearTimeout(t);
	});

	// the chips take turns on the opening and remember scenes
	let turn = $state(0);
	$effect(() => {
		const sc = scene;
		turn = 0;
		if (reduced || (sc !== 0 && sc !== 7)) return;
		const t = setInterval(() => (turn = (turn + 1) % 5), 1100);
		return () => clearInterval(t);
	});

	// A scene can have fewer commands than the previous one. Clamp reads before the
	// reset effect runs so rapid navigation never indexes a phase from the old scene.
	const visiblePhase = $derived(Math.min(phase, Math.max(0, plan.phases.length - 1)));
	const lines = $derived.by(() => {
		const ph = plan.phases;
		if (!ph.length) return [];
		const done = plan.stack
			? ph.slice(0, visiblePhase).map((p) => ({ text: p.code, done: true }))
			: [];
		return [...done, { text: ph[visiblePhase].code.slice(0, typed), done: false }];
	});
	const typing = $derived(
		plan.phases.length > 0 && typed < (plan.phases[visiblePhase]?.code.length ?? 0)
	);
	const fam = $derived(plan.phases[visiblePhase]?.fam ?? null);
	const onFamily = (f: SqlFamily) => {
		if (scene === 0 || scene === 7) return reduced || turn === FAMILIES.indexOf(f) + 1;
		if (scene === 8) return f === fam;
		return FAMILY_OF[scene] === f;
	};
	const colKeys = $derived((['id', 'name', 'email', 'city'] as const).slice(0, view.cols));
	const showEditor = $derived(scene !== 0 && scene !== 7);
	const showAccess = $derived(scene === 5);
	// keywords in the editor get the brand colour
	const KW =
		/\b(CREATE|TABLE|ALTER|ADD|DROP|INSERT|INTO|VALUES|SELECT|FROM|WHERE|UPDATE|SET|DELETE|GRANT|REVOKE|ON|TO|BEGIN|COMMIT|INT|TEXT)\b/g;
	const paint = (s: string) =>
		s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(KW, '<b>$1</b>');
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				<div class="families">
					{#each FAMILIES as f (f)}
						<div class="fam {f}" class:on={onFamily(f)} class:danger={s === 8 && onFamily(f)}>
							<b>{f.toUpperCase()}</b>
							<span>{tx.familyWords[f]}</span>
						</div>
					{/each}
				</div>

				{#if showEditor}
					<div class="editor">
						<div class="bar">
							<i></i><i></i><i></i>
							<span>{tx.fileName}</span>
							{#if fam}
								<em class={fam}>{fam.toUpperCase()}</em>
							{/if}
						</div>
						<div class="code" class:tall={plan.stack}>
							{#each lines as l, k (k)}
								<div class="line" class:done={l.done}>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html paint(l.text)}{#if typing && !l.done}<span class="caret"></span>{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if s === 7}
					<div class="cheat" in:fade={{ duration: 250 }}>
						<p class="label">{tx.cheatLabel}</p>
						{#each FAMILIES as f, k (f)}
							<div class="cheat-row {f}" class:on={reduced || turn === k + 1}>
								<b class="chip">{f.toUpperCase()}</b>
								<div class="what">
									<span class="long">{tx.familyNames[f]}</span>
									<span class="cmds">{COMMANDS[f].join(' ')}</span>
								</div>
								<span class="word">{tx.familyWords[f]}</span>
							</div>
						{/each}
					</div>
				{/if}

				{#if showAccess}
					<div class="access" in:fade={{ duration: 250 }}>
						<p class="label">{tx.accessLabel}</p>
						{#each [{ who: tx.appLabel, mark: 'app' }, { who: tx.staffLabel, mark: 'D' }] as acc (acc.mark)}
							<div class="acct">
								<div class="who">
									<span class="avatar" class:app={acc.mark === 'app'}>
										{#if acc.mark === 'app'}
											<svg viewBox="0 0 20 20" aria-hidden="true"
												><rect x="2" y="3" width="16" height="11" rx="2" /><path d="M7 17h6" /></svg
											>
										{:else}{acc.mark}{/if}
									</span>
									{acc.who}
								</div>
								<div class="perms">
									{#each PERMS as p (p)}
										{@const ok =
											acc.mark === 'app' ? APP_PERMS.includes(p) : p === 'SELECT' && view.grant}
										<span class="perm" class:ok>{p}</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="table-card" class:gone={view.dropped}>
						<p class="table-name">
							{tx.tableName}
							{#if view.status}
								<span class="status {view.status}">
									{view.status === 'saved' ? tx.saved : tx.pending}
								</span>
							{/if}
						</p>
						{#if view.dropped}
							<p class="empty bad" in:fade={{ duration: 300 }}>{tx.dropped}</p>
						{:else if !view.exists}
							<p class="empty">{tx.noTable}</p>
						{:else}
							<table in:fade={{ duration: 300 }}>
								<thead>
									<tr>
										{#each colKeys as k (k)}
											<th class:num={k === 'id'} in:fade={{ duration: 400 }}>{tx.columns[k]}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each view.rows as r (r.id)}
										<tr
											class="row"
											class:lit={view.lit === r.id}
											class:gone={view.gone.includes(r.id)}
										>
											<td class="num">{r.id}</td>
											<td>{r.name}</td>
											<td class="mail">{r.email}</td>
											{#if view.cols > 3}
												<td class:changed={view.changed === r.id}>{r.city}</td>
											{/if}
										</tr>
									{:else}
										<tr><td class="none" colspan={view.cols}>{tx.noRows}</td></tr>
									{/each}
								</tbody>
							</table>
						{/if}
					</div>
				{/if}

				{#if s === 7}
					<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		min-width: 0;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
	}

	/* the four family chips */
	.families {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
	}
	.fam {
		--c: var(--color-brand);
		--soft: var(--color-brand-soft);
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1.5px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 6px 4px;
		opacity: 0.55;
		transition:
			opacity 0.3s,
			border-color 0.3s,
			background 0.3s,
			transform 0.3s;
	}
	.fam.dml {
		--c: var(--color-grass);
		--soft: var(--color-grass-soft);
	}
	.fam.dcl {
		--c: var(--color-amber);
		--soft: var(--color-amber-soft);
	}
	.fam.tcl {
		--c: var(--color-muted);
		--soft: var(--color-paper);
	}
	.fam b {
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0.04em;
		color: var(--c);
	}
	.fam span {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.fam.on {
		opacity: 1;
		border-color: var(--c);
		background: var(--soft);
		transform: translateY(-2px);
	}
	.fam.danger {
		--c: var(--color-danger);
		--soft: var(--color-danger-soft);
	}

	/* the editor */
	.editor {
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 7px 12px;
	}
	.bar i {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.bar span {
		margin-left: 6px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.bar em {
		margin-left: auto;
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 1px 8px;
		font-size: 10.5px;
		font-style: normal;
		font-weight: 800;
		color: var(--color-brand);
	}
	.bar em.dml {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.bar em.dcl {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.bar em.tcl {
		background: var(--color-paper);
		color: var(--color-muted);
		box-shadow: inset 0 0 0 1px var(--color-line);
	}
	.code {
		min-height: calc(13px * 1.6 * 5 + 20px);
		padding: 10px 14px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		line-height: 1.6;
	}
	.code.tall {
		min-height: calc(13px * 1.6 * 4 + 20px);
	}
	.line {
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--color-ink);
	}
	.line.done {
		opacity: 0.55;
	}
	.line :global(b) {
		font-weight: 700;
		color: var(--color-brand);
	}
	.caret {
		display: inline-block;
		height: 1em;
		width: 2px;
		margin-left: 1px;
		vertical-align: -2px;
		background: var(--color-brand);
		animation: blink 0.9s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	/* the users table */
	.table-card,
	.access,
	.cheat {
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 12px 8px;
	}
	.table-card {
		transition:
			opacity 0.5s,
			transform 0.5s;
	}
	.table-card.gone {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
	}
	.table-name {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 6px 4px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.status {
		border-radius: 999px;
		padding: 1px 8px;
		font-family: var(--font-sans, inherit);
		font-size: 10.5px;
		font-weight: 800;
	}
	.status.pending {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.status.saved {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.empty {
		margin: 0;
		border: 1.5px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-paper);
		padding: 22px 10px;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.empty.bad {
		border-color: var(--color-danger-soft);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	th {
		border-bottom: 1.5px solid var(--color-line);
		padding: 4px 6px 6px;
		text-align: left;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	td {
		border-bottom: 1px solid var(--color-line);
		padding: 6px;
		color: var(--color-ink);
		transition:
			background 0.35s,
			color 0.35s;
	}
	tr:last-child td {
		border-bottom: none;
	}
	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
		width: 1.5em;
	}
	.mail {
		word-break: break-all;
	}
	.row {
		animation: grow 0.45s ease-out both;
		transition:
			background 0.35s,
			opacity 0.4s;
	}
	@keyframes grow {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.row.lit {
		background: var(--color-brand-soft);
	}
	.row.gone {
		background: var(--color-danger-soft);
		opacity: 0.45;
	}
	.row.gone td {
		text-decoration: line-through;
		color: var(--color-danger);
	}
	td.changed {
		background: var(--color-amber-soft);
		font-weight: 700;
		color: var(--color-amber);
	}
	td.none {
		padding: 14px 6px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-faint);
	}

	/* who may do what */
	.label {
		margin: 0 0 8px 2px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.acct {
		border-top: 1px solid var(--color-line);
		padding: 9px 2px;
	}
	.acct:first-of-type {
		border-top: none;
		padding-top: 0;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.avatar {
		display: grid;
		height: 26px;
		width: 26px;
		place-items: center;
		border-radius: 999px;
		background: var(--color-amber-soft);
		font-size: 12px;
		font-weight: 800;
		color: var(--color-amber);
	}
	.avatar.app {
		background: var(--color-brand-soft);
	}
	.avatar svg {
		height: 16px;
		width: 16px;
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.perms {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-top: 7px;
		padding-left: 34px;
	}
	.perm {
		border: 1.5px solid var(--color-line);
		border-radius: 8px;
		padding: 2px 7px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
		opacity: 0.6;
		transition:
			background 0.3s,
			color 0.3s,
			border-color 0.3s,
			opacity 0.3s;
	}
	.perm.ok {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
		opacity: 1;
	}

	/* the cheat sheet */
	.cheat-row {
		--c: var(--color-brand);
		--soft: var(--color-brand-soft);
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 12px;
		padding: 7px 8px;
		transition: background 0.3s;
	}
	.cheat-row.dml {
		--c: var(--color-grass);
		--soft: var(--color-grass-soft);
	}
	.cheat-row.dcl {
		--c: var(--color-amber);
		--soft: var(--color-amber-soft);
	}
	.cheat-row.tcl {
		--c: var(--color-muted);
		--soft: var(--color-paper);
	}
	.cheat-row.on {
		background: var(--soft);
	}
	.chip {
		flex: none;
		width: 44px;
		border-radius: 8px;
		background: var(--soft);
		padding: 3px 0;
		text-align: center;
		font-size: 12px;
		font-weight: 800;
		color: var(--c);
	}
	.cheat-row.on .chip {
		background: var(--color-card);
	}
	.what {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
	}
	.long {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.cmds {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.word {
		flex: none;
		font-size: 13px;
		font-weight: 800;
		color: var(--c);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.code {
			font-size: 12px;
			min-height: calc(12px * 1.6 * 3 + 20px);
		}
		.code.tall {
			min-height: calc(12px * 1.6 * 3 + 20px);
		}
		table {
			font-size: 12px;
		}
		th,
		td {
			padding-left: 4px;
			padding-right: 4px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fam,
		.row,
		td,
		.perm,
		.cheat-row,
		.table-card {
			transition: none;
			animation: none;
		}
		.caret {
			animation: none;
		}
	}
</style>
