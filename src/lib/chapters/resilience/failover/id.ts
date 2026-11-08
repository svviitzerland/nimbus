import type { FailoverText } from '../../types';

export const id: FailoverText = {
	title: 'Apa itu failover?',
	intro: [
		'Sebar ke beberapa AZ aman kalau cuma satu gedung yang tumbang. Tapi kalau satu region utuh yang kena, seperti data center di Timur Tengah yang dihantam drone tadi, kamu butuh rencana yang lebih besar.',
		'Caranya, siapkan <b>region cadangan</b> di tempat lain. Region utama yang melayani, cadangan menunggu siaga. Begitu yang utama tumbang, trafik pindah ke cadangan. Perpindahan ke cadangan ini namanya <b>failover</b>, dan bisa diatur jalan otomatis seperti yang akan kamu lihat (kadang juga dilakukan manual).',
		'Mirip kantor cabang yang langsung ambil alih kalau kantor pusat tutup. Selalu ada pengganti yang siap.',
		'Saat ini baru ada region utamanya saja, tanpa cadangan. Matikan dia, rasakan akibatnya, lalu siapkan penggantinya.',
		'[ingat] Failover memindahkan pelayanan saat yang utama gagal. Cadangannya perlu siap lebih dahulu.'
	],
	reactions: {
		spof: 'Nah, tanpa region cadangan, website kamu langsung mati begitu region utama tumbang. Klik region lain untuk jadikan cadangan, lalu matikan utamanya lagi.',
		failover:
			'Mulus banget. Begitu region utama mati, trafik otomatis pindah ke region cadangan dan website kamu tetap jalan. Itulah failover.'
	},
	primaryLabel: 'Utama',
	standbyLabel: 'Cadangan',
	serving: 'Melayani',
	standbyState: 'Siaga',
	failingOver: 'Pindah ke cadangan',
	kill: 'Matikan utama',
	addHint: 'Klik region lain untuk menyiapkan cadangan',
	statusUp: 'Online',
	statusDown: 'Mati',
	regions: { virginia: 'Virginia', singapore: 'Singapura' }
};
