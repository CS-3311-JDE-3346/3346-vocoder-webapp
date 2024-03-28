"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import CreateSignalInputFromRecordingModal from "./modals/create-signal-input-from-recording-modal";
import CreateSignalInputFromFileModal from "./modals/create-signal-input-from-file-modal";

export default function ModulatorSignalInput({ signals, setSignals, onSignalAdd }) {
  const [value, setValue] = useState(new Set(["Hello example"]));
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();
  const {
    isOpen: isOpenRecording,
    onOpen: onOpenRecording,
    onOpenChange: onOpenChangeRecording,
  } = useDisclosure();

  const selectedSignal = signals.find((c) => c.name === [...value][0]);

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: TimelinePlugin,
      options: {
        container: `#timeline-modulator`,
      },
    },
  ];

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(selectedSignal?.file_name);
    }
  }, [value]);

  const handleWSMount = (waveSurfer) => {
    wavesurferRef.current = waveSurfer;

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

      // if (window) {
      //   window.surferidze = wavesurferRef.current;
      // }
    }
  };

  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white flex-grow">
      <div className="flex gap-4">
        <input
          className="hidden"
          name={`modulator-signal`}
          readOnly
          value={selectedSignal?.file_name}
        />
        <Select
          label="Modulator Signal"
          selectedKeys={value}
          onSelectionChange={setValue}
          disallowEmptySelection
        >
          {signals.map((signal) => (
            <SelectItem key={signal.name} value={signal.name}>
              {signal.name}
            </SelectItem>
          ))}
        </Select>
        <Dropdown>
          <DropdownTrigger>
            <Button>Create</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Select how to create a new signal">
            <DropdownItem
              key="file"
              onPress={() => {
                onOpenFile();
              }}
            >
              From audio file
            </DropdownItem>
            <DropdownItem
              key="recording"
              onPress={() => {
                onOpenRecording();
              }}
            >
              From recording
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>
        <WaveSurfer plugins={plugins} onMount={handleWSMount}>
          <WaveForm id={`waveform-modulator`}></WaveForm>
          <div id={`timeline-modulator`} />
        </WaveSurfer>
        <div className="mt-6">
          {isPlaying ? (
            <Button onPress={() => wavesurferRef.current.pause()}>Pause</Button>
          ) : (
            <Button onPress={() => wavesurferRef.current.play()}>Play</Button>
          )}
          <Button
            onPress={() => wavesurferRef.current.seekTo(0)}
            className="ml-4"
          >
            Restart
          </Button>
          <Button className="ml-4">Filter</Button>
        </div>
      </div>
      <CreateSignalInputFromFileModal
        isOpen={isOpenFile}
        onOpenChange={onOpenChangeFile}
        signalType="modulator"
        signals={signals}
        setSignals={setSignals}
        onSignalAdd={onSignalAdd}
      />
      <CreateSignalInputFromRecordingModal
        isOpen={isOpenRecording}
        onOpenChange={onOpenChangeRecording}
        signalType="modulator"
        signals={signals}
        setSignals={setSignals}
        onSignalAdd={onSignalAdd}
      />
    </div>
  );
}
