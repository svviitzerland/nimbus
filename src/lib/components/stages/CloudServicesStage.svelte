<script lang="ts">
	import ProviderLogo from '../ProviderLogo.svelte';
	import type { LessonText, CloudServicesText } from '$lib/chapters/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow,
		onlock
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
		onlock?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as CloudServicesText);

	// Beat 3 turns the screen on (Next waits until it is on). Beats 4 and 5 swap the catalog for
	// the IaaS, PaaS, SaaS chart (the second one with the pizza lines), and the last beat, an FYI
	// aside, brings the catalog back.
	const turnOn = 3;
	const chart = $derived(beat === 4 || beat === 5);
	// Who looks after each layer (bottom to top), per column. true means the provider.
	const MODELS: { name: string; ex: string; mine: boolean[] }[] = [
		{ name: 'IaaS', ex: 'EC2', mine: [false, true, true, true] },
		{ name: 'PaaS', ex: 'App Service', mine: [false, false, false, true] },
		{ name: 'SaaS', ex: 'Gmail', mine: [false, false, false, false] }
	];

	// Official provider service logos, bundled at build time.
	const mods = import.meta.glob('../../assets/services/*.svg', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;
	const url: Record<string, string> = {};
	for (const [p, u] of Object.entries(mods)) url[p.split('/').pop()!.replace('.svg', '')] = u;

	type Item = [string, string];
	const PROVIDERS: {
		id: 'aws' | 'azure' | 'gcp';
		name: string;
		reverse: boolean;
		items: Item[];
	}[] = [
		{
			id: 'aws',
			name: 'AWS',
			reverse: false,
			items: [
				['aws_ec2', 'EC2'],
				['aws_s3', 'S3'],
				['aws_lambda', 'Lambda'],
				['aws_rds', 'RDS'],
				['aws_dynamodb', 'DynamoDB'],
				['aws_cloudfront', 'CloudFront'],
				['aws_vpc', 'VPC'],
				['aws_eks', 'EKS']
			]
		},
		{
			id: 'azure',
			name: 'Microsoft Azure',
			reverse: true,
			items: [
				['azure_vm', 'Virtual Machines'],
				['azure_storage', 'Blob Storage'],
				['azure_functions', 'Functions'],
				['azure_sql', 'Azure SQL'],
				['azure_cosmos', 'Cosmos DB'],
				['azure_app_service', 'App Service'],
				['azure_aks', 'AKS'],
				['azure_lb', 'Load Balancer']
			]
		},
		{
			id: 'gcp',
			name: 'Google Cloud',
			reverse: false,
			items: [
				['gcp_compute_engine', 'Compute Engine'],
				['gcp_cloud_storage', 'Cloud Storage'],
				['gcp_cloud_functions', 'Cloud Functions'],
				['gcp_cloud_sql', 'Cloud SQL'],
				['gcp_bigquery', 'BigQuery'],
				['gcp_cloud_run', 'Cloud Run'],
				['gcp_gke', 'GKE'],
				['gcp_cloud_cdn', 'Cloud CDN']
			]
		}
	];

	let on = $state(false);
	let done = false;

	$effect(() => {
		onshow?.(beat >= turnOn);
		onlock?.(beat === turnOn && !on);
	});

	function powerOn() {
		if (on) return;
		on = true;
		onstate?.('open');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

<div class="wrap">
	{#if chart}
		<div class="models">
			<div class="cols">
				{#each MODELS as m, k (m.name)}
					<div class="col">
						<b class="mname">{m.name}</b>
						<div class="stack">
							{#each [3, 2, 1, 0] as l (l)}
								<span class="layer" class:you={m.mine[l]}>{tx.layers[l]}</span>
							{/each}
						</div>
						<small class="mex" class:pz={beat === 5}>{beat === 5 ? tx.pizza[k] : m.ex}</small>
					</div>
				{/each}
			</div>
			<div class="legend">
				<span><i class="sw you"></i>{tx.youLabel}</span>
				<span><i class="sw"></i>{tx.providerLabel}</span>
			</div>
			<p class="snote">{tx.serverlessNote}</p>
		</div>
	{:else}
		<div class="monitor">
			<div class="bezel" class:on>
				<div class="screen">
					{#if !on}
						<button type="button" class="power" onclick={powerOn}>
							<span class="pring">
								<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
									<path
										d="M12 3v8"
										stroke="currentColor"
										stroke-width="2.2"
										stroke-linecap="round"
									/>
									<path
										d="M7.5 6.4a7 7 0 1 0 9 0"
										stroke="currentColor"
										stroke-width="2.2"
										stroke-linecap="round"
										fill="none"
									/>
								</svg>
							</span>
							<span>{tx.openBtn}</span>
						</button>
					{:else}
						<div class="shead">
							<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.8 3.8 0 0 1 18 18z"
									fill="#cdddf6"
									stroke="#2e6fe0"
									stroke-width="1.4"
								/>
							</svg>
							<span class="stitle">{tx.screenTitle}</span>
							<span class="ssub">{tx.screenSub}</span>
						</div>
						<div class="marquee">
							{#each PROVIDERS as prov}
								<div class="mrow">
									<div class="rlabel">
										<ProviderLogo id={prov.id} size={15} />
										<span>{prov.name}</span>
									</div>
									<div class="rtrack">
										<div class="rseq" class:rev={prov.reverse}>
											{#each [...prov.items, ...prov.items] as [file, label]}
												<span class="chip">
													<img src={url[file]} alt="" width="22" height="22" />
													<span>{label}</span>
												</span>
											{/each}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="neck"></div>
			<div class="base"></div>
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.models {
		display: flex;
		width: min(94vw, 380px);
		flex-direction: column;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 14px 12px;
	}
	.cols {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.mname {
		font-size: 14px;
		color: var(--color-ink);
	}
	.stack {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 3px;
	}
	.layer {
		border-radius: 7px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		padding: 5px 2px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
	}
	.layer.you {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.mex {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.mex.pz {
		color: var(--color-grass);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 14px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.sw {
		height: 10px;
		width: 10px;
		border-radius: 3px;
		background: var(--color-brand-soft);
		border: 1px solid var(--color-brand);
	}
	.sw.you {
		background: var(--color-amber-soft);
		border-color: var(--color-amber);
	}
	.snote {
		margin: 0;
		font-size: 11px;
		color: var(--color-faint);
		text-align: center;
	}
	.monitor {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(94vw, 380px);
	}
	.bezel {
		width: 100%;
		border-radius: 16px;
		background: #1c2530;
		padding: 11px;
		box-shadow: 0 18px 40px rgba(22, 40, 60, 0.22);
		transition: background 0.3s ease;
	}
	.screen {
		position: relative;
		height: 196px;
		border-radius: 8px;
		overflow: hidden;
		background: #10161e;
		display: flex;
		flex-direction: column;
		transition: background 0.4s ease;
	}
	.bezel.on .screen {
		background: #f3f6fb;
	}
	.neck {
		width: 46px;
		height: 14px;
		background: linear-gradient(#222c38, #1a232e);
	}
	.base {
		width: 116px;
		height: 9px;
		border-radius: 0 0 7px 7px;
		background: #1c2530;
	}

	.power {
		margin: auto;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 11px;
		color: #8aa0b4;
		font-size: 12.5px;
		font-weight: 700;
		cursor: pointer;
	}
	.pring {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1.5px solid #33414f;
		color: #6fd39a;
		background: #161e27;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;
	}
	.power:hover .pring {
		transform: scale(1.06);
		border-color: #6fd39a;
	}

	.shead {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 10px 13px;
		background: #fff;
		border-bottom: 1px solid #e7ebf1;
	}
	.stitle {
		font-size: 13px;
		font-weight: 800;
		color: #1c2b33;
	}
	.ssub {
		margin-left: auto;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.marquee {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding: 6px 0;
		gap: 2px;
		animation: fadein 0.5s ease both;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.mrow {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}
	.rlabel {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		flex: none;
		padding-left: 11px;
		width: 92px;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.rlabel span {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.rtrack {
		position: relative;
		flex: 1;
		overflow: hidden;
		min-width: 0;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 92%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 9%, #000 92%, transparent);
	}
	.rseq {
		display: inline-flex;
		gap: 8px;
		padding-right: 8px;
		width: max-content;
		animation: ml 26s linear infinite;
	}
	.rseq.rev {
		animation-name: mr;
	}
	@keyframes ml {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@keyframes mr {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex: none;
		border-radius: 999px;
		background: #fff;
		border: 1px solid #e7ebf1;
		padding: 4px 11px 4px 5px;
		font-size: 11px;
		font-weight: 700;
		color: #3a4650;
		box-shadow: 0 2px 5px rgba(22, 40, 60, 0.05);
		white-space: nowrap;
	}
	.chip img {
		width: 22px;
		height: 22px;
		display: block;
	}
	@media (prefers-reduced-motion: reduce) {
		.rseq {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.monitor {
			width: 560px;
		}
		.screen {
			height: 250px;
		}
		.neck {
			width: 60px;
			height: 18px;
		}
		.base {
			width: 150px;
			height: 11px;
		}
		.stitle {
			font-size: 15px;
		}
		.rlabel {
			width: 116px;
			font-size: 10.5px;
		}
		.chip {
			font-size: 12.5px;
			padding: 5px 13px 5px 6px;
		}
		.chip img {
			width: 25px;
			height: 25px;
		}
		.power {
			font-size: 14px;
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .bezel {
		background: #0f1720;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
	}
	:global(.dark) .screen {
		background: #0a0f16;
	}
	:global(.dark) .bezel.on .screen {
		background: #1b2533;
	}
	:global(.dark) .neck {
		background: linear-gradient(#141c28, #0f1720);
	}
	:global(.dark) .base {
		background: #0f1720;
	}
	:global(.dark) .power {
		color: #6b7885;
	}
	:global(.dark) .pring {
		border-color: #2c3746;
		background: #121a24;
	}
	:global(.dark) .power:hover .pring {
		border-color: #6fd39a;
	}
	:global(.dark) .shead {
		background: #141c2a;
		border-bottom-color: #2c3746;
	}
	:global(.dark) .stitle {
		color: #e0dcd4;
	}
	:global(.dark) .chip {
		background: #1b2533;
		border-color: #2c3746;
		color: #e0dcd4;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}
</style>
