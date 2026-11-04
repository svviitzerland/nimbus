import type { VcCommandsText } from '../types';

export const id: VcCommandsText = {
	title: 'Apa itu Git?',
	intro: [
		'Bayangkan kamu ngerjain tugas lalu menyimpannya jadi <i>tugas_final.doc</i>. Besok kamu revisi, jadi <i>tugas_final_beneran.doc</i>. Lusa <i>tugas_final_fix2.doc</i>. Berantakan kan, dan kamu tetap deg degan takut menimpa yang lama.',
		'Git lahir buat masalah ini. Tiap kali kamu bilang simpan versi ini, Git memotret seluruh isi filemu jadi satu <b>snapshot</b> (nama aslinya <b>commit</b>) lengkap dengan catatan singkat. Filemu tetap satu, tapi tiap versinya tersimpan rapi di riwayat.',
		'Di balik tombol Commit ada perintah harian. <b>git status</b> melihat apa yang berubah, <b>git add</b> menaruhnya ke <b>staging area</b> (meja tempat kamu memilih apa yang ikut dipotret), lalu <b>git commit</b> memotretnya. Nanti <b>git push</b> mengirim snapshot ke tempat online dan <b>git pull</b> mengambil yang terbaru dari sana.',
		'Coba sendiri. Tekan Commit buat memotret versinya, ulangi beberapa kali, lalu buka snapshot lama dan lihat, tidak ada yang hilang.'
	],
	reactions: {
		firstCommit:
			'Snapshot pertama tersimpan. Isi filemu sekarang terekam utuh di riwayat, dan filenya tetap yang itu itu juga.',
		grew: 'Nambah satu snapshot lagi. Tiap commit menyimpan versi baru tanpa menghapus yang lama, jadi riwayatmu makin panjang.',
		checkout:
			'Nah, ini intinya. Kamu balik ke snapshot lama dan isinya masih persis seperti dulu. Git menyimpan semuanya, jadi kamu bebas menengok ke belakang kapan saja.',
		latest:
			'Balik lagi ke versi terbaru. Menengok ke belakang tadi tidak mengubah apa apa, semua versimu aman.'
	},
	docLabel: 'Belum ada snapshot',
	commitBtn: 'Commit',
	historyLabel: 'Riwayat',
	snapshotLabel: 'Snapshot {n}',
	commitMsgs: ['Draft pertama', 'Rapikan pembuka', 'Tambah penutup', 'Perbaiki typo'],
	latestChip: 'Terbaru',
	viewingChip: 'Lihat snapshot {n}',
	backLatest: 'Kembali ke terbaru',
	folderLabel: 'Folder kerja',
	stagingLabel: 'Staging area',
	onlineLabel: 'Tempat online',
	changedTag: 'berubah',
	cmdHints: { status: 'lihat', add: 'pilih', commit: 'potret', push: 'kirim', pull: 'ambil' }
};
