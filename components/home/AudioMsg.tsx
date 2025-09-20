import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from "expo-audio";

interface IAudioMsgProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    type: "text" | "voice";
    timestamp: Date;
  };
}

export default function AudioMsg({ message }: IAudioMsgProps) {
  const player = useAudioPlayer(message.text);
  const status: AudioStatus = useAudioPlayerStatus(player);
  const togglePlayback = async () => {
    if (player) {
      if (status.playing) {
        player.pause();
      } else {
        if (status.currentTime >= status.duration) {
          await player.seekTo(0);
        }
        player.play();
      }
    }
  };

  const onSeek = async (value: number) => {
    if (player) {
      await player.seekTo(value);
    }
  };

  const formatMillis = (millis: number) => {
    const totalSeconds = Math.floor(millis);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity onPress={togglePlayback}>
        <Ionicons
          name={status.playing ? "pause" : "play"}
          size={24}
          color={message.isUser ? "#fff" : "#000"}
        />
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={status.duration || 0}
        value={status.currentTime}
        minimumTrackTintColor={message.isUser ? "#fff" : "#000"}
        maximumTrackTintColor="rgba(0,0,0,0.3)"
        onSlidingComplete={onSeek}
      />
      <Text
        style={{
          color: message.isUser ? "#fff" : "#000",
          fontSize: 12,
          marginLeft: 5,
        }}
      >
        {formatMillis(status.currentTime)} / {formatMillis(status.duration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
  },
});
