import type { GpuText } from './types';

export const id: GpuText = {
	title: 'GPU untuk AI',
	intro: [
		'Masih ingat jaringan payung tadi? Yang sekecil itu saja butuh puluhan perkalian tiap kali menebak. Chatbot butuh miliaran untuk tiap kata, dan pelatihannya mengulang itu terus menerus selama berminggu minggu. Pasti ada yang harus mengerjakan semua hitungan itu.',
		'[[CPU|basics/hardware]] memiliki core yang menjalankan instruksi program. CPU cocok untuk banyak jenis pekerjaan, termasuk langkah yang saling bergantung dan pengaturan alur program.',
		'<b>GPU</b> (graphics processing unit) awalnya dibuat untuk game. Layarmu punya jutaan piksel dan masing masing butuh hitungan kecil sendiri berkali kali tiap detik, jadi GPU diisi <b>ribuan core sederhana</b> yang bekerja bersamaan.',
		'Lalu para peneliti sadar satu hal. Neural network juga cuma tumpukan raksasa perkalian kecil yang nggak perlu saling menunggu. Itu persis pekerjaan kesukaan GPU, dan sekitar tahun 2012 temuan ini bikin AI tiba tiba melesat.',
		'[fyi] Makanya NVIDIA, perusahaan yang dulu terkenal dengan kartu grafis untuk game, jadi salah satu perusahaan paling bernilai di dunia. Lab AI besar membeli puluhan ribu GPU, dan kebanyakan tim cukup menyewanya per jam di [[cloud|ai/ai-cloud]].',
		'[ingat] GPU dapat menjalankan banyak perhitungan serupa secara paralel. Keuntungannya bergantung pada jenis pekerjaan dan cara program memakainya.',
		'Ini CPU dan GPU-ku di garis start. Pilih tugasnya lalu mulai balapan. Coba kedua tugas, pemenangnya mungkin bikin kamu kaget.'
	],
	reactions: {
		racing:
			'Mereka berangkat! Lihat core-nya menyala. CPU punya sedikit pekerja gesit, GPU punya kerumunan pekerja yang lebih lambat.',
		gpu: 'GPU menang telak! Tiap core-nya memang lebih lambat, tapi 256 core yang kerja berdampingan menghabiskan tumpukannya dalam beberapa ronde besar. Melatih model sungguhan itu tugas ini, dikali semiliar.',
		cpu: 'Kali ini CPU yang menang! Tiap langkah butuh jawaban dari langkah sebelumnya, jadi cuma satu core yang bisa bekerja. Kerumunan GPU cuma berdiri menunggu, dan satu core-nya yang lambat ketinggalan.',
		done: 'Sekarang kamu sudah lihat dua sisinya. GPU bukan CPU yang lebih hebat, dia jenis pekerja yang berbeda. Tiap komputer AI tetap punya CPU untuk kerja rumit selangkah demi selangkah, dan menyerahkan tumpukan hitungan kecil ke GPU.'
	},
	jobLabel: 'Pilih tugas',
	jobs: [
		{
			name: 'Melatih neural net',
			sub: '1.024 hitungan kecil, nggak ada yang saling menunggu',
			unit: 'hitungan'
		},
		{
			name: 'Mengikuti resep',
			sub: '64 langkah, tiap langkah butuh langkah sebelumnya',
			unit: 'langkah'
		}
	],
	raceBtn: 'Mulai balapan',
	racing: 'Lagi balapan',
	again: 'Balapan lagi',
	cpuName: 'CPU',
	cpuSub: '8 core besar dan gesit',
	gpuName: 'GPU',
	gpuSub: '256 core kecil dan lebih lambat',
	ready: 'Menunggu di garis start',
	progress: '{n} dari {t} {u}',
	finished: 'Selesai dalam {s} detik',
	faster: '{k} kali lebih cepat',
	triedBoth: '{n} dari 2 tugas sudah dibalap'
};
