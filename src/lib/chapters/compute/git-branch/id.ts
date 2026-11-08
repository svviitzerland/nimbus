import type { GitBranchText } from './types';

export const id: GitBranchText = {
	title: 'Branch, merge, dan konflik',
	intro: [
		'Situs nimbus.com disimpan di Git, dan riwayat utamanya punya nama, <b>main</b>. Apa pun yang ada di main itulah yang tayang di situs. Judul halaman depannya sekarang <i>Selamat datang di Nimbus</i>.',
		'Adi mau mencoba menambah tombol Daftar. Kalau dia langsung mengubah main, satu salah ketik bisa ikut tayang. Jadi dia bikin <b>branch</b>, jalur salinan yang bercabang dari main, tempat aman buat mencoba.',
		'Adi commit tombolnya di branch <b>adi</b>. Lihat situsnya, belum berubah sama sekali. Commit di sebuah branch cuma hidup di branch itu, main tetap utuh.',
		'Tombolnya sudah dicek dan aman. Adi lalu <b>merge</b>, artinya menyatukan isi branchnya kembali ke main. Sekarang tombol Daftar resmi ada di main dan ikut tayang.',
		'Besoknya Adi dan Citra kerja barengan, masing masing di branchnya sendiri. Kalau yang mereka ubah beda baris, Git menyatukan dua duanya sendiri. Tapi kali ini dua duanya mengubah baris yang sama, judul halaman depan.',
		'Adi merge duluan dan lancar, judulnya jadi <i>Belajar cloud dari nol</i>. Lalu Citra merge, dan Git berhenti. Inilah <b>merge conflict</b>, dua orang mengubah baris yang sama dengan isi yang berbeda.',
		'Git tidak mau menebak siapa yang benar. Dia menaruh dua versi itu di dalam file, diapit tanda khusus, lalu meminta manusia memilih. Bagian atas punya main, bagian bawah punya Citra.',
		'Citra ngobrol sebentar dengan Adi, lalu mereka sepakat memakai <i>Cloud itu gampang</i>. Citra menghapus tandanya, menyisakan satu judul, lalu commit. Konfliknya selesai dan main kembali rapi.',
		'[ingat] Bayangkan fotokopi resep nenek. <b>Branch</b> itu fotokopinya, kamu bebas mencoret coret tanpa merusak aslinya. <b>Merge</b> itu menyalin coretanmu ke resep asli. <b>Conflict</b> itu dua orang mencoret kata yang sama dengan tulisan beda, jadi harus ada yang memutuskan.',
		'[fyi] Konflik itu wajar, bukan tanda kamu salah. Biar jarang terjadi, bikin branch kecil dan merge sering sering. Perintahnya pendek, <b>git switch -c adi</b> membuat branch baru dan <b>git merge adi</b> menyatukannya.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Main',
			title: 'Jalur utama',
			body: '<b>main</b> adalah riwayat resmi proyek. Isinya itulah yang tayang di nimbus.com.'
		},
		{
			tag: 'Branch',
			title: 'Branch baru',
			body: 'Sebuah <b>branch</b> bercabang dari main. Perubahan di sana tidak menyentuh main sama sekali.'
		},
		{
			tag: 'Commit',
			title: 'Mencoba dengan aman',
			body: 'Commit di branch <b>adi</b> cuma ada di branch itu. Situs yang tayang masih versi main.'
		},
		{
			tag: 'Merge',
			title: 'Kembali ke main',
			body: '<b>Merge</b> menyatukan commit dari branch ke main. Baru sekarang perubahannya tayang.'
		},
		{
			tag: 'Kerja bareng',
			title: 'Dua branch sekaligus',
			body: 'Adi dan Citra punya branch sendiri. Baris yang beda digabung otomatis, baris yang sama bisa bentrok.'
		},
		{
			tag: 'Konflik',
			title: 'Git berhenti',
			body: 'Dua perubahan berbeda di <b>baris yang sama</b>. Git tidak tahu mana yang harus dipakai.'
		},
		{
			tag: 'Tanda konflik',
			title: 'Manusia yang memilih',
			body: 'Di atas <b>=======</b> ada versi main, di bawahnya versi Citra. Tandanya ditulis Git, bukan bagian dari situs.'
		},
		{
			tag: 'Selesai',
			title: 'Satu judul tersisa',
			body: 'Tanda dihapus, satu judul disimpan, lalu commit. Main kembali bersih dan situsnya ikut berubah.'
		},
		{
			tag: 'Cara ingat',
			title: 'Branch menyimpan perubahan terpisah',
			body: 'Branch itu fotokopi, merge itu menyalin coretan ke aslinya, conflict itu dua coretan di kata yang sama.'
		},
		{
			tag: 'Perintah',
			title: 'Branch kecil, merge sering',
			body: '<b>git switch -c</b> membuat branch, <b>git merge</b> menyatukannya. Konflik itu biasa, tinggal diselesaikan.'
		}
	],
	siteTitles: {
		start: 'Selamat datang di Nimbus',
		adi: 'Belajar cloud dari nol',
		citra: 'Cloud itu gampang'
	},
	signupBtn: 'Daftar',
	liveChip: 'tayang dari main',
	buttonCommit: 'tombol',
	titleCommit: 'judul',
	conflictTag: 'konflik',
	resolvedTag: 'beres'
};
