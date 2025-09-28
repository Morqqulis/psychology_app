import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";
import { ChatHeader } from "@/components/home/ChatHeader";
import { ChatMessage } from "@/components/home/ChatMessage";
import { TypingIndicator } from "@/components/home/TypingIndicator";
import { ChatInput } from "@/components/home/ChatInput";
import axios from "axios";
import { uploadApi } from "@/shared/lib/axios";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: "text" | "voice";
}

export default function ChatScreen() {
  const { them } = useMainContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Salam! Mən Psy-yam. Sizə necə kömək edə bilərəm? İstədiyiniz hər şeyi mənə soruşa bilərsiniz.",
      isUser: false,
      type: "text",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendVoiceMessage = async (uri: string) => {
    try {
      setIsTyping(true);
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/m4a",
        name: "voice.m4a",
      } as any);
      const response = await uploadApi.post("/voice", formData);
      generateMsg(`${response.data.text}`, false, false);
    } catch (err) {
      console.log("Voice upload error:", err);
      generateMsg(
        `Mesajınızı əldə edə bilmədim. Zəhmət olmasa yenidən cəhd edin`,
        false,
        false
      );
    } finally {
      setIsTyping(false);
    }
  };

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const { data, status } = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "/chat",
        { message: userMessage }
      );

      if (status === 200 && data?.reply) {
        generateMsg(data.reply, false, false);
      }
    } catch (error) {
      generateMsg(
        `Mesajınızı əldə edə bilmədim. Zəhmət olmasa yenidən cəhd edin`,
        false,
        false
      );
      console.log({ error });
    } finally {
      setIsTyping(false);
    }
  };
  
  const generateMsg = (text: string, isVoice: boolean, isUser: boolean) => {
    const message: Message = {
      id: `${Math.floor(Math.random() * 10000).toString()}${isUser ? "_user" : "_ai"}`,
      type: isVoice ? "voice" : "text",
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = async (text: string, isVoice = false) => {
    generateMsg(text, isVoice, true);
    if (isVoice) {
      await sendVoiceMessage(`file://${text}`);
    } else {
      simulateAIResponse(text);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <ChatMessage message={item} isNew={index === messages.length - 1} />
  );

  const renderFooter = () => {
    if (isTyping) {
      return <TypingIndicator />;
    }
    return null;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[them].background }]}
    >
      <ChatHeader />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {},
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
    flexGrow: 1,
  },
});
