import * as Speech from "expo-speech";

const speak = (text, onDone = () => {}) => {
    Speech.speak(text, { language: "pt-BR", onDone});};

module.exports={speak};