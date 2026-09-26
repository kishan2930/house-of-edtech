import { fluentSticker } from '@/lib/kudos/stickers';
import { kudosTemplates, type KudosTemplate } from '@/lib/kudos/types';

export { kudosTemplates };

export function isKudosTemplate(value: string): value is KudosTemplate {
  return (kudosTemplates as readonly string[]).includes(value);
}

export const templateOptions: {
  key: KudosTemplate;
  label: string;
  sticker: string;
  surface: string;
  wash: string;
  quote: string;
  giver: string;
  receiver: string;
  pressed: string;
}[] = [
  {
    key: 'celebration',
    label: 'Celebration',
    sticker: fluentSticker('Party popper'),
    surface:
      'border-l-accent bg-gradient-to-br from-accent-light/40 to-card shadow-accent-glow dark:from-accent/20',
    wash: 'from-accent/55',
    quote: 'bg-accent/35',
    giver: 'bg-accent text-accent-foreground',
    receiver: 'bg-card text-foreground ring-2 ring-accent',
    pressed:
      'data-pressed:border-accent-dark data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:shadow-accent-glow',
  },
  {
    key: 'achievement',
    label: 'Achievement',
    sticker: fluentSticker('Trophy'),
    surface:
      'border-l-primary bg-gradient-to-br from-primary-bg to-card shadow-teal-glow dark:from-primary/25',
    wash: 'from-primary/35',
    quote: 'bg-primary/20',
    giver: 'bg-primary text-primary-foreground',
    receiver: 'bg-card text-foreground ring-2 ring-primary',
    pressed:
      'data-pressed:border-ink data-pressed:bg-ink data-pressed:text-input data-pressed:shadow-teal-glow',
  },
  {
    key: 'teamwork',
    label: 'Teamwork',
    sticker: fluentSticker('Handshake'),
    surface:
      'border-l-sky bg-gradient-to-br from-sky/20 to-card shadow-card dark:from-sky/25',
    wash: 'from-sky/45',
    quote: 'bg-sky/25',
    giver: 'bg-sky text-primary-dark',
    receiver: 'bg-card text-foreground ring-2 ring-sky',
    pressed:
      'data-pressed:border-sky data-pressed:bg-sky data-pressed:text-primary-dark',
  },
  {
    key: 'gratitude',
    label: 'Gratitude',
    sticker: fluentSticker('Folded hands', 'folded_hands_3d_default.png'),
    surface:
      'border-l-coral-dark bg-gradient-to-br from-coral-light/30 to-card shadow-coral-glow dark:from-coral-light/20',
    wash: 'from-coral-light/55',
    quote: 'bg-coral-light/30',
    giver: 'bg-coral-dark text-input',
    receiver: 'bg-card text-foreground ring-2 ring-coral-dark',
    pressed:
      'data-pressed:border-coral-dark data-pressed:bg-coral-dark data-pressed:text-input data-pressed:shadow-coral-glow',
  },
  {
    key: 'innovation',
    label: 'Innovation',
    sticker: fluentSticker('Light bulb'),
    surface:
      'border-l-accent-dark bg-gradient-to-br from-input to-card shadow-accent-glow dark:from-accent/15',
    wash: 'from-accent-light/70',
    quote: 'bg-accent-light/55',
    giver: 'bg-accent-dark text-primary-dark',
    receiver: 'bg-card text-foreground ring-2 ring-accent-dark',
    pressed:
      'data-pressed:border-accent-dark data-pressed:bg-accent-dark data-pressed:text-primary-dark data-pressed:shadow-accent-glow',
  },
  {
    key: 'leadership',
    label: 'Leadership',
    sticker: fluentSticker('Star'),
    surface:
      'border-l-ink bg-gradient-to-br from-primary-bg to-card shadow-teal-glow dark:from-primary/20',
    wash: 'from-primary/30',
    quote: 'bg-primary/15',
    giver: 'bg-ink text-input',
    receiver: 'bg-card text-foreground ring-2 ring-ink',
    pressed:
      'data-pressed:border-ink data-pressed:bg-ink data-pressed:text-input data-pressed:shadow-teal-glow',
  },
  {
    key: 'kindness',
    label: 'Kindness',
    sticker: fluentSticker('Yellow heart'),
    surface:
      'border-l-coral-light bg-gradient-to-br from-accent-light/35 to-card shadow-card dark:from-accent/15',
    wash: 'from-coral-light/50',
    quote: 'bg-coral-light/25',
    giver: 'bg-coral-light text-primary-dark',
    receiver: 'bg-card text-foreground ring-2 ring-coral-light',
    pressed:
      'data-pressed:border-coral-light data-pressed:bg-coral-light data-pressed:text-primary-dark',
  },
  {
    key: 'welcome',
    label: 'Welcome',
    sticker: fluentSticker('Waving hand', 'waving_hand_3d_default.png'),
    surface:
      'border-l-primary-light bg-gradient-to-br from-primary-light/25 to-card shadow-teal-glow dark:from-primary-light/20',
    wash: 'from-primary-light/45',
    quote: 'bg-primary-light/25',
    giver: 'bg-primary-light text-primary-dark',
    receiver: 'bg-card text-foreground ring-2 ring-primary-light',
    pressed:
      'data-pressed:border-primary-light data-pressed:bg-primary-light data-pressed:text-primary-dark data-pressed:shadow-teal-glow',
  },
];
