import type { CicdText } from '../types';

export const id: CicdText = {
	title: 'CI/CD',
	intro: [
		'Aplikasimu sudah jalan dan dipantau. Tapi tiap ada perubahan baru dari laptopmu, gimana caranya sampai ke live tanpa merusak apa apa. Cara manual itu serem. Kamu masuk ke server, salin file, restart, lalu berdoa. Satu typo jam dua pagi, situsnya mati.',
		'Cara yang kalem itu pakai <b>pipeline</b>. Kamu tinggal push perubahanmu. Langkah yang sama jalan otomatis tiap kali. Build, test, lalu deploy.',
		'Pipeline ini punya dua bagian. <b>CI</b> membangun perubahanmu jadi aplikasi lalu mengetesnya. Itu bagian build dan test. <b>CD</b> mengirim yang lolos ke production. Itu bagian deploy. Jadi CI memastikan perubahanmu tidak rusak, CD yang menaruhnya ke live.',
		'Kalau testnya gagal, pipeline langsung berhenti di situ. Perubahan rusak nggak akan pernah sampai ke pengguna. Coba kirim perubahan yang baik, lalu yang rusak. Lihat lognya di konsol bawah.',
		'[ingat] Perubahan diperiksa dulu, lalu dikirim melalui langkah yang bisa diulang.'
	],
	reactions: {
		pass: 'Lancar. Build lolos, test lolos, deploy jalan sendiri. Production pindah ke versi baru. Tanpa begadang, tanpa nyalin file.',
		caught:
			'Testnya gagal, dan pipeline berhenti di situ juga. Deploy nggak pernah jalan. Jadi penggunamu tetap pakai versi yang berfungsi. Itu memang gunanya.',
		both: 'Itulah CI dan CD. CI terus build dan test tiap perubahan. CD deploy yang lolos ke live. Kamu bisa gerak lebih cepat justru karena yang rusak nggak pernah lolos.'
	},
	goodBtn: 'Kirim perubahan baik',
	badBtn: 'Kirim perubahan rusak',
	commitLabel: 'Commit',
	buildLabel: 'Build',
	testLabel: 'Test',
	deployLabel: 'Deploy',
	liveLabel: 'Production',
	safeNote: 'aman',
	ciSub: 'build dan test',
	cdSub: 'deploy yang lolos',
	goodNote: 'Terkirim. Lolos semua test dan naik ke live sendiri.',
	badNote: 'Ditahan. Test menangkap yang rusak, jadi production tetap aman.',
	tryBothHint: 'Kirim yang baik dan yang rusak'
};
