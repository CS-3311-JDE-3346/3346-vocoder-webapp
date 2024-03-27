"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createRun, runVocoder, updateRunName } from "../lib/actions";
import { Button, Switch, Input } from "@nextui-org/react";
import MidiInput from "./midi-input";
import ModulatorSignalInput from "./modulator-signal-input";
import CarrierSignalInput from "./carrier-signal-input";
import ShowWaveform from "./show-waveform";
import { base64ToArrayBuffer } from "./utils";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      isLoading={pending}
      className="max-w-sm"
    >
      Run
    </Button>
  );
}

export default function RunVocoderForm() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [runName, setRunName] = useState("Untitled Run");
  const [runNameTemp, setRunNameTemp] = useState("Untitled Run");
  const [runId, setRunId] = useState<undefined | string>();

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  async function runVocoderWithFile(prevState: any, formData: FormData) {
    const runName = formData.get("run-name") as string;
    if (!runName) return;

    // if logged in, create new run if not exists
    let runId;
    if (user) {
      runId = await createRun(runName, await user.getIdToken());
      setRunId(runId);
    }
    // add run id to formData
    formData.set("run-id", runId);

    // add user id to formData
    if (user) {
      formData.set("user-token", await user.getIdToken());
    }

    // add modulator signal to formData
    const modulatorSignalPath = formData.get("modulator-signal");
    if (!modulatorSignalPath) return;
    const blob = await fetch(modulatorSignalPath).then((r) => r.blob());
    formData.set("modulator-signal", blob);

    // add carrier signal to formData
    const carrierSignalPath = formData.get("carrier-signal");
    if (!carrierSignalPath) return;
    const blob2 = await fetch(carrierSignalPath).then((r) => r.blob());
    formData.set("carrier-signal", blob2);

    return await runVocoder(prevState, formData);
  }

  const initialState = { message: null, error: null };
  const [state, dispatch] = useFormState(runVocoderWithFile, initialState);
  const blob = state.buffer
    ? new Blob([base64ToArrayBuffer(state.buffer)], { type: ".wav" })
    : undefined;
  const blobUrl = blob && URL.createObjectURL(blob);

  return (
    <div>
      <form action={dispatch} className="">
        <div className="flex items-center mb-4">
          <Input
            isReadOnly={!isEditingName}
            isRequired
            value={isEditingName ? runNameTemp : runName}
            onValueChange={setRunNameTemp}
            name="run-name"
            className={"max-w-xs mr-4 " + (isEditingName ? "" : "")}
            classNames={{
              inputWrapper: isEditingName ? "" : "bg-white",
              input: "text-lg",
            }}
          />
          <Button
            isIconOnly
            onClick={() => {
              const inner = async () => {
                if (isEditingName) {
                  setRunName(runNameTemp);
                  if (runId && user)
                    updateRunName(runId, runNameTemp, await user.getIdToken());
                }
                setIsEditingName((oldValue) => !oldValue);
              };
              inner();
            }}
          >
            {isEditingName ? <FaCheck /> : <FaPencil />}
          </Button>
        </div>
        <ModulatorSignalInput />
        <div className="mt-4">
          <CarrierSignalInput />
        </div>
        <div className="flex items-center mt-4 justify-between">
          <Switch name="show-steps" value="true">
            Show steps
          </Switch>
          <SubmitButton />
          {state.error && <p className="text-red-600">{state.error}</p>}
        </div>
      </form>
      <ShowWaveform blob={blob} blobUrl={blobUrl} />
    </div>
  );
}
