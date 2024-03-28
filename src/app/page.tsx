"use client";

import { Button } from "@nextui-org/react";
import RunVocoderForm from "./ui/run-vocoder-form";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "./header";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { createRun, getRuns } from "./lib/actions";

export default function Home() {
  const [runId, setRunId] = useState<undefined | string>();
  const [runs, setRuns] = useState();

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const inner = async () => {
      // if logged in, by default load a random run. If no runs exist, create new one
      if (user) {
        const idToken = await user.getIdToken();
        const runs = await getRuns(idToken);
        setRuns(runs);

        if (Object.keys(runs).length > 0) {
          setRunId(Object.keys(runs)[0]);
        } else {
          const runId = await createRun("Untitled Run", idToken);
          setRunId(runId ? runId : undefined);
        }
      }
    };
    inner();
  }, [user]);

  return (
    <main className="flex flex-col h-screen">
      <Header runs={runs} setRunId={setRunId} setRuns={setRuns} />
      <div className="flex-grow p-4">
        <RunVocoderForm runId={runId} setRuns={setRuns} />
      </div>
      <footer className="p-4">
        <Button color="secondary" className="float-right">
          <Link href="/education">Learn More About Vocoders!</Link>
        </Button>
      </footer>
      <script src="vocoder.js"></script>
      <script src="fileio.js"></script>
    </main>
  );
}
