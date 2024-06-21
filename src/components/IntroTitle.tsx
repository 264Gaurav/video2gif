import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const JobTitle = () => {
  const jobLetterAni = {
    initial: { x: 100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 1,
      },
    },
  };

  const jobBanner = {
    animate: {
      transition: {
        delayChildren: 1.9,
        staggerChildren: 0.2,
      },
    },
  };

  const jobLetters = ["made", "by", "Gaurav", "Singh"];

  return (
    <motion.h2
      variants={jobBanner}
      initial="initial"
      animate="animate"
      className="made-by-container"
    >
      {jobLetters.map((letter, i) => (
        <motion.span className="made-by" variants={jobLetterAni} key={i}>
          {letter}
        </motion.span>
      ))}
    </motion.h2>
  );
};

const JobTitleTwo = () => {
  const jobLetterAni = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 0.5,
      },
    },
  };

  const jobBanner = {
    animate: {
      transition: {
        delayChildren: 1.9,
        staggerChildren: 0.2,
      },
    },
  };

  const jobLetters = ["VIDEO", "TO", "GIF", "CONVERTER"];

  return (
    <motion.span
      variants={jobBanner}
      initial="initial"
      animate="animate"
      className="video-to-gif-container"
    >
      {jobLetters.map((letter, i) => (
        <motion.span className="video-to-gif" variants={jobLetterAni} key={i}>
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

const IntroTitle = () => {
  const [time, setTime] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTime(true);
    }, 1000);
  }, []);
  return (
    <div className="title-container">
      <h1>
        <JobTitleTwo />
      </h1>
      {time && <JobTitle />}
    </div>
  );
};

export default IntroTitle;
