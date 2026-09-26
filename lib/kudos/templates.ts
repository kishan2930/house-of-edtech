import { kudosTemplates, type KudosTemplate } from '@/lib/kudos/types';

export { kudosTemplates };

export const templateOptions: {
  key: KudosTemplate;
  label: string;
  emoji: string;
}[] = [
  { key: 'celebration', label: 'Celebration', emoji: '🎉' },
  { key: 'achievement', label: 'Achievement', emoji: '🏆' },
];
