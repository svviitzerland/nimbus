import type { RemoteAccessText } from '../../types';

export const id: RemoteAccessText = {
	title: 'Masuk ke server cloud',
	intro: [
		'Server virtual kamu sudah nyala, tapi tinggalnya di data center yang jauh, bisa beda kota atau beda negara. Beda banget sama server <b>on premise</b> di kantor sendiri yang bisa kamu hampiri, colok layar dan keyboard, atau akses lewat jaringan lokal.',
		'Karena mesinnya nggak bisa kamu pegang, caranya masuk dari jauh, namanya <b>remote access</b>. Dari komputer di rumah, kamu nyambung lewat internet pakai alamat servernya, bisa berupa <b>IP</b> atau <b>hostname</b> (nama alamatnya) seperti nimbus.com.',
		'Ada dua pintu yang umum. <b>SSH</b> buat server Linux, isinya terminal buat ngetik perintah. <b>RDP</b> buat server Windows, isinya layar desktop yang bisa kamu klik klik.',
		'Ngetik password tiap kali memang bisa, tapi password bisa ditebak atau dicuri. Cara yang lebih aman itu <b>SSH key</b>, sepasang file yang saling cocok dan dibuat di laptopmu. <b>Public key</b> ditaruh di server, dan <b>private key</b> nggak pernah keluar dari laptopmu. Waktu nyambung, server ngecek apakah laptopmu punya kunci pasangannya, jadi nggak ada password yang lewat internet.',
		'[ingat] Bayangin gembok dan satu satunya kunci. Public key itu gemboknya, kamu boleh pasang salinannya di semua server dan siapa pun boleh lihat. Private key itu satu satunya kunci yang bisa buka semuanya, jadi simpan di saku dan jangan pernah dipinjamkan.',
		'Server kamu sudah siap di data center. Coba masuk lewat SSH, lalu lewat RDP, dan lihat bedanya.'
	],
	reactions: {
		ssh: 'Lewat <b>SSH</b> kamu dapat terminal servernya. Ketik perintah, server langsung jalanin, dan semua lalu lintasnya terenkripsi jadi aman walau lewat internet umum.',
		rdp: 'Lewat <b>RDP</b> layar desktop servernya muncul di laptopmu. Kamu gerakin mouse dan klik seperti komputer biasa, padahal mesinnya nun jauh di data center.',
		both: 'Nah, dua duanya jalan masuk ke mesin yang kamu sewa. SSH buat yang suka terminal dan otomasi, RDP buat yang butuh tampilan desktop. Mesinnya jauh, tapi berasa di depan mata.'
	},
	serverLabel: 'Server kamu',
	dcLabel: 'di data center',
	homeLabel: 'Komputer di rumah',
	lockedNote: 'Belum tersambung',
	idleNote: 'Server kamu siap di data center. Coba masuk lewat SSH, lalu RDP.',
	pickSsh: 'SSH (Linux)',
	pickRdp: 'RDP (Windows)',
	sshHost: 'nimbus.com',
	sshPrompt: 'nim@nimbus:~$',
	sshCmd: 'ssh nim@nimbus.com',
	sshConnecting: 'menyambung dengan aman...',
	sshOk: 'masuk pakai SSH key, terenkripsi',
	sshSession: [
		{ cmd: 'whoami', out: ['nim'] },
		{ cmd: 'sudo apt install nginx', out: ['Membaca daftar paket...', 'nginx berhasil dipasang'] },
		{ cmd: 'sudo systemctl restart nginx', out: ['nginx aktif kembali'] }
	],
	rdpTitle: 'Berkas server',
	rdpHost: 'nimbus.com',
	connecting: 'Menyambung...',
	rdpHint: 'Desktop Windows server muncul di layarmu',
	keysTitle: 'Sepasang SSH key',
	privateKey: 'Private key',
	privateFile: 'id_ed25519',
	privateNote: 'tetap di laptopmu',
	publicKey: 'Public key',
	publicFile: 'id_ed25519.pub',
	publicNote: 'ditaruh di server'
};
