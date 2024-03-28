import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";

export default function CreateSignalInputFromRecordingModal({
  isOpen,
  onOpenChange,
  signalType,
  signals,
  setSignals,
  onSignalAdd,
}) {
  const [formError, setFormError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState();

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: RecordPlugin,
    },
    {
      plugin: TimelinePlugin,
      options: {
        container: `#timeline-record`,
      },
    },
  ];

  const handleWSMount = (waveSurfer) => {
    wavesurferRef.current = waveSurfer;
    const record = waveSurfer.plugins[0];
    record.on("record-end", (blob) => {
      setRecordingUrl(URL.createObjectURL(blob));
    });
    const containerElement = document.getElementById("waveform-record");
    if (containerElement) {
      containerElement.style.border = "1px solid gray";
      containerElement.style.borderRadius = "4px";
    }

    if (wavesurferRef.current) {
      wavesurferRef.current.on("ready", () => {
        // console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("loading", (data) => {
        // console.log("loading --> ", data);
      });

      wavesurferRef.current.on("play", (data) => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", (data) => {
        setIsPlaying(false);
      });
    }
  };

  const createSignalFromRecording = (onClose, formData: FormData) => {
    if (!formData.get("name") || !recordingUrl) {
      setFormError("Please specify a name and record an audio clip");
      return;
    }

    const nameExists = signals.some(
      (signal) => signal.name === formData.get("name")
    );
    if (nameExists) {
      setFormError("A signal with the same name already exists");
      return;
    }

    const newSignal = {
      name: formData.get("name"),
      file_name: recordingUrl,
      audio_name: recordingUrl,
      isAudio: true,
    };
    setSignals((prev) => [...prev]);
    onSignalAdd(newSignal);

    setFormError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        setFormError("");
        onOpenChange();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form
            action={(formData) => {
              createSignalFromRecording(onClose, formData);
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              {`Create a new ${signalType} signal`}
            </ModalHeader>
            <ModalBody>
              <Input label="Name" name="name" labelPlacement="outside-left" />

              <div>
                <WaveSurfer plugins={plugins} onMount={handleWSMount}>
                  <WaveForm id={`waveform-record`}></WaveForm>
                  <div id={`timeline-record`} />
                </WaveSurfer>
                {isRecording ? (
                  <Button
                    onPress={() => {
                      if (wavesurferRef.current) {
                        const record = wavesurferRef.current.plugins[0];
                        record.stopRecording();
                        setIsRecording(false);
                      }
                    }}
                    className="mt-4"
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    onPress={() => {
                      if (wavesurferRef.current) {
                        const record = wavesurferRef.current.plugins[0];
                        record.startRecording();
                        setIsRecording(true);
                      }
                    }}
                    className="mt-4"
                  >
                    {recordingUrl ? "Re-record" : "Record"}
                  </Button>
                )}
              </div>

              {formError && <p className="text-red-600">{formError}</p>}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Create
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
