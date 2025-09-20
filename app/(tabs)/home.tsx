import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useMainContext } from "@/providers/MainProvider";
import { Colors } from "@/constants/theme";
import { ChatHeader } from "@/components/home/ChatHeader";
import { ChatMessage } from "@/components/home/ChatMessage";
import { TypingIndicator } from "@/components/home/TypingIndicator";
import { ChatInput } from "@/components/home/ChatInput";

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

  const handleMenuPress = () => console.log("Menu funksionallığı yazacıq");

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 2000)
    );
    const responses = [
      "Bu çox maraqlı sualdir. Sizə kömək etməyə çalışacam.",
      "Anlayıram. Bu barədə daha ətraflı danışaq.",
      "Çox yaxşı sual! Bu mövzu məni maraqlandırır.",
      "Sizin fikrinizi anlayıram. Gəlin bunu birlikdə araşdıraq.",
      "Bu məsələ haqqında düşünürəm. Bir neçə variant təklif edə bilərəm.",
    ];

    const aiResponse: Message = {
      id: Date.now().toString() + "_ai",
      text: responses[Math.floor(Math.random() * responses.length)],
      isUser: false,
      timestamp: new Date(),
      type: "text",
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };
  const handleSendMessage = async (text: string, isVoice = false) => {
    const userMessage: Message = {
      id: Date.now().toString() + "_user",
      type: isVoice ? "voice" : "text",
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    simulateAIResponse(text);
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
      <ChatHeader onMenuPress={handleMenuPress} />

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
