"use strict";

import * as store from "./store.js";

// video/audio data
let mediaStream = null;

// Getting an access to camera and microphone and showing that in local preview
// note: Navigator.mediaDevices read-only property returns a MediaDevices object,
// which provides access to connected media input devices like cameras and microphones, as well as screen sharing.
const getAudioVideoAccess = () => {
  // constraints parameter is an object with two members: video and audio, describing the media types requested
  const defaultConstraints = {
    audio: true,
    video: true,
  };

  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    // A Promise whose fulfillment handler receives a MediaStream object
    // when the requested media has successfully been obtained
    .then(stream => {
      // stream & auto play the video
      const localVideo = document.getElementById("local_video");
      localVideo.srcObject = stream;

      localVideo.addEventListener("loadedmetadata", () => {
        localVideo.play();
      });

      mediaStream = stream;
    })
    .catch(err => {
      console.log("Error occurred when trying to access camera:", err);
    });
};

// Codec encodes and compresses, then decodes and decompresses the data that makes up your video. It is about what comes out of the camera; the filming and recording process. An example of a Codec is H.264. The Format or Container, stores the audio, video, subtitles, and other elements that make up your video.

// mimeType: MIME is acceptable 'media' type to check for video/audio. eg. video/webm, video/mp4, audio/webm
// HD quality video codec 'codecs=vp9'
const vp9Codec = "video/webm;codecs=vp9";
const vp9Options = { mimeType: vp9Codec };

// MediaRecorder object
let mediaRecorder;

// video data
let recordedVideoChunks = [];

// options for media
async function captureScreenShare(
  mediaConstraints = {
    video: true,
  }
) {
  // getDisplayMedia to get access for screen share stream
  const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
  return screenStream;
}

async function captureAudio(
  mediaConstraints = {
    video: true,
    audio: true,
  }
) {
  const audioVideoStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
  return audioVideoStream;
}

const startRecording = async () => {
  const screenStream = await captureScreenShare();
  const audioStream = await captureAudio();

  // note: Screen share options
  // const stream = new MediaStream([...screenStream.getTracks(), ...audioStream.getTracks()]);

  // stream: MediaStream video/audio data
  const stream = new MediaStream([...mediaStream.getTracks()]);

  // MediaRecorder.isTypeSupported() static method returns a Boolean which is true if the
  // MIME type specified is one the user agent should be able to successfully record.
  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    // MediaRecorder interface of the MediaStream Recording API provides functionality to easily record media.
    // It is created using the MediaRecorder() constructor.
    // Creates a new MediaRecorder object, given a MediaStream to record.
    // NOTE: stream: MediaStream video/audio data
    mediaRecorder = new MediaRecorder(stream, vp9Options);
  }

  // note: need to define this event listener
  // when the entire media has been recorded & stopped if timeslice wasn't specified
  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedVideoChunks.push(e.data);
    }
  };

  // start recording
  mediaRecorder.start();

  // pause recording
  mediaRecorder.pause();

  // resume recording
  mediaRecorder.resume();

  // stop recording
  mediaRecorder.onstop = function (e) {
    // blob is A file-like object of immutable, raw data.
    const blob = new Blob(recordedVideoChunks, {
      type: "video/webm",
    });

    // A string containing an object URL that can be used to reference the contents of the specified source object,
    // represents the specified File object or Blob object.
    const url = window.URL.createObjectURL(blob);

    // to download the recorded video
    const a = document.createElement("a");
    document.body.appendChild(a);

    a.style.display = "none";
    a.href = url;

    // download file with this name
    a.download = "recording.webm";

    // click event
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      // to remove object URL
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  // error recording
  mediaRecorder.onerror = function (error) {
    throw Error(`Video record error: ${error || "try again!"}`);
  };
};

// ui events
getAudioVideoAccess();

// start recording
const startRecordingButton = document.getElementById("start_recording_button");
startRecordingButton.addEventListener("click", () => {
  startRecording();
});

// stop recording
const stopRecordingButton = document.getElementById("stop_recording_button");
stopRecordingButton.addEventListener("click", () => {
  mediaRecorder.stop();

  console.log("recordedVideoChunks", recordedVideoChunks);
});

// pause resume switch
const resumeRecordingButton = document.getElementById("resume_recording_button");
const pauseRecordingButton = document.getElementById("pause_recording_button");

const switchPauseResumeButtons = (switchForResumeButton = false) => {
  if (switchForResumeButton) {
    pauseRecordingButton.classList.add("display_none");
    resumeRecordingButton.classList.remove("display_none");
  } else {
    pauseRecordingButton.classList.remove("display_none");
    resumeRecordingButton.classList.add("display_none");
  }
};

// pause recording
pauseRecordingButton.addEventListener("click", () => {
  mediaRecorder.pause();

  switchPauseResumeButtons(true);
});

// resume recording
resumeRecordingButton.addEventListener("click", () => {
  mediaRecorder.resume();

  switchPauseResumeButtons();
});

// mute unmute audio
const micOnImgSrc = "../utils/images/mic.png";
const micOffImgSrc = "../utils/images/micOff.png";

const updateMicButton = micActive => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micActive ? micOffImgSrc : micOnImgSrc;
};

const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  // check if microphone is enabled
  const micEnabled = mediaStream.getAudioTracks()[0].enabled;
  // toggle microphone
  mediaStream.getAudioTracks()[0].enabled = !micEnabled;

  updateMicButton(micEnabled);
});

// turn on/off camera
const cameraOnImgSrc = "../utils/images/camera.png";
const cameraOffImgSrc = "../utils/images/cameraOff.png";

const updateCameraButton = cameraActive => {
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = cameraActive ? cameraOffImgSrc : cameraOnImgSrc;
};

const cameraButton = document.getElementById("camera_button");
cameraButton.addEventListener("click", () => {
  // check if camera is enabled
  const cameraEnabled = mediaStream.getVideoTracks()[0].enabled;
  // toggle camera
  mediaStream.getVideoTracks()[0].enabled = !cameraEnabled;

  updateCameraButton(cameraEnabled);
});

// screen share
let screenSharingActive = false;

const switchScreenShareButton = document.getElementById("screen_share_button");
switchScreenShareButton.addEventListener("click", async () => {
  if (screenSharingActive) {
  } else {
  }
});
