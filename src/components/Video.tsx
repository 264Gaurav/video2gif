import defaultVideo from "../assets/vdo.mp4";
import ConvertLoader from "./ConvertLoader";
import IntroTitle from "./IntroTitle";

interface Video {
  video: File | null | undefined;
  handleLoadedMetadata: () => void;
  videoRef: any;
  convertLoader: boolean;
}

const Video = (props: Video) => {
  return (
    <div className="video-container">
      <video
        ref={props.videoRef}
        className="video-player"
        controls={props.video ? true : false}
        autoPlay
        muted
        width="250"
        src={props.video ? URL.createObjectURL(props.video) : defaultVideo}
        onLoadedMetadata={props.handleLoadedMetadata}
      ></video>
      {props.convertLoader && (
        <div className="convert-loader-container">
          <p className="convert-text">Converting to GiF</p>
          <ConvertLoader />
        </div>
      )}
      {!props.video && <IntroTitle />}
    </div>
  );
};

export default Video;
