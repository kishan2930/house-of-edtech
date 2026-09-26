import { buildFluentEmojiUrl } from '@meowkj/fluent-emoji-assets';

function stickerPath(parts: string[]) {
  return parts.map((part) => encodeURIComponent(part)).join('/');
}

export function fluentSticker(assetName: string, skinnedFile?: string) {
  if (!skinnedFile) {
    return buildFluentEmojiUrl(assetName);
  }

  return buildFluentEmojiUrl(assetName, {
    assetPath: stickerPath([assetName, 'Default', '3D', skinnedFile]),
  });
}
