import type { DeploySiteText } from './types';

export const id: DeploySiteText = {
	title: 'Deploy situs',
	intro: [
		'Sejauh ini nimbus.com tinggal di laptopmu. Ingat [[laptop sebagai server|foundations/laptop-server]]? Begitu laptopnya ditutup atau WiFi-nya putus, situsnya hilang buat semua orang.',
		'<b>Deploy</b> artinya memindahkan situsmu ke komputer yang nggak pernah tidur, yaitu server, supaya siapa pun bisa membukanya kapan saja. Tiap perubahan berikutnya juga di-deploy lagi, kadang berkali kali dalam sehari.',
		'Cara lama itu menyalin file ke server satu per satu pakai tangan. Lupa satu file, setengah situs rusak. Sekarang kamu cukup <b>push</b> kodemu ke repository (folder bersama dari [[version control|compute/version-control]]), dan host yang mengurus sisanya.',
		'Pertama host menjalankan <b>build</b>, mengubah kode sumbermu jadi file akhir yang dibaca browser, kecil dan rapi. Lalu file itu disajikan di alamatmu. Push, build, live.',
		'Ada dua jenis host. <b>Platform</b> seperti Vercel, Netlify, atau Cloudflare Pages mengerjakan semua langkah buat kamu. <b>VPS</b> (virtual private server) itu komputer sewaan di data center yang semua langkahnya kamu kerjakan sendiri. Lebih bebas, lebih banyak kerjaan.',
		'[fyi] Rangkaian push, build, lalu live itu sebenarnya [[CI/CD|compute/cicd]] versi mini. Tim besar tinggal menambahkan tes dan pengecekan di tengahnya.',
		'[ingat] Pada platform yang sudah dikonfigurasi, push dapat memicu build dan deploy. Pada VPS, siapkan proses deploy sendiri atau jalankan langkahnya secara manual.',
		'Giliran kamu. Ganti judul nimbus.com, pilih host, push, dan lihat judul barunya muncul di HP.'
	],
	reactions: {
		platform:
			'Live! Kamu cuma push. Platformnya melihat commit baru, membangun situsnya, lalu menaruhnya online di nimbus.com. Makanya kebanyakan situs kecil mulai dari sini.',
		vpsWait:
			'Sudah di-push, terus nggak terjadi apa apa. VPS nggak mengawasi repository kamu. Masuk ke servernya dan kerjakan tiap langkah sendiri, dari atas ke bawah.',
		vps: 'Live, dengan cara manual. Kamu login, menarik kode, membangunnya, dan merestart web server. Hasilnya sama, kerjaannya lebih banyak, tapi tiap bagian mesin itu kamu yang pegang.',
		both: 'Sekarang kamu sudah coba dua duanya. Platform itu cepat dan santai, VPS memberimu satu mesin utuh buat diatur. Banyak tim mulai di platform lalu pindah ke server sendiri waktu makin besar.'
	},
	headlineLabel: 'Judul barumu',
	startHeadline: 'Segera hadir',
	newHeadline: 'Halo dari nimbus.com',
	hostLabel: 'Host',
	hosts: {
		platform: { name: 'Platform', sub: 'Vercel, Netlify' },
		vps: { name: 'VPS sendiri', sub: 'server sewaan' }
	},
	pushBtn: 'Push perubahannya',
	vpsSteps: ['Login ke server', 'Tarik kode baru', 'Build situsnya', 'Restart web server'],
	vpsHint: 'Giliranmu, jalankan tiap langkah berurutan',
	laptopLabel: 'Laptopmu',
	serverLabel: 'Host',
	phoneLabel: 'Siapa saja, di mana saja',
	idleNote: 'nimbus.com masih menampilkan judul lama',
	buildingNote: 'Host sedang membangun situsmu',
	vpsNote: 'Kodenya sudah sampai di GitHub, tapi servernya belum bergerak',
	liveNote: 'Live di nimbus.com, buat semua orang',
	updated: 'baru diperbarui'
};
