import type { LessonText } from '../../types';

/** One part of the picture, shown in the side panel while its beats play. */
export type BinaryStep = { title: string; body: string };

export interface BinaryText extends LessonText {
	/** Panel text, one per scene (switch, byte, letter, word, photo, hex, sizes, play). */
	steps: BinaryStep[];
	on: string; // the switch is on
	off: string; // the switch is off
	bitLabel: string; // over the eight switches, e.g. "8 bits"
	byteLabel: string; // under the eight switches, e.g. "1 byte"
	byteTrick: string; // the short memory line shown with the byte
	keyLabel: string; // under the keyboard key, e.g. "you press"
	numberLabel: string; // template with {n}, the number a byte holds
	letterLabel: string; // template with {c}, the letter that number stands for
	wordNote: string; // template with {b} bytes and {n} switches
	dotNote: string; // over the three colour bytes of one dot
	colors: [string, string, string]; // red, green, blue
	oneByte: string; // next to each colour bar
	hexDigits: string; // over the sixteen hex digits, e.g. "16 digits"
	nibble: string; // under each group of four switches, e.g. "4 bits"
	hexByte: string; // under the two hex digits, e.g. "1 byte, 2 hex digits"
	hexUses: { label: string; value: string }[]; // color, MAC address, IPv6, each written in hex
	boxes: { unit: string; what: string }[]; // byte, KB, MB, GB
	boxNote: string; // each box holds about a thousand of the one before
	sizeTrick: string; // the short memory line shown with the boxes
	playHint: string; // over the tappable switches
	notLetter: string; // the number is not a small letter
	flipLabel: string; // template with {i}, screen reader label for a switch
}
