"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, MessageCircle, Send, Bot, Mail, Phone, MapPin, Clock } from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  showOptions?: boolean
  showContactForm?: boolean
}

interface ChatbotProps {
  className?: string
}

// Enhanced knowledge base with FAQs and more comprehensive answers
const knowledgeBase = [
  // General greetings and casual conversation
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"],
    answer:
      "Hello there! 👋 I'm your InstaLabel assistant, ready to help you learn about our smart kitchen labeling system. How can I assist you today?",
  },
  {
    keywords: ["how are you", "how are you doing", "how's it going"],
    answer:
      "I'm doing great, thanks for asking! 😊 I'm here and ready to help you discover how InstaLabel can transform your kitchen operations. What would you like to know?",
  },
  {
    keywords: ["thanks", "thank you", "thank you so much", "appreciate it"],
    answer:
      "You're very welcome! 😊 I'm here to help make your InstaLabel journey as smooth as possible. Is there anything else you'd like to know?",
  },
  {
    keywords: ["bye", "goodbye", "see you", "talk to you later", "have a good day"],
    answer:
      "Goodbye! 👋 Feel free to come back anytime if you have more questions about InstaLabel. Have a wonderful day!",
  },

  // Core product information
  {
    keywords: ["what is instalabel", "what does instalabel do", "how does instalabel work"],
    answer:
      "InstaLabel is a professional kitchen labeling system designed for restaurants, cafés, food trucks, and catering businesses. It lets you print food safety labels—prep, cook, use‑first, PPDS—instantly from any device without handwriting, fully compliant with regulations like Natasha's Law.",
  },
  {
    keywords: ["who benefits", "who benefits most", "ideal for"],
    answer:
      "Food operations of all sizes benefit—especially those with busy prep areas, high staff turnover, or needing airtight compliance. Ideal for multi‑location kitchens striving to reduce waste and errors.",
  },

  // Pricing and plans
  {
    keywords: ["pricing", "cost", "how much", "plans", "subscription"],
    answer:
      "InstaLabel offers flexible pricing plans starting with a free trial. Our plans are designed to scale with your business needs, from small cafes to large restaurant chains. Contact us for detailed pricing information or book a demo to see which plan fits your business best.",
  },
  {
    keywords: ["trial", "free trial", "demo", "book demo"],
    answer:
      "Yes! Try InstaLabel free for 14 days—no credit card required—with full access to features and existing printer support. You can also book a personalized demo where our team will show you exactly how InstaLabel can work in your kitchen.",
  },

  // Technical compatibility
  {
    keywords: [
      "thermal printer",
      "printer",
      "hardware",
      "compatible",
      "equipment",
      "what equipment",
    ],
    answer:
      "Just any USB thermal label printer for web printing—or Android devices for mobile printing. Any TSPL compliant hardware will work. InstaLabel is compatible with most thermal printers commonly used in commercial kitchens.",
  },
  {
    keywords: ["setup", "installation", "how to start", "getting started", "how fast is setup"],
    answer:
      "You can get started in minutes: upload your menu or ingredient list, plug in your printer, select the label type, and print—no drivers or plugins needed. After signing up, you can import your existing menu items, set up your thermal printer, and start printing labels within minutes.",
  },

  // Compliance and safety
  {
    keywords: [
      "allergen",
      "allergen labels",
      "food safety",
      "compliance",
      "how does instalabel ensure compliance",
    ],
    answer:
      "All labels include auto-calculated prep dates and expiry, highlight allergens (Natasha's Law), and use FDA/EHO-approved templates. The system generates complete print logs for easy audits. InstaLabel helps you create compliant allergen labels that meet food safety regulations.",
  },
  {
    keywords: ["haccp", "food safety compliance", "regulations", "standards", "natasha's law"],
    answer:
      "InstaLabel is designed with HACCP principles in mind and helps you maintain food safety compliance. Our labeling system creates an audit trail, tracks food safety procedures, and ensures all regulatory requirements are met.",
  },

  // Label types and features
  {
    keywords: [
      "label types",
      "which label types",
      "supported labels",
      "prep labels",
      "cook labels",
      "ppds",
    ],
    answer:
      "InstaLabel supports prep, cook, use-first, defrost, and PPDS labels. Each includes ingredients, allergen alerts, prep/expiry dates, and storage instructions. You can print food safety labels instantly from any device without handwriting.",
  },
  {
    keywords: ["expiry dates", "shelf life", "food expiration", "tracking", "override expiry"],
    answer:
      "InstaLabel automatically tracks expiry dates for all your food items. You can set custom shelf life rules, get alerts for items approaching expiration, and print labels with clear expiry information. Yes—InstaLabel lets you adjust or override expiry logic when needed, while keeping full logging for traceability.",
  },

  // Business types and results
  {
    keywords: ["restaurant", "cafe", "food business", "kitchen", "catering", "food truck"],
    answer:
      "InstaLabel is perfect for any food service business including restaurants, cafes, food trucks, catering companies, and commercial kitchens. Whether you're a small family restaurant or a large chain, our system scales to meet your needs.",
  },
  {
    keywords: ["results", "what results", "expect", "benefits", "save time", "reduce waste"],
    answer:
      "Restaurants save about 15+ hours per week, reduce waste by 30%, and avoid compliance fines—all typically paying back in the first month. You can expect improved efficiency, better compliance, and significant time savings.",
  },

  // Support and contact
  {
    keywords: ["support", "help", "contact", "customer service"],
    answer:
      "Our support team is here to help! You can reach us through our contact form, email, or phone. We also provide comprehensive documentation and video tutorials to help you get the most out of InstaLabel.",
  },

  // Additional helpful responses
  {
    keywords: ["cool", "awesome", "great", "amazing", "wow"],
    answer:
      "I'm glad you think so! 😄 InstaLabel really is a game-changer for kitchen management. Would you like to learn more about any specific feature or see how it could work in your kitchen?",
  },
  {
    keywords: ["interesting", "tell me more", "more info", "learn more"],
    answer:
      "Absolutely! I'd love to tell you more about InstaLabel. What aspect interests you most - the labeling features, compliance benefits, ease of use, or something else? I'm here to help you discover everything InstaLabel can do for your business!",
  },
  {
    keywords: ["who are you", "what can you do", "your name"],
    answer:
      "I'm your InstaLabel assistant! 🤖 I'm here to help answer your questions about our smart kitchen labeling system. I can tell you about features, pricing, compatibility, compliance, and more. Think of me as your personal InstaLabel guide!",
  },
]

// Helpful option buttons for users
const helpOptions = [
  { text: "What is InstaLabel?", keywords: ["what is instalabel"] },
  { text: "Pricing & Plans", keywords: ["pricing", "cost"] },
  { text: "Technical Setup", keywords: ["setup", "printer", "equipment"] },
  { text: "Compliance & Safety", keywords: ["compliance", "allergen", "haccp"] },
  { text: "Label Types", keywords: ["label types", "prep labels"] },
  { text: "Business Benefits", keywords: ["benefits", "results", "save time"] },
  { text: "Contact Support", keywords: ["contact", "support", "help"] },
]

export function Chatbot({ className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your InstaLabel assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      showOptions: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [askedTopics, setAskedTopics] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    for (const item of knowledgeBase) {
      if (item.keywords.some((keyword) => lowerQuestion.includes(keyword))) {
        return item.answer
      }
    }

    return ""
  }

  // Test with some specific unknown questions to debug
  const isUnknownQuestion = (question: string): boolean => {
    const lowerQuestion = question.toLowerCase()

    // Check if it's a known question
    for (const item of knowledgeBase) {
      if (item.keywords.some((keyword) => lowerQuestion.includes(keyword))) {
        return false
      }
    }

    return true
  }

  // Test function to trigger contact form
  const testUnknownQuestion = () => {
    const testQuestions = [
      "What is the weather like?",
      "How do I cook pasta?",
      "What's your favorite color?",
      "Tell me a joke",
      "What time is it in Tokyo?",
      "How many stars are in the sky?",
      "What's the meaning of life?",
      "Can you help me with my homework?",
      "What's the capital of Mars?",
      "How do I fix my car?",
    ]

    return testQuestions.some((q) => q.toLowerCase().includes(inputValue.toLowerCase()))
  }

  // Get dynamic help options based on what user hasn't asked about
  const getDynamicOptions = () => {
    return helpOptions.filter((option) => {
      // Check if any of the option's keywords match what the user has already asked
      return !option.keywords.some((keyword) =>
        Array.from(askedTopics).some((topic) => topic.toLowerCase().includes(keyword.toLowerCase()))
      )
    })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Add the question to asked topics
    setAskedTopics((prev) => new Set([...prev, inputValue]))

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(inputValue)
      const isUnknown = !answer || testUnknownQuestion()

      if (!isUnknown) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: answer,
          isUser: false,
          timestamp: new Date(),
          showOptions: true,
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        // Unknown question - show contact form
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm not sure about that specific question, but I'd be happy to help you get in touch with our team for more detailed assistance!",
          isUser: false,
          timestamp: new Date(),
          showContactForm: true,
        }
        setMessages((prev) => [...prev, botMessage])
      }

      setIsTyping(false)
    }, 3000)
  }

  const handleOptionClick = (option: (typeof helpOptions)[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Add the option to asked topics
    setAskedTopics((prev) => new Set([...prev, option.text]))

    setTimeout(() => {
      const answer = findAnswer(option.keywords[0])
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        isUser: false,
        timestamp: new Date(),
        showOptions: true,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const dynamicOptions = getDynamicOptions()

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button with avatar1 and speech bubble */}
      <div
        className={`transition-all duration-300 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <Button
          onClick={toggleChat}
          className="h-16 w-16 rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <Image
            src="/avatar1.png"
            alt="InstaLabel Assistant"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Button>
      </div>

      {/* Chat Window */}
      <div
        className={`absolute bottom-0 right-0 w-80 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 pb-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/avatar5.png"
                  alt="InstaLabel Assistant"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">InstaLabel Assistant</CardTitle>
                <p className="text-sm text-blue-100">Ask me anything!</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-80 px-4 py-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Show dynamic help options after bot messages */}
                    {!message.isUser && message.showOptions && dynamicOptions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500">What else would you like to know?</p>
                        <div className="flex flex-wrap gap-2">
                          {dynamicOptions.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptionClick(option)}
                              className="h-8 text-xs"
                            >
                              {option.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show contact form for unknown questions */}
                    {!message.isUser && message.showContactForm && (
                      <div className="mt-3 rounded-lg border bg-gray-50 p-3">
                        <p className="mb-3 text-sm font-medium text-gray-700">
                          Get in touch with our team:
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span>contact@instalabel.co</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span>(0740) 567890</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span>Bournemouth, UK</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Response within 24 hours</span>
                          </div>
                        </div>
                        <Button
                          className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open("/about#contact", "_blank")}
                        >
                          Fill Contact Form
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-gray-100 px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Bot className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about InstaLabel..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
