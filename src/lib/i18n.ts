import { writable, derived } from 'svelte/store';

export type Lang = 'id' | 'en';

/** Global UI words only. Lesson/chapter text lives with each chapter in src/lib/chapters/. */
const ui = {
	id: {
		next: 'Lanjut',
		back: 'Kembali',
		finish: 'Selesai',
		start: 'Mulai',
		completeHint: 'Selesaikan dulu langkahnya',
		hideNim: 'Sembunyikan Nim',
		showNim: 'Tampilkan Nim',
		chapter: 'Bab',
		lessons: 'Pelajaran',
		locked: 'Selesaikan pelajaran sebelumnya dulu',
		termSoon: 'Segera hadir',
		termModule: 'Ini bagian dari modul {name}.',
		termSub: 'Belum perlu kamu pelajari sekarang, cukup tahu istilahnya ada.',
		termClose: 'Oke',
		termTrack: 'Jalur {name}',
		termReady: 'Ada pelajarannya',
		termLesson: 'Dibahas di pelajaran {title}.',
		termSoonLesson: 'Nanti dibahas di pelajaran {title}, bagian {name}.',
		termDone: 'Kamu sudah pernah belajar ini. Mau ulas lagi sebentar?',
		termLater:
			'Santai, di jalurmu kita bakal sampai ke sana juga. Tapi kalau penasaran, loncat aja sekarang.',
		termJumpNote: 'Loncat aja kalau penasaran, nanti aku antar balik ke sini.',
		termJump: 'Loncat ke sana',
		termReview: 'Ulas lagi',
		termStay: 'Nanti aja, lanjut dulu',
		backTo: 'Balik ke {title}',
		tracks: 'Jalur belajar',
		changeTrack: 'Ganti jalur',
		recommended: 'Saran Nim',
		trackReady: '{n} pelajaran siap',
		trackSoonCount: '{n} lagi segera hadir',
		trackSoon: 'Segera hadir',
		trackCurrent: 'Jalurmu',
		trackContinue: 'Lanjutkan',
		trackStart: 'Mulai jalur ini',
		basecampNote: 'Bekal dasar dulu, biar nggak bingung',
		trackDoneTitle: 'Jalur {name} selesai',
		trackDoneSub:
			'Keren, kamu sudah menamatkan semua pelajaran yang siap di jalur ini. Pelajaran lain yang segera hadir akan muncul di sini. Sambil nunggu, mau coba jalur lain?',
		welcomeMobile:
			'Oh iya, satu hal kecil. Kamu lagi pakai HP ya? Ini bakal jauh lebih enak di layar gede, laptop atau komputer, bahkan TV juga boleh sekalian ngajak sekeluarga nonton kamu belajar teknologi haha. Tapi tenang, di HP tetap jalan kok.',
		welcome: [
			'Hi, kenalin aku <b>Nim</b>. Aku yang bakal nemenin kamu belajar <b>teknologi di balik internet</b> dari nol banget, jadi santai aja ya.',
			'Di sini kamu nggak cuma baca teori. Tiap konsep langsung kamu coba sendiri, dan aku akan jelaskan pelan-pelan sambil kita jalan.',
			'Kamu bisa belajar <b>jaringan</b>, <b>web</b>, <b>cloud</b>, <b>keamanan</b>, atau <b>AI</b>. Sudah punya tujuan? Langsung pilih jalurnya. Belum tahu mau mulai dari mana? Ikut jalur <b>Dari Nol</b>, aku antar dari dasar banget.'
		]
	},
	en: {
		next: 'Next',
		back: 'Back',
		finish: 'Finish',
		start: 'Start',
		completeHint: 'Finish the step first',
		hideNim: 'Hide Nim',
		showNim: 'Show Nim',
		chapter: 'Chapter',
		lessons: 'Lessons',
		locked: 'Finish the earlier lessons first',
		termSoon: 'Coming soon',
		termModule: 'This is part of the {name} module.',
		termSub: 'No need to learn it now, just good to know it exists.',
		termClose: 'Got it',
		termTrack: '{name} track',
		termReady: 'There is a lesson',
		termLesson: 'Covered in the lesson {title}.',
		termSoonLesson: 'It will be covered in {title}, part of {name}.',
		termDone: 'You already learned this one. Fancy a quick review?',
		termLater: 'No rush, your track gets there too. But if you are curious, jump in now.',
		termJumpNote: 'Jump in if you are curious, and I will bring you right back here.',
		termJump: 'Take me there',
		termReview: 'Review it',
		termStay: 'Later, keep going',
		backTo: 'Back to {title}',
		tracks: 'Learning tracks',
		changeTrack: 'Change track',
		recommended: "Nim's pick",
		trackReady: '{n} lessons ready',
		trackSoonCount: '{n} more coming soon',
		trackSoon: 'Coming soon',
		trackCurrent: 'Your track',
		trackContinue: 'Continue',
		trackStart: 'Start this track',
		basecampNote: 'The basics first, so nothing feels confusing',
		trackDoneTitle: '{name} track complete',
		trackDoneSub:
			'Nice, you finished every lesson that is ready in this track. New ones will show up here as they land. While you wait, want to try another track?',
		welcomeMobile:
			'Oh, one small thing. You are on a phone, right? This feels so much better on a big screen, a laptop or a computer, even a TV if you fancy, so the whole family can watch you learn tech haha. No worries though, it runs fine on a phone too.',
		welcome: [
			"Hi, I'm <b>Nim</b>. I'll keep you company while you learn <b>the tech behind the internet</b> from the very start, so take it easy.",
			"Here you don't just read theory. You try each concept yourself, and I'll explain everything slowly as we go.",
			'You can learn <b>networking</b>, the <b>web</b>, <b>cloud</b>, <b>security</b>, or <b>AI</b>. Already have a goal? Pick its track. Not sure where to start? Take the <b>From Zero</b> track and I will walk you through from the very basics.'
		]
	}
};

export const lang = writable<Lang>('id');
export const t = derived(lang, ($l) => ui[$l]);
export function setLang(l: Lang) {
	lang.set(l);
}
