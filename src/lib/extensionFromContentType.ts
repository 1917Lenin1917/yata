export const pickExtensionFromContentType = (contentType: string) => {
  if (/image\/avif/i.test(contentType)) return "avif";
  if (/image\/webp/i.test(contentType)) return "webp";
  if (/image\/png/i.test(contentType)) return "png";
  if (/image\/gif/i.test(contentType)) return "gif";
  if (/image\/jpe?g/i.test(contentType)) return "jpg";
  if (/image\/svg\+xml/i.test(contentType)) return "svg";
  return "bin";
};
