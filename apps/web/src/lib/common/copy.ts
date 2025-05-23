export function copy_text(text: string) {
  navigator.clipboard.writeText(text).catch((e) => {
    console.error('failed to copy');
  });
}
