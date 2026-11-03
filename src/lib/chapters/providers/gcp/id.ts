import type { GcpText } from './types';

export const id: GcpText = {
	title: 'Google Cloud',
	intro: [
		'Google sudah menjalankan Search, Gmail, dan YouTube untuk miliaran orang jauh sebelum menyewakan satu server pun. <b>Google Cloud</b> membuka mesin yang sama itu buat kamu pakai.',
		'Awalnya tahun 2008 lewat App Engine, tempat menjalankan kode tanpa menyentuh server sama sekali. Compute Engine, server sewaan biasanya, menyusul tahun 2012.',
		'Google suka nama yang lugas. Cloud Storage ya buat menyimpan, Cloud SQL ya SQL. Jadi tantangannya bukan menebak arti nama, tapi menentukan tiap layanan itu masuk ke ide yang mana.',
		'[fyi] Kata yang sama, jangkauan beda. Di Google Cloud satu VPC bisa membentang ke semua region di dunia, sedangkan di [[AWS|providers/aws]] dan [[Azure|providers/azure]] tiap jaringan privat tinggal di satu region saja.',
		'Yuk bangun nimbus.com di Google Cloud, mulai dari pintu depan. Pilih satu kartu layanan, lalu taruh di ide yang diwakilinya.'
	],
	reactions: {
		dns: 'Cloud DNS itu [[DNS|networking/dns]] milik Google Cloud. Dia menjawab dari jaringan sedunia yang sama yang bikin Google Search ngebut.',
		cdn: 'Cloud CDN itu [[CDN|traffic/cdn]], salinan filemu disimpan di titik titik Google di seluruh dunia, dekat dengan tiap pengunjung.',
		lb: 'Cloud Load Balancing itu [[load balancer|traffic/load-balancer]]. Satu alamat IP saja bisa menangkap pengunjung dari semua benua, lalu mengirim masing masing ke server sehat yang paling dekat.',
		network:
			'VPC itu [[jaringan privat|networking/vpc]] milikmu. Di Google Cloud satu VPC bisa meliputi seluruh planet, dengan satu subnet di tiap region yang kamu pakai.',
		firewall:
			'Firewall rules itu [[firewall|networking/firewall]] untuk VPC Google. Izinkan port 443 dari internet, dan semua yang nggak kamu izinkan diblokir.',
		vm: 'Compute Engine itu [[virtual machine|foundations/virtual-machine]]. Pilih CPU dan memori yang kamu mau, dan Google bahkan bisa memindahkannya ke mesin sehat tanpa mematikannya.',
		container:
			'Cloud Run menjalankan [[container|compute/container]] milikmu dan mengecilkannya sampai nol waktu nggak ada pengunjung. Kalau sudah kebesaran, ada GKE, dan Google itu tempat Kubernetes lahir.',
		function:
			'Cloud Functions itu [[serverless|compute/serverless]], satu fungsi kecil yang bangun tiap ada request. Sekarang Google memasukkannya ke keluarga Cloud Run, namanya Cloud Run functions.',
		files:
			'Cloud Storage itu [[object storage|resilience/storage-types]], bucket buat foto, video, dan backup, laci raksasa tanpa dasar.',
		sql: 'Cloud SQL itu [[database SQL|resilience/database]] yang dikelola Google, MySQL atau PostgreSQL yang ditambal dan dibackup Google buat kamu.',
		nosql:
			'Firestore itu [[database|resilience/database]] NoSQL berisi dokumen. Dia bisa mendorong perubahan langsung ke HP begitu terjadi, makanya aplikasi chat suka banget.',
		iam: 'IAM di Google Cloud itu [[Identity and Access|networking/iam]]. Kamu bagi peran seperti viewer atau editor ke orang dan layanan, nggak pernah lebih dari yang mereka butuhkan.',
		keys: 'Cloud KMS menyimpan kunci [[enkripsi|networking/encryption]]. Google sudah mengenkripsi datamu di disk, dan KMS membiarkan kamu pegang dan ganti sendiri kunci kuncinya.',
		monitor:
			'Cloud Monitoring itu bagian [[monitoring|compute/monitoring]]. Dashboard, cek uptime, dan alert yang mencolekmu sebelum pengunjung sadar ada apa apa.',
		miss: 'Bukan di situ. Baca lagi namanya, lalu pikirkan kerjanya apa.',
		live: 'Pengunjungmu lewat Cloud DNS, Cloud CDN, dan load balancer, melewati firewall rules masuk ke Compute Engine, baca Cloud SQL dan Cloud Storage, dan Cloud Monitoring melihat semua langkahnya. nimbus.com sudah hidup di Google Cloud.'
	},
	boardTitle: 'nimbus.com di Google Cloud',
	youLabel: 'Pengunjung',
	layers: ['Pintu depan', 'Jaringan privat', 'Komputasi', 'Data', 'Akses dan pantau'],
	concepts: {
		dns: 'DNS',
		cdn: 'CDN',
		lb: 'Load balancer',
		network: 'Jaringan privat',
		firewall: 'Firewall',
		vm: 'Virtual machine',
		container: 'Container',
		function: 'Serverless',
		files: 'Penyimpanan file',
		sql: 'Database SQL',
		nosql: 'Database NoSQL',
		iam: 'Identitas dan akses',
		keys: 'Kunci enkripsi',
		monitor: 'Monitoring'
	},
	trayLabel: 'Layanan Google Cloud',
	pickHint: 'Pilih satu kartu layanan, lalu ketuk ide yang diwakilinya',
	placeHint: '{s} masuk ke mana?',
	missTag: 'bukan di sini',
	layerTag: '{n} dari {t} lapis',
	liveBtn: 'Kirim pengunjung ke nimbus.com',
	noteDone: 'Semua bagian sudah di tempatnya, saatnya pengunjung sungguhan',
	noteLive: 'Ide yang sama yang kamu kenal, pakai nama Google'
};
