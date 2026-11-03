import type { CapstoneText } from '../types';

export const id: CapstoneText = {
	title: 'Pilih provider',
	intro: [
		'Sampai juga di ujung jalur Cloud. Dari satu server di laptop sampai arsitektur yang tahan banting, kamu sudah pegang semua konsep besarnya.',
		'Cabang berikutnya turun ke dunia nyata per penyedia. Konsep yang sama persis, tapi dengan nama dan tombol aslinya, EC2, Cloud Run, dan kawan kawannya.',
		'Pilih penyedia yang paling ingin kamu pelajari duluan. Ketiganya masih tahap pembangunan, dan kamu bisa titip email biar dikabari begitu jalurnya siap.'
	],
	reactions: {
		picked:
			'Dicatat! Cabang itu sedang disiapkan baik baik. Sambil menunggu, konsep cloud yang sudah kamu pelajari itu fondasi yang sama untuk penyedia mana pun, jadi kamu sudah selangkah di depan.',
		subscribed:
			'Emailmu tersimpan. Begitu jalur pilihanmu terbit, kabar pertamanya buat kamu. Sampai jumpa di cabang provider!'
	},
	providers: [
		{ key: 'aws', name: 'AWS', sub: 'Amazon Web Services' },
		{ key: 'gcp', name: 'Google Cloud', sub: 'GCP' },
		{ key: 'azure', name: 'Azure', sub: 'Microsoft Azure' }
	],
	comingSoon: 'Segera hadir',
	pickedTag: 'pilihanmu',
	newsTitle: 'Dikabari pas rilis?',
	newsSub: 'Cabangnya masih dibangun. Tinggalkan email, kami kirim kabar begitu siap.',
	emailPh: 'email kamu',
	subscribe: 'Kabari aku',
	subscribedMsg: 'Tercatat! Sampai jumpa lagi nanti',
	invalidMsg: 'Hmm, cek lagi emailnya',
	errMsg: 'Lagi gangguan, coba lagi sebentar lagi',
	noteIdle: 'Tiga penyedia besar, satu fondasi yang sama',
	notePicked: 'Cabang pilihanmu masih tahap pembangunan, ditunggu ya'
};
