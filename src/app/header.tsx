import {
  Button,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../firebase/firebaseApp";
import React, { useState } from "react";
import { createRun, getRuns } from "./lib/actions";

export default function Header({ runs, setRunId, setRuns }) {
  app;
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
  };

  const SignStat = () => {
    if (user) {
      return (
        <Button
          onClick={() => auth.signOut()}
          className="bg-blue-700 text-slate-300"
        >
          Sign Out
        </Button>
      );
    } else {
      return (
        <Button onClick={signIn} className="bg-blue-700 text-slate-300">
          Sign In
        </Button>
      );
    }
  };

  const [EducationRelation, setValue] = useState("Not a Teacher or Student");

  const voidFunction = () => {
    return null;
  };

  const UserSettingActive = () => {
    if (user) {
      return (
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button className="bg-blue-700 text-slate-300">User Profile</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <p>User Profile</p>
              <div>____________________________________</div>
              <Select
                label="Education relation"
                placeholder={EducationRelation}
                onSelectionChange={setValue}
              >
                <SelectItem
                  key={"Not a Teacher or Student"}
                  value={"Not a Teacher or Student"}
                >
                  Not a Teacher or Student
                </SelectItem>
                <SelectItem key={"Teacher"} value={"Teacher"}>
                  Teacher
                </SelectItem>
                <SelectItem key={"Student"} value={"Student"}>
                  Student
                </SelectItem>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <header className="flex justify-between p-4 bg-blue-300 drop-shadow">
        <div className="flex items-center">
          <p className="mr-8 font-bold text-slate-800">Learn Vocoders</p>

          {user && (
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-blue-700 text-slate-300">File</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="File Menu">
                <DropdownItem
                  key="new"
                  onPress={async () => {
                    if (user) {
                      const idToken = await user.getIdToken();
                      const runId = await createRun("Untitled Run", idToken);
                      setRunId(runId);
                      const runs = await getRuns(idToken);
                      setRuns(runs);
                    }
                  }}
                >
                  New
                </DropdownItem>

                <DropdownItem key="open" onPress={onOpen}>
                  Open
                </DropdownItem>

                <DropdownItem
                  key="save"
                  onPress={() => {
                    voidFunction();
                  }}
                >
                  Save
                </DropdownItem>

                <DropdownItem
                  key="save-as"
                  onPress={() => {
                    voidFunction();
                  }}
                >
                  Save As
                </DropdownItem>

                <DropdownItem
                  key="export_as_pdf"
                  onPress={() => {
                    voidFunction();
                  }}
                >
                  Export as PDF
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <div className="flex">
          <UserSettingActive /> &nbsp;&nbsp;
          <SignStat /> &nbsp;&nbsp;
          <Switch
            defaultChecked={false}
            color="primary"
            endContent={<FaCircleInfo />}
          >
            Explanation mode
          </Switch>
        </div>
      </header>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Open an Existing Run
              </ModalHeader>
              <ModalBody>
                <Listbox
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  aria-label="select run"
                >
                  {Object.entries(runs).map(([id, info]) => (
                    <ListboxItem key={id}>{info.runName}</ListboxItem>
                  ))}
                </Listbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    const runId = Array.from(selectedKeys)[0];
                    setRunId(runId);
                  }}
                >
                  Open
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
