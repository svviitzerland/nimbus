<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import Browser from '../Browser.svelte';
	import {
		initialDataCenter,
		advanceDataCenter,
		hasPower,
		isOnline,
		type DataCenterState
	} from '../labs/data-center';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let site = $state(initialDataCenter());
	let minutes = $state(0);
	let seenUps = $state(false),
		seenGenerator = $state(false),
		seenOutage = $state(false),
		recovered = $state(false);
	const powered = $derived(hasPower(site));
	const online = $derived(isOnline(site));
	let wasOnline = true;
	function inspect() {
		if (!site.mains && !site.generator && site.ups > 0) seenUps = true;
		if (!site.mains && site.generator) seenGenerator = true;
		if (!isOnline(site)) seenOutage = true;
		if (!wasOnline && isOnline(site)) {
			recovered = true;
			onstate?.('recovered');
		} else
			onstate?.(
				!hasPower(site)
					? 'blackout'
					: site.temperature >= 50
						? 'hot'
						: !site.network
							? 'network'
							: !site.mains && site.generator
								? 'generator'
								: !site.mains
									? 'ups'
									: !site.cooling
										? 'cooling'
										: 'running'
			);
		wasOnline = isOnline(site);
		if (seenUps && seenGenerator && seenOutage && recovered) oncomplete?.();
	}
	function toggle(key: 'mains' | 'generator' | 'cooling' | 'network') {
		site = { ...site, [key]: !site[key] };
		inspect();
	}
	function advance() {
		site = advanceDataCenter(site);
		minutes += 5;
		inspect();
	}
	const controls: (keyof Pick<DataCenterState, 'mains' | 'generator' | 'cooling' | 'network'>)[] = [
		'mains',
		'generator',
		'cooling',
		'network'
	];
</script>

<LabBench text={tx} done={[seenUps, seenGenerator, seenOutage, recovered]}>
	<div class="lab-actions">
		{#each controls as key (key)}<button
				class="lab-button"
				aria-pressed={site[key]}
				onclick={() => toggle(key)}
				>{tx.labels[key]} {site[key] ? tx.labels.on : tx.labels.off}</button
			>{/each}
		<button class="lab-button primary" onclick={advance}>{tx.labels.advance}</button>
	</div>
	<div class="delivery" aria-live="polite">
		<div class="phone">
			<Browser phase={online ? 'loaded' : 'offline'} offlineText={tx.labels.offline} />
		</div>
		<div>
			<span class="lab-status">{online ? tx.labels.online : tx.labels.offline}</span>
			<p class="lab-caption">
				{!powered
					? tx.labels.noPower
					: site.temperature >= 50
						? tx.labels.tooHot
						: !site.network
							? tx.labels.noNetwork
							: tx.labels.serving}
			</p>
		</div>
	</div>
	<div class="building">
		<div class="roof">
			<span>{tx.labels.building}</span><span>{minutes} {tx.labels.minutes}</span>
		</div>
		<div class="inside">
			<div class="racks">
				{#each [1, 2, 3] as n (n)}<div>
						<Server slots={3} active={powered && site.temperature < 50} /><span
							>{tx.labels.rack} {n}</span
						>
					</div>{/each}
			</div>
			<div class="utilities">
				<div>
					<span>UPS</span><meter min="0" max="10" value={site.ups} aria-label="UPS"></meter><strong
						>{site.ups} {tx.labels.minutes}</strong
					>
				</div>
				<div>
					<span>{tx.labels.temperature}</span><meter
						min="20"
						max="70"
						low="25"
						high="40"
						optimum="24"
						value={site.temperature}
						aria-label={tx.labels.temperature}
					></meter><strong>{site.temperature} °C</strong>
				</div>
			</div>
		</div>
		<div class="floor">{tx.labels.floor}</div>
	</div>
</LabBench>

<style>
	.building {
		border: 2px solid var(--color-line);
		border-radius: 18px 18px 6px 6px;
		background: var(--color-card);
		overflow: hidden;
	}
	.roof {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		background: var(--color-paper);
		border-bottom: 1px solid var(--color-line);
		padding: 14px 18px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.inside {
		padding: 14px;
	}
	.racks {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 18px;
	}
	.racks > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: var(--color-muted);
		font-size: 11px;
	}
	.utilities {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		margin-top: 12px;
	}
	.utilities > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 12px;
		color: var(--color-muted);
	}
	meter {
		width: 100%;
		height: 16px;
		accent-color: var(--color-grass);
	}
	.floor {
		padding: 8px 12px;
		text-align: center;
		background: var(--color-paper);
		color: var(--color-muted);
		font-size: 11px;
	}
	.delivery {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
	.phone {
		width: 52px;
		height: 85px;
		overflow: hidden;
		flex: none;
	}
	.phone :global(.phone) {
		transform: scale(0.32);
		transform-origin: top left;
		max-width: none;
	}
	@media (max-width: 400px) {
		.racks {
			gap: 6px;
		}
		.inside {
			padding: 16px 10px;
		}
	}
</style>
