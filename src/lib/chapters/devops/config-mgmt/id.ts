import type { ConfigMgmtText } from './types';

export const id: ConfigMgmtText = {
	title: 'Configuration management',
	intro: [
		'nimbus.com sudah ramai, dan sekarang jalan di sepuluh server di belakang [[load balancer|traffic/load-balancer]]. Hari ini ada versi baru aplikasinya, dan kesepuluh server itu harus diperbarui semua.',
		'Cara manualnya, masuk ke tiap server lewat [[SSH|cloud/remote-access]], ketik perintah yang sama, cek berhasil, lalu pindah ke server berikutnya. Sepuluh kali. Di tengah jalan kamu mulai capek, lalu ada typo yang lolos.',
		'Alat <b>configuration management</b> mengerjakan ini untukmu. Kamu tulis sekali seperti apa seharusnya setiap server (versi aplikasi berapa, pengaturannya apa), lalu alatnya membuat semua server jadi sama.',
		'Salah satu yang populer namanya <b>Ansible</b>. Daftar langkahnya disimpan di file bernama <b>playbook</b>. Ansible masuk ke semua server untukmu, menjalankan langkahnya di banyak server sekaligus, lalu melaporkan apa saja yang berubah.',
		'[fyi] Asyiknya, playbook aman dijalankan berulang kali. Kalau servernya sudah sesuai, Ansible nggak akan mengutak atiknya. Dan ini bukan cuma untuk server cloud, tim jaringan juga pakai alat yang sama untuk mengatur ratusan router dan switch sekaligus.',
		'Sepuluh server menunggu update. Coba beberapa pakai tangan dulu, lalu ketik perintah playbook di terminal.'
	],
	reactions: {
		manual:
			'Satu beres. Masuk, ketik, cek, keluar. Lima menit untuk satu server. Sekarang bayangkan ada seratus.',
		typo: 'Waduh, typo. Server itu sekarang konfigurasinya rusak dan nggak ada yang sadar. Persis begini caranya server pelan pelan jadi beda beda satu sama lain.',
		playbook:
			'Ansible menyisir kesepuluh server, lima sekaligus, dan sekarang semuanya jalan di versi baru. Bahkan yang kena typo ikut beres, karena playbook menjelaskan persis seperti apa seharusnya.',
		again:
			'Dijalankan lagi, hasilnya changed=0. Semua server sudah sesuai playbook, jadi Ansible nggak menyentuh apa apa. Kamu bisa menjalankannya tiap hari tanpa takut.'
	},
	missionLabel: 'Misi',
	mission: 'Update kesepuluh server ke nimbus app v2',
	manualBtn: 'SSH ke server berikutnya',
	manualDone: 'Semua server sudah didatangi',
	minutesTag: '{n} menit pakai tangan',
	typoTag: 'typo',
	oldTag: 'v1',
	newTag: 'v2',
	hintLabel: 'Ketuk untuk mengisi',
	placeholder: 'ketik perintah',
	unknown: 'perintah tidak dikenal, {cmd}',
	noteIdle: 'Sepuluh server, semuanya masih v1',
	noteManual: 'Diupdate pakai tangan. Tinggal {n} lagi.',
	noteTypo: 'Satu server kena typo dan sekarang rusak',
	notePlaybook: 'Satu perintah, kesepuluh server sudah v2',
	noteAgain: 'Sudah paling baru, nggak ada yang perlu diubah'
};
