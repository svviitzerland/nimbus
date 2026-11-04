import type { CablingText } from './types';

export const id: CablingText = {
	title: 'Kabel jaringan',
	intro: [
		'Data berpindah antar perangkat sebagai angka satu dan nol. Di dalam kabel, angka angka itu berubah jadi denyut cepat, entah denyut <b>listrik</b> atau denyut <b>cahaya</b>, tergantung bahan kabelnya.',
		'Kabel yang kamu colokkan ke laptop atau router namanya <b>kabel LAN</b>. Isinya delapan kawat tembaga tipis yang dipilin berpasangan. Tembaga membawa listrik, dan dia murah, kuat, serta gampang dicolok.',
		'Tapi listrik punya kelemahan. Makin jauh jalannya, makin lemah dia, dan dia ketularan gangguan dari kabel lain di sekitarnya. Makanya kabel LAN mentok di sekitar 100 meter.',
		'Kabel <b>fiber optik</b> itu helai kaca setipis rambut. Yang dibawanya cahaya, berkedip nyala dan mati. Cahaya hampir nggak melemah dan kebal gangguan listrik, jadi satu helai fiber bisa membentang puluhan kilometer.',
		'[ingat] Tembaga buat dalam ruangan, fiber buat antar gedung. Kabel LAN cuma sepanjang kira kira satu lapangan bola, dan yang lebih jauh dari itu, seperti kabel yang masuk ke rumahmu, pasti fiber.',
		'[fyi] Pilinan di kabel LAN bukan buat gaya. Dengan dipilin, gangguan dari luar mengenai kedua kawat sama rata, jadi saling meniadakan. Tulisan Cat5e, Cat6, dan Cat6a di kabel menunjukkan seberapa rapat pilinannya dan seberapa cepat kabelnya.',
		'Mau coba menariknya? Geser jaraknya dan lihat di mana tembaga menyerah sementara fiber terus jalan.'
	],
	reactions: {
		copperOk:
			'Pendek lagi, tembaga senang. Untuk jarak dekat, kabel LAN itu murah, gampang, dan cukup cepat, makanya hampir di belakang setiap meja ada satu.',
		copperFail:
			'Tembaganya menyerah. Listriknya memudar dan tenggelam dalam gangguan, jadi ujung sana nggak bisa membedakan satu dan nol lagi. Lewat dari sekitar 100 meter, kamu butuh switch di tengah buat menguatkan sinyal, atau pakai fiber.',
		fibreFar:
			'Berkilo kilometer jauhnya dan fiber masih jernih. Cahaya di dalam kaca hampir nggak melemah, makanya [[kabel bawah laut|cloud/cable]] yang menyambungkan benua juga fiber.'
	},
	steps: [
		{
			title: 'Denyut di dalam kabel',
			body: 'Kabel membawa data sebagai denyut cepat. Nyala, mati, nyala, mati, miliaran kali setiap detik.'
		},
		{
			title: 'Kabel LAN',
			body: 'Delapan kawat <b>tembaga</b> tipis yang dipilin berpasangan, dengan colokan plastik bening di tiap ujung. Yang dibawanya listrik.'
		},
		{
			title: 'Batas 100 meter',
			body: 'Listrik memudar dan ketularan gangguan selama perjalanan. Lewat sekitar <b>100 meter</b>, ujung sana nggak bisa membacanya lagi.'
		},
		{
			title: 'Fiber optik',
			body: 'Helai <b>kaca</b> setipis rambut yang membawa kedipan cahaya. Hampir nggak memudar, jadi bisa sampai berkilo kilometer.'
		},
		{
			tag: 'Cara ingat',
			title: 'Tembaga di ruangan, fiber di jalanan',
			body: 'Kabel LAN cuma sepanjang satu lapangan bola (100 meter). Yang lebih jauh, seperti kabel ke rumahmu, itu fiber.'
		},
		{
			tag: 'FYI',
			title: 'Kenapa dipilin',
			body: 'Dengan dipilin, gangguan dari luar mengenai kedua kawat sama rata, jadi saling meniadakan. Makin rapat pilinannya, makin cepat kabelnya.'
		},
		{
			tag: 'Coba',
			title: 'Tarik kabelnya',
			body: 'Geser jarak di atas. Tembaga memudar lalu putus, fiber tetap terang.'
		}
	],
	copper: 'Kabel LAN tembaga',
	fibre: 'Fiber optik',
	pairLabel: 'kawat dipilin',
	glassLabel: 'cahaya di kaca',
	youLabel: 'Laptopmu',
	farLabel: 'Server',
	distLabel: 'Jarak',
	okTag: 'sampai',
	brokenTag: 'nggak terbaca',
	limitTag: '100 m'
};
