import dynamic from "next/dynamic";
import axios from "axios";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Dropdown from "react-bootstrap/Dropdown";

const ReactMediaRecorder = dynamic(
  () => import("react-media-recorder").then((mod) => mod.ReactMediaRecorder),
  {
    ssr: false,
  }
);

export default function Page() {
  const [transcribedText, setTranscribedText] = useState(null);
  const [recordingState, setRecordingState] = useState("not-recording");
  const options = ["hy", "lt", "ru"];
  const [selected, setSelected] = useState(options[0]);
  const submit = () => {
    console.log(selected);
  };
  return (
    <div>
      <ReactMediaRecorder
        video={false}
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <button
              onClick={() => {
                console.log("status:", status);
                if (status == "idle" || status == "stopped") {
                  startRecording();
                  setRecordingState("recording");
                } else {
                  setRecordingState("not-recording");
                  stopRecording();
                }
              }}
            >
              {recordingState == "not-recording"
                ? "Start Recording"
                : "Stop Recording"}
            </button>

            <form>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {options.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button type="button" onClick={submit}>
                Submit
              </button>
            </form>
          </div>
        )}
        onStop={async (mediaBlobUrl, blob) => {
          console.log(mediaBlobUrl, blob);
          const audioFile = new File([blob], "recording.wav", {
            type: "audio/wav",
          });
          const formData = new FormData();
          formData.append("file", audioFile);

          const apiKey = process.env.OPEN_AI_API_KEY;
          console.log("API KEY:", apiKey);
          const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions ",
            { file: audioFile, model: "whisper-1", language: selected },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );

          const openAIresponse = response.data.text;
          setTranscribedText(openAIresponse);
        }}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: "5vh",
        }}
      >
        Transcribed text: {transcribedText}
      </div>
    </div>
  );
}
