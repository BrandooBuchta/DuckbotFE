import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "/ffmpeg-core/ffmpeg-core.js",
});

export const convertVideo = async (file: File): Promise<Blob> => {
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  const fileName = "input.mp4";
  const outputName = "output.mp4";

  ffmpeg.FS("writeFile", fileName, await fetchFile(file));

  await ffmpeg.run(
    "-i",
    fileName,
    "-vf",
    "scale='min(720,iw)':-2:flags=lanczos,eq=saturation=1.3:contrast=1.2:brightness=0.02",
    "-c:v",
    "libx264",
    "-crf",
    "23",
    "-preset",
    "fast",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    outputName,
  );

  const data = ffmpeg.FS("readFile", outputName);

  return new Blob([data], { type: "video/mp4" });
};
