import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";

export default function CreateSignalInputFromFileModal({
  isOpen,
  onOpenChange,
  signalType,
  signals,
  setSignals,
  onSignalAdd,
}) {
  const [formError, setFormError] = useState<string>("");

  const createSignalFromFile = (onClose, formData: FormData) => {
    if (
      !formData.get("name") ||
      !formData.get("file") ||
      !formData.get("file").size
    ) {
      setFormError("Please specify a name and audio file");
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
      file_name: URL.createObjectURL(formData.get("file")),
      audio_name: URL.createObjectURL(formData.get("file")),
      isAudio: true,
    };
    setSignals((prev) => [...prev, newSignal]);
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
              createSignalFromFile(onClose, formData);
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              {`Create a new ${signalType} signal`}
            </ModalHeader>
            <ModalBody>
              <Input label="Name" name="name" labelPlacement="outside-left" />

              <div className="flex">
                <label htmlFor="file" className="text-sm">
                  Upload Signal
                </label>
                <input
                  id={`file-${signalType}`}
                  name="file"
                  type="file"
                  accept="audio/*"
                />
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
