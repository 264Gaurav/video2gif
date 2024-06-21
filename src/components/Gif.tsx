import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Gif {
  gif: string;
}
const Gif = ({ gif }: Gif) => {
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gif && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [gif]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="video-container gif-container"
      ref={fieldRef}
    >
      {gif && <img src={gif} className="video-player" />}
    </motion.div>
  );
};

export default Gif;
