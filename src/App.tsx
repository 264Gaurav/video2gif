import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Video from "./components/Video";
import Gif from "./components/Gif";
import Loader from "./components/Loader";
import InputFile from "./components/InputFile";
import MultiRangeSlider from "./components/MultiRangeSlider";

const ffmpeg = createFFmpeg();  //v2g

const doubleArrowAnimation = {
  hidden: { opacity: 0, y: -100 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1.6,
    },
  },
};

function App() {
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<File | null>(null);
  const [gif, setGif] = useState<string>();
  const [videolength, setVideoLength] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [gifSize, setGifSize] = useState("");
  const [convertLoader, setConvertLoader] = useState(false);

  // Get video length
  const videoRef = useRef<any>();

  const handleLoadedMetadata = () => {
    const videoReference = videoRef.current;
    if (!videoReference || video == null) {
      return;
    } else {
      setVideoLength(Math.floor(videoReference.duration));
    }
  };

  // Convert Function
  const convertToGif = async () => {
    setConvertLoader(true);
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video as File));
    let duration: string = (durationSeconds - startSeconds).toString();
    let start: string = startSeconds.toString();
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      `${duration}`,
      "-ss",
      `${start}`,
      "-r",
      "15",
      "-f",
      "gif",
      "out.gif"
    );
    const data = ffmpeg.FS("readFile", "out.gif");
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
    setGif(url);
    setConvertLoader(false);

    const gifFileSize = await fetch(url).then((r) => r.blob());

    // Show Gif Size Function
    const convertBytes = (x: any) => {
      const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let l = 0,
        n = parseInt(x, 10) || 0;

      while (n >= 1024 && ++l) {
        n = n / 1024;
      }

      setGifSize(n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l]);
    };
    convertBytes(gifFileSize.size);
  };

  // Initial Load of ffmpeg
  const load = async () => {
    setLoading(true);
    await ffmpeg.load();
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="App">
      {loading ? (
        <Loader />
      ) : (
        <div className="main-wrapper">
          <div className="video-and-input-container">
            <Video
              video={video}
              handleLoadedMetadata={handleLoadedMetadata}
              videoRef={videoRef}
              convertLoader={convertLoader}
            />
            <InputFile setVideo={setVideo} video={video} />
          </div>
          <div>
            {video && (
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{ duration: 0.5 }}
                className="conver-button"
                onClick={convertToGif}
              >
                <span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                Convert
              </motion.button>
            )}
          </div>
          {video && videolength > 0 && (
            <MultiRangeSlider
              min={0}
              max={videolength}
              onChange={({ min, max }: { min: number; max: number }) => {
                setStartSeconds(min);
                setDurationSeconds(max);
              }}
            />
          )}
          {gif && (
            <motion.div
              className="double-arrow-container"
              variants={doubleArrowAnimation}
              initial="hidden"
              animate="show"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.85355 2.14645C3.65829 1.95118 3.34171 1.95118 3.14645 2.14645C2.95118 2.34171 2.95118 2.65829 3.14645 2.85355L7.14645 6.85355C7.34171 7.04882 7.65829 7.04882 7.85355 6.85355L11.8536 2.85355C12.0488 2.65829 12.0488 2.34171 11.8536 2.14645C11.6583 1.95118 11.3417 1.95118 11.1464 2.14645L7.5 5.79289L3.85355 2.14645ZM3.85355 8.14645C3.65829 7.95118 3.34171 7.95118 3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355L7.14645 12.8536C7.34171 13.0488 7.65829 13.0488 7.85355 12.8536L11.8536 8.85355C12.0488 8.65829 12.0488 8.34171 11.8536 8.14645C11.6583 7.95118 11.3417 7.95118 11.1464 8.14645L7.5 11.7929L3.85355 8.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </motion.div>
          )}
          {gif && <Gif gif={gif} />}
          {gif && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="gif-size">
                gif file size : <span>{gifSize}</span>
              </div>
              <a href={gif} download className="download-button">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Download your GIF
              </a>
            </motion.div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
