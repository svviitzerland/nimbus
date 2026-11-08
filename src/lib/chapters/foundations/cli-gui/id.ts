import type { CliGuiText } from '../../types';

export const id: CliGuiText = {
	title: 'CLI vs GUI',
	intro: [
		'Sekarang, gimana cara kita nyuruh komputer ngerjain sesuatu? Ada dua cara, lewat <b>GUI</b> atau lewat <b>CLI</b>. Biar kerasa bedanya, kita kerjain satu tugas yang sama pakai dua duanya, yaitu buka folder <b>Documents</b> lalu lihat isinya.',
		'Lewat <b>GUI</b> (Graphical User Interface) kamu tinggal lihat dan klik. Di layar ini ada ikon folder <b>Documents</b>, klik aja buat ngebukanya, nanti isinya langsung kelihatan.',
		'Lewat <b>CLI</b> (Command Line Interface) kamu ngetik perintah lalu Enter. Tugasnya sama, cuma diketik. Ketik <b>cd documents</b> buat masuk ke foldernya, lalu <b>ls</b> buat lihat isinya. Salah ketik nggak apa apa, terminalnya bakal kasih tahu.',
		'Sekarang giliran kamu, coba lewat GUI dan lewat CLI. Hasilnya sama persis kan? GUI itu klik klik yang enak dilihat, CLI itu ketik yang cepat dan gampang diulang. Makin mahir, biasanya makin sering pakai CLI.',
		'[ingat] GUI lewat klik, CLI lewat perintah. Tujuannya sama, cara menyampaikannya berbeda.'
	],
	reactions: {
		gui: 'Nah, itu cara GUI, tinggal klik. Sekarang coba lakukan hal yang sama lewat CLI ya.',
		cli: 'Perintah CLI menjalankan tugasnya. Sekarang coba tugas yang sama melalui tombol GUI.',
		both: 'Persis, hasilnya sama. Bedanya cuma caranya, GUI kamu klik, CLI kamu ketik. Nanti pas main cloud kita bakal sering pakai CLI karena cepat dan gampang diulang.'
	},
	taskLabel: 'Tugas, buka folder Documents lalu lihat isinya',
	guiTab: 'GUI',
	cliTab: 'CLI',
	homeCrumb: 'Home',
	folderName: 'Documents',
	files: ['laporan.pdf', 'foto.jpg', 'catatan.txt'],
	guiHint: 'Klik folder Documents buat ngebukanya',
	guiOpened: 'Documents kebuka, ini berkas di dalamnya',
	backLabel: 'Kembali',
	promptUser: 'nim@nimbus',
	cliHint: '# ketik perintah lalu tekan Enter'
};
