import ProtocolsStage from '$lib/components/stages/ProtocolsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const protocols: Lesson = {
	id: 'protocols',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: {
		https: 'happy',
		http: 'worried',
		smtp: 'happy',
		imap: 'happy',
		sftp: 'happy',
		ftp: 'worried',
		ssh: 'happy',
		wrong: 'thinking',
		done: 'excited'
	},
	stage: ProtocolsStage,
	text: { id, en }
};
