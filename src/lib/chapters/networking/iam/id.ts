import type { IamText } from '../types';

export const id: IamText = {
	title: 'Identitas dan Akses',
	intro: [
		'Bukan cuma tamu dari luar yang perlu diatur. Orang dalam pun tidak boleh bisa menyentuh segalanya.',
		'Di kantor, tiap karyawan pegang <b>kartu akses</b>. Kartu itu menjawab dua hal, kamu siapa (<b>autentikasi</b>) dan kamu boleh apa (<b>otorisasi</b>).',
		'Aturan emasnya namanya <b>least privilege</b>, kasih akses seperlunya saja. Anak magang tidak butuh kunci ruang server, dan kalau kartunya dicuri, pencurinya juga cuma bisa sedikit.',
		'Kebetulan Budi si anak magang baru mulai hari ini. Kasih dia dua kartu yang berbeda bergantian, lalu cek pintu mana saja yang terbuka.',
		'[ingat] Tentukan identitas, tindakan yang diizinkan, dan sumber daya yang boleh diakses.'
	],
	reactions: {
		admin:
			'Hak admin mengizinkan semua tindakan dalam contoh ini. Pilih akses terbatas agar Budi hanya dapat melakukan tugas yang dibutuhkan.',
		scoped:
			'Nah, kartu magang cuma membuka pintu yang memang dia perlukan. Kalau hilang pun kerusakannya kecil. Inilah least privilege, akses secukupnya saja.'
	},
	personLabel: 'Budi, anak magang',
	badgeAdmin: 'Kartu admin',
	badgeAdminSub: 'semua pintu terbuka',
	badgeScoped: 'Kartu magang',
	badgeScopedSub: 'seperlunya saja',
	doors: [
		{ key: 'read', label: 'Lihat laporan', scoped: true },
		{ key: 'db', label: 'Hapus database', scoped: false },
		{ key: 'server', label: 'Atur server', scoped: false }
	],
	openTag: 'terbuka',
	shutTag: 'terkunci',
	noteIdle: 'Pilih kartu untuk Budi',
	noteAdmin: 'Semua terbuka, termasuk yang tidak dia butuhkan',
	noteScoped: 'Cuma yang perlu yang terbuka'
};
