export function optimizarImagen(file, maxWidth = 1400, quality = 0.7) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const scale = maxWidth / img.width;
      const w = img.width > maxWidth ? maxWidth : img.width;
      const h = img.width > maxWidth ? img.height * scale : img.height;

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        blob => {
          const optimizada = new File([blob], file.name, {
            type: "image/jpeg",
          });
          resolve(optimizada);
        },
        "image/jpeg",
        quality
      );
    };
  });
}
