import type { DeploySiteText } from './types';

export const id: DeploySiteText = {
	title: 'Deploy situs',
	intro: [
		'Sekarang nimbus.com masih tinggal di laptopmu, kayak di [[laptop sebagai server|foundations/laptop-server]]. Lihat apa yang terjadi waktu laptopnya ditutup. Situsnya hilang buat semua orang, karena satu satunya komputer yang menyajikannya lagi tidur.',
		'<b>Deploy</b> artinya menaruh situsmu di komputer yang nggak pernah tidur, yaitu <b>server</b> di data center, supaya siapa pun bisa membukanya kapan saja, bahkan waktu kamu lagi pulas.',
		'Langkah pertamanya sudah kamu kenal dari pelajaran Git. Kamu <b>push</b> commit kamu ke repository di GitHub (salinan online dari [[Git bukan GitHub|compute/git-vs-github]]). Lihat paket kecilnya berangkat dari laptop.',
		'<b>Host</b> itu perusahaan yang servernya menjaga situsmu tetap online. Dia mengawasi repository kamu, melihat ada commit baru, lalu menjalankan <b>build</b>. Build mengubah kode yang kamu tulis jadi file akhir yang rapi dan siap dibaca browser.',
		'Lalu host menyajikan file itu di nimbus.com. Buka dari HP mana pun, di mana pun, dan judul barunya sudah ada. Kamu sama sekali nggak menyentuh servernya.',
		'[ingat] Dorong, rakit, tayang. Push, build, live. Kamu cuma kerjakan kata pertama, host yang mengurus dua sisanya. Tiga kata, dan perubahan di laptopmu sampai ke semua HP.',
		'Host ada dua jenis. <b>Platform</b> seperti Vercel, Netlify, atau Cloudflare Pages mengerjakan semua langkah sendiri. <b>VPS</b> (virtual private server) itu komputer sewaan, kamu login lalu mengetik tiap langkahnya sendiri. Lebih bebas, lebih banyak kerjaan.',
		'[fyi] Push, build, live itu sebenarnya [[CI/CD|compute/cicd]] versi mini. Tim yang lebih besar menambahkan tes otomatis di tengahnya, jadi perubahan yang rusak dihentikan sebelum sempat sampai ke HP.',
		'Mau lihat sekali lagi? Push judul baru dan ikuti perjalanannya sampai ke HP. Ini opsional kok.'
	],
	reactions: {
		push: 'Berangkat! Satu push dari laptop, dan sebentar kemudian judul barunya sudah ada di HP. Nggak ada yang menyalin file satu per satu pakai tangan.'
	},
	panels: [
		{
			tag: 'Di laptopmu',
			title: 'Laptop ditutup, situs hilang',
			body: 'Situs yang disajikan dari laptopmu sendiri cuma hidup selama laptop itu menyala dan online.'
		},
		{
			tag: 'Server',
			title: 'Komputer yang nggak pernah tidur',
			body: '<b>Server</b> ada di data center dengan listrik dan internet yang stabil, menyala siang dan malam.'
		},
		{
			tag: 'Langkah 1',
			title: 'Push',
			body: '<b>git push</b> mengirim commit barumu dari laptop ke repository di GitHub. Bagianmu selesai di sini.'
		},
		{
			tag: 'Langkah 2',
			title: 'Build',
			body: 'Host melihat commit baru lalu menjalankan <b>build</b>, merakit kode sumbermu jadi file kecil yang siap dibaca browser.'
		},
		{
			tag: 'Langkah 3',
			title: 'Live',
			body: 'Host menyajikan file barunya di <b>nimbus.com</b>. Tiap pengunjung dapat versi baru waktu mereka membukanya lagi.'
		},
		{
			tag: 'Cara ingat',
			title: 'Dorong, rakit, tayang',
			body: 'Kamu push, host build, dunia melihatnya. Tiga langkah yang sama, setiap kali.'
		},
		{
			tag: 'Host',
			title: 'Platform atau VPS',
			body: '<b>Platform</b> menjalankan langkahnya buat kamu. Di <b>VPS</b> kamu login dan mengetiknya sendiri, seperti perintah di layar kecil itu.'
		},
		{
			tag: 'Pipeline',
			title: 'Tes di tengah jalan',
			body: '<b>Pipeline</b> itu rangkaian langkah otomatis. Kalau ada tesnya, perubahan yang rusak nggak akan lolos dari pos pemeriksaan.'
		},
		{
			tag: 'Coba',
			title: 'Push punyamu sendiri',
			body: 'Tiap push menjalankan seluruh rangkaian lagi. Tim sungguhan melakukannya berkali kali sehari.'
		}
	],
	picture:
		'Laptop mengirim kode ke GitHub, server host merakitnya, dan HP menampilkan situs yang sudah live.',
	labels: { laptop: 'Laptopmu', repo: 'GitHub', host: 'Host', phone: 'HP siapa saja' },
	arrows: { push: 'push', build: 'build', live: 'live', tests: 'tes' },
	headlines: ['Segera hadir', 'Halo, dunia', 'Kini di HP', 'Belajar dari nol'],
	unreachable: 'Situs tidak ada',
	alwaysOn: 'nyala 24/7',
	updated: 'baru diperbarui',
	hosts: { platform: 'Platform, otomatis', vps: 'VPS, manual' },
	vpsCommands: ['$ ssh nimbus.com', '$ git pull', '$ npm run build', '$ nginx -s reload'],
	rule: 'Dorong, rakit, tayang',
	pushBtn: 'Push judul baru',
	pushing: 'Lagi jalan'
};
