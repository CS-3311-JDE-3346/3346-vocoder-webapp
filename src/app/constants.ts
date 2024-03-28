const defaultModulatorSignals = [
  {
    name: "Hello example",
    file_name: "/hello_example.wav",
    isAudio: true,
  },
];

const defaultCarrierSignals = [
  {
    name: "Twinkle Twinkle Little Star",
    file_name: "/twinkle_twinkle_little_star.mid",
    // audio_name: undefined, // synthesized by calling server action
    isAudio: false,
  },
];

export { defaultCarrierSignals, defaultModulatorSignals };
