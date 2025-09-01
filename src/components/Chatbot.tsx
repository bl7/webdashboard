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
  contextualOptions?: typeof helpOptions
}

interface ChatbotProps {
  className?: string
}

// Enhanced knowledge base with comprehensive answers for all specified questions
const knowledgeBase = [
  // General greetings and casual conversation
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"],
    answer:
      "Hello there! 👋 I'm your InstaLabel assistant, ready to help you learn about our smart kitchen labeling system. How can I assist you today?",
  },
  {
    keywords: [
      "how are you",
      "how are you doing",
      "how's it going",
      "how you doing",
      "whats up",
      "sup",
      "wassup",
      "how do you do",
    ],
    answer:
      "I'm doing great, thanks for asking! 😊 I'm here and ready to help you discover how InstaLabel can transform your kitchen operations. What would you like to know?",
  },
  {
    keywords: ["what's up", "whats up", "sup", "wassup", "what up", "what is up"],
    answer:
      "Not much, just here to help you with InstaLabel! 😄 What can I tell you about our smart kitchen labeling system?",
  },
  {
    keywords: ["thanks", "thank you", "thank you so much", "appreciate it", "thx", "ty"],
    answer:
      "You're very welcome! 😊 I'm here to help make your InstaLabel journey as smooth as possible. Is there anything else you'd like to know?",
  },
  {
    keywords: [
      "bye",
      "goodbye",
      "see you",
      "talk to you later",
      "have a good day",
      "cya",
      "see ya",
    ],
    answer:
      "Goodbye! 👋 Feel free to come back anytime if you have more questions about InstaLabel. Have a wonderful day!",
  },
  {
    keywords: ["cool", "awesome", "great", "amazing", "wow", "nice", "sweet"],
    answer:
      "I'm glad you think so! 😄 InstaLabel really is a game-changer for kitchen management. Would you like to learn more about any specific feature or see how it could work in your kitchen?",
  },
  {
    keywords: ["interesting", "tell me more", "more info", "learn more", "that's interesting"],
    answer:
      "Absolutely! I'd love to tell you more about InstaLabel. What aspect interests you most - the labeling features, compliance benefits, ease of use, or something else? I'm here to help you discover everything InstaLabel can do for your business!",
  },
  {
    keywords: ["who are you", "what can you do", "your name", "what do you do"],
    answer:
      "I'm your InstaLabel assistant! 🤖 I'm here to help answer your questions about our smart kitchen labeling system. I can tell you about features, pricing, compatibility, compliance, and more. Think of me as your personal InstaLabel guide!",
  },

  // 1. Product Overview & Features
  {
    keywords: ["what is instalabel", "what does instalabel do", "how does instalabel work"],
    answer:
      "InstaLabel is a professional kitchen labeling system designed for restaurants, cafés, food trucks, and catering businesses. It lets you print food safety labels—prep, cook, use‑first, PPDS—instantly from any device without handwriting, fully compliant with regulations like Natasha's Law. Our system includes a web-based dashboard for managing ingredients, menu items, and labels, with built-in expiry date logic and allergen tracking.",
  },
  {
    keywords: [
      "label types",
      "which label types",
      "supported labels",
      "prep labels",
      "cook labels",
      "ppds",
      "ingredients",
      "defrost",
      "label",
      "labels",
    ],
    answer:
      "InstaLabel supports 5 main label types with specific sizes: **Prep Labels** (60mm x 40mm for ingredients, allergens, prep times, expiry dates), **Cook Labels** (60mm x 40mm for cook times, temperatures, allergen info for service), **Defrost Labels** (60mm x 40mm for defrost dates and instructions), **PPDS Labels** (56mm x 80mm for full ingredient lists with allergen warnings for pre-packaged food), and **Use-First Labels** (60mm x 40mm for priority consumption order). Each label automatically includes allergen alerts, expiry dates, and storage instructions. You can order labels directly from the dashboard and we'll ship them to you!",
  },
  {
    keywords: [
      "allergens",
      "allergen handling",
      "how does instalabel handle allergens",
      "allergen tracking",
    ],
    answer:
      "InstaLabel has comprehensive allergen management at the ingredient level. All labels automatically highlight allergens with clear warnings, use FDA/EHO-approved templates, and include allergen icons and color coding. The system tracks allergens per ingredient and automatically shows them on relevant labels. For PPDS labels, allergens are prominently displayed with asterisks (*) next to ingredients containing them, ensuring full Natasha's Law compliance.",
  },
  {
    keywords: [
      "expiry dates",
      "shelf life",
      "food expiration",
      "tracking",
      "override expiry",
      "automatic expiry",
    ],
    answer:
      "InstaLabel automatically tracks expiry dates for all your food items with built-in logic per label type. You can set custom shelf life rules, get alerts for items approaching expiration, and print labels with clear expiry information. The system includes configurable expiry days for different label types (e.g., PPDS labels default to 2 days). You can also override expiry logic when needed while keeping full logging for traceability and audit purposes.",
  },
  {
    keywords: [
      "bulk printing",
      "multiple labels",
      "print queue",
      "spooler",
      "batch printing",
      "print many",
      "print multiple",
      "queue printing",
      "bulk print",
      "print bulk",
      "multiple print",
      "bulk labels",
      "print queue system",
      "batch labels",
      "bulk printing feature",
      "bulk print system",
      "print queue feature",
      "do you support bulk printing",
      "bulk printing support",
      "bulk printing capability",
      "bulkprint",
      "bulkprintfeature",
    ],
    answer:
      "BULK PRINTING FEATURE: InstaLabel includes a powerful bulk printing system with a print queue and spooler. You can add multiple items to your print queue, set quantities for each item, and print them all at once. The system supports bulk printing for any label type - you can print 10 prep labels, 5 cook labels, and 20 PPDS labels in one session. The print queue shows all pending items with their quantities, and you can clear or modify the queue before printing. This is perfect for busy prep times when you need to label multiple items quickly.",
  },
  {
    keywords: [
      "mobile printing",
      "mobile devices",
      "android",
      "print from mobile",
      "phone printing",
      "tablet printing",
      "mobile app printing",
      "mobile label printing",
      "android app printing",
      "mobile printing support",
      "mobile printing capability",
    ],
    answer:
      "Yes! InstaLabel supports mobile printing through our Android app, designed for mobile devices with thermal printers. The mobile app provides the same labeling capabilities as the web dashboard, allowing you to print labels from anywhere in your kitchen or on the go.",
  },
  {
    keywords: ["customizable", "templates", "branding", "business name", "label customization"],
    answer:
      "Yes, InstaLabel labels are highly customizable! You can set your business name, customize storage information, and adjust label heights (40mm or 80mm). The system supports different font sizes and layouts for different label types. While the core templates are FDA/EHO-approved for compliance, you can personalize business information, storage instructions, and other details. The system also supports custom initials for staff identification and flexible expiry date configurations.",
  },

  // 2. Printers & Hardware
  {
    keywords: [
      "printers",
      "supported printers",
      "thermal printer",
      "usb",
      "bluetooth",
      "hardware compatibility",
    ],
    answer:
      "InstaLabel supports multiple printing methods: **USB thermal printers** for desktop use, **Bluetooth thermal printers** for mobile use, and **mobile devices** with thermal printing capabilities. We have native mobile support - no additional hardware needed. For USB/Bluetooth printing, we use PrintBridge technology that works on both Windows (.NET) and macOS (Node.js). Any thermal printer commonly used in commercial kitchens will work.",
  },
  {
    keywords: ["special hardware", "equipment needed", "what equipment", "hardware requirements"],
    answer:
      "You don't need any special hardware! InstaLabel works with standard thermal label printers that most commercial kitchens already have. For web printing, just plug in any USB thermal printer. For mobile printing, use our Android app on mobile devices (which have thermal printing capabilities). For Bluetooth printing, any TSPL compliant thermal printer will work. The system automatically detects and connects to available printers. No expensive proprietary hardware required.",
  },
  {
    keywords: ["existing printer", "current printer", "use my printer", "printer compatibility"],
    answer:
      "Yes, you can absolutely use your existing printer! InstaLabel is designed to work with the thermal printers you already have in your kitchen. As long as your printer is TSPL compliant (which most commercial thermal printers are), it will work seamlessly. The system automatically detects USB, Bluetooth, and network-connected printers. If you're upgrading from handwritten labels or a basic labeling system, you can continue using your current printer while getting all the benefits of InstaLabel's smart labeling features.",
  },

  {
    keywords: ["printer guide", "connecting printer", "setup guide", "printer connection"],
    answer:
      "To connect a printer, simply plug it in via USB or connect via Bluetooth, then select the printer in the dashboard. For mobile devices, the printer is built-in and ready to use. We provide comprehensive setup guides and documentation. The system includes automatic printer detection, connection status monitoring, and troubleshooting tools.",
  },
  {
    keywords: [
      "which devices",
      "supported devices",
      "device support",
      "what devices",
      "compatible devices",
      "devices supported",
      "hardware support",
      "device compatibility",
    ],
    answer:
      "Yes! We have a dedicated Android app optimized for mobile devices with thermal printing capabilities, perfect for mobile kitchens and food trucks. For other Android devices, you can access the web dashboard and print through compatible Bluetooth thermal printers.",
  },

  // 3. Compliance & Safety
  {
    keywords: [
      "natasha's law",
      "natasha law",
      "ppds compliance",
      "how does instalabel help with natasha's law",
    ],
    answer:
      "InstaLabel is specifically designed for Natasha's Law compliance. Our PPDS (Prepacked for Direct Sale) labels automatically include full ingredient lists with allergen warnings. Each ingredient is checked against your allergen database, and allergens are prominently highlighted with asterisks (*) and clear warnings. The system uses FDA/EHO-approved templates and generates complete print logs for easy audits. All labels include auto-calculated prep dates and expiry, ensuring full compliance with food safety regulations.",
  },
  {
    keywords: ["allergen accuracy", "how does it ensure allergen accuracy", "allergen compliance"],
    answer:
      "InstaLabel ensures allergen accuracy through a comprehensive ingredient-level tracking system. Each ingredient in your database has its allergens clearly defined. When creating labels, the system automatically cross-references ingredients with your allergen database and highlights any allergens present. For PPDS labels, allergens are shown both inline with ingredients and in a dedicated allergen summary box. The system prevents human error by automatically calculating allergen content rather than relying on manual entry for each label.",
  },
  {
    keywords: [
      "food safety standards",
      "haccp",
      "food safety compliance",
      "regulations",
      "standards",
    ],
    answer:
      "InstaLabel is designed with HACCP principles in mind and helps maintain food safety compliance. Our labeling system creates a complete audit trail, tracks food safety procedures, and ensures all regulatory requirements are met. Features include automatic expiry date tracking, allergen management, prep date logging, and comprehensive print logs. The system generates complete documentation for food safety audits and helps maintain consistent labeling standards across your kitchen operations.",
  },

  // 4. Support & Onboarding
  {
    keywords: ["trial", "free trial", "demo", "book demo", "available trial"],
    answer:
      "Yes! InstaLabel offers a free 14-day trial with no credit card required. You get full access to all features and existing printer support during the trial. We also offer personalized demos where our team shows you exactly how InstaLabel works in your kitchen. You can book a demo through our website, and our team will walk you through the setup process, demonstrate key features, and answer any questions you have about implementation.",
  },
  {
    keywords: ["request demo", "consultation", "demo consultation", "setup help"],
    answer:
      "Absolutely! You can request a personalized demo or consultation through our website. Our team will schedule a convenient time to show you InstaLabel in action, discuss your specific kitchen needs, and provide setup guidance. We offer both online demos and on-site consultations for larger operations. During the consultation, we'll assess your current labeling process, recommend the best setup for your kitchen, and help you plan the transition to InstaLabel.",
  },
  {
    keywords: ["contact support", "support", "help", "customer service", "technical support"],
    answer:
      "I'm not sure about that specific question, but I'd be happy to help you get in touch with our team for more detailed assistance!",
  },
  {
    keywords: ["guides", "videos", "tutorials", "documentation", "help resources"],
    answer:
      "Yes! InstaLabel provides extensive learning resources including step-by-step setup guides, video tutorials, comprehensive documentation, and best practice guides. Our resources cover everything from initial setup and printer connection to advanced features like bulk printing and allergen management. We also offer webinars and training sessions for teams. All documentation is regularly updated to reflect the latest features and compliance requirements.",
  },

  // 5. Miscellaneous / Unique Selling Points
  {
    keywords: ["save time", "kitchen staff", "efficiency", "time savings", "workflow"],
    answer:
      "InstaLabel significantly saves time for your kitchen staff! Restaurants typically save 15+ hours per week on labeling tasks. The system eliminates handwriting, automatically calculates expiry dates, and provides bulk printing capabilities. Staff can print multiple labels in seconds instead of manually writing each one. The intuitive interface reduces training time, and the automated allergen tracking prevents time-consuming errors. This efficiency improvement typically pays for itself within the first month of use.",
  },

  {
    keywords: ["setup", "installation", "how to start", "getting started", "how fast is setup"],
    answer:
      "You can get started in minutes: upload your menu or ingredient list, plug in your printer, select the label type, and print—no drivers or plugins needed. You can import your menu items and ingredients by uploading an Excel file formatted properly, or even import directly by integrating with Square POS. After signing up, you can set up your thermal printer and start printing labels within minutes.",
  },
  {
    keywords: [
      "pos integration",
      "systems integration",
      "existing systems",
      "work with current systems",
    ],
    answer:
      "InstaLabel is designed to work alongside your existing systems. You can import your menu items and ingredients by uploading an Excel file formatted properly, or even import directly by integrating with Square POS. We're actively developing additional POS integrations and multi-system connectivity. The system is built with open APIs and can export data for use in other systems. For now, you can manually import your menu items and ingredients, which typically takes just a few minutes.",
  },
  {
    keywords: [
      "kitchen sizes",
      "small kitchen",
      "medium kitchen",
      "large kitchen",
      "restaurant size",
    ],
    answer:
      "InstaLabel is perfect for kitchens of all sizes! Small kitchens (1-10 staff) benefit from the simple setup and cost-effective pricing. Medium kitchens (10-50 staff) appreciate the bulk printing and workflow efficiency features. Large kitchens (50+ staff) benefit from the compliance features, audit trails, and scalable architecture. Whether you're a small café, medium restaurant, or large catering operation, InstaLabel adapts to your needs and grows with your business.",
  },

  // Pricing and plans
  {
    keywords: ["pricing", "cost", "how much", "plans", "subscription"],
    answer:
      "InstaLabel offers flexible pricing plans starting with a free trial. Our plans are designed to scale with your business needs, from small cafes to large restaurant chains. Visit our plans page for detailed pricing information or book a demo to see which plan fits your business best.",
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
  { text: "Label Types & Features", keywords: ["label types", "prep labels"] },
  { text: "Allergen Management", keywords: ["allergens", "allergen handling"] },
  { text: "Printer Compatibility", keywords: ["printers", "hardware compatibility"] },
  { text: "Mobile Printing", keywords: ["mobile printing", "mobile devices"] },
  { text: "Natasha's Law Compliance", keywords: ["natasha's law", "ppds compliance"] },
  { text: "Free Trial & Demo", keywords: ["trial", "demo"] },
  { text: "Setup & Onboarding", keywords: ["setup", "get started"] },
  { text: "Support & Contact", keywords: ["support", "contact"] },
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
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const currentMessageRef = useRef(0)

  // Array of avatar images (including avatar1 for regular rotation)
  const avatarImages = [
    "/avatar1.png",
    "/avatar2.png",
    "/avatar3.png",
    "/avatar4.png",
    "/avatar5.png",
    "/avatar6.png",
    "/avatar7.png",
    "/avatar8.png",
    "/avatar9.png",
    "/avatar10.png",
  ]

  // Multiple messages for each avatar (One Piece characters)
  const avatarMessages = [
    // 🏴‍☠️ Luffy (Energetic / Cheerful)
    [
      "Hey there! Need a hand? 🏴‍☠️",
      "Let’s get this done quickly! 🏴‍☠️",
      "Hi! What can I help you with today? 🏴‍☠️",
      "Got a question? I’ve got answers! 🏴‍☠️",
      "Let’s make this simple for you! 🏴‍☠️",
    ],
    // ⚔️ Zoro (Calm / Straightforward)
    [
      "What do you need? ⚔️",
      "Tell me directly—I’ll help. ⚔️",
      "Let’s keep it clear and quick. ⚔️",
      "Need something solved? ⚔️",
      "I’ll get you where you need to go. ⚔️",
    ],
    // 🗺️ Nami (Friendly / Guiding)
    [
      "Hi there! I’ll guide you through. 🗺️",
      "Looking for something? I’ll help you find it. 🗺️",
      "Let’s chart the best path for you. 🗺️",
      "What can I walk you through today? 🗺️",
      "I’ll make this easy to follow. 🗺️",
    ],
    // 🎯 Usopp (Confident / Playful)
    [
      "You’re in the right place—I’ve got this! 🎯",
      "Don’t worry, I can handle it. 🎯",
      "Need something? I’ll take care of it. 🎯",
      "Stick with me, and you’ll be sorted in no time. 🎯",
      "Ready to solve your problem? Let’s go! 🎯",
    ],
    // 🍳 Sanji (Polite / Courteous)
    [
      "Welcome! How may I assist you today? 🍳",
      "It’s my pleasure to help—what do you need? 🍳",
      "I’m here to make this easy for you. 🍳",
      "Tell me what you’re looking for—I’ll handle the rest. 🍳",
      "Happy to assist anytime! 🍳",
    ],
    // 🩺 Chopper (Kind / Supportive)
    [
      "Hi! I’ll do my best to help you. 🩺",
      "No worries, we’ll figure this out together. 🩺",
      "What do you need? I’ll take care of it. 🩺",
      "You’re safe here—just ask! 🩺",
      "Let’s solve this step by step. 🩺",
    ],
    // 📜 Robin (Calm / Knowledgeable)
    [
      "Hello. What information do you need? 📜",
      "I’ll find the right answer for you. 📜",
      "Let’s uncover the solution together. 📜",
      "Every question has an answer—let’s find yours. 📜",
      "Good day. What can I clarify for you? 📜",
    ],
    // 🔧 Franky (Energetic / Problem-solver)
    [
      "Need a fix? I’m on it! 🔧",
      "Let’s solve this—fast and smooth! 🔧",
      "Leave it to me, I’ll handle it! 🔧",
      "What’s the issue? I’ll patch it up right away! 🔧",
      "Time for a quick solution—let’s go! 🔧",
    ],
    // 🎻 Brook (Quirky / Lighthearted)
    [
      "Hello! How may I help you today? 🎻",
      "Need help? I’ll do my best! 🎻",
      "Hi there, let’s get things sorted out. 🎻",
      "I’m always happy to lend a hand! 🎻",
      "Let’s turn your question into a smooth answer. 🎻",
    ],
    // 🌊 Jinbe (Respectful / Reassuring)
    [
      "Greetings. What can I do for you today? 🌊",
      "Calmly now—tell me what you need. 🌊",
      "I’ll guide you through this. 🌊",
      "Let’s take it step by step together. 🌊",
      "The solution is close. How may I help? 🌊",
    ],
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set random initial avatar on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * avatarImages.length)
    setCurrentAvatarIndex(randomIndex)
  }, [])

  // Animate speech bubble with typing effect and avatar cycling
  useEffect(() => {
    if (!isOpen) {
      let intervalId: NodeJS.Timeout
      let typeIntervalId: NodeJS.Timeout

      const startAnimation = () => {
        setShowSpeechBubble(true)
        setTypedText("")

        // Use random message from current avatar's message array
        const characterMessages = avatarMessages[currentAvatarIndex]
        const text = characterMessages[Math.floor(Math.random() * characterMessages.length)]
        let currentIndex = 0

        // Clear any existing typing interval
        if (typeIntervalId) {
          clearInterval(typeIntervalId)
        }

        typeIntervalId = setInterval(() => {
          if (currentIndex < text.length) {
            setTypedText(text.slice(0, currentIndex + 1))
            currentIndex++
          } else {
            clearInterval(typeIntervalId)
            // Keep text visible for a bit, then hide
            setTimeout(() => {
              setShowSpeechBubble(false)
              setTypedText("")
            }, 3000)
          }
        }, 50) // Faster typing - 50ms per character
      }

      // Start first animation immediately
      startAnimation()

      // Set up recurring animation for regular avatars - this should run indefinitely
      intervalId = setInterval(() => {
        startAnimation()
      }, 10000) // Show every 10 seconds

      // Cleanup function to prevent multiple intervals
      return () => {
        if (intervalId) clearInterval(intervalId)
        if (typeIntervalId) clearInterval(typeIntervalId)
      }
    } else {
      // When chat is open, clear all intervals
      setShowSpeechBubble(false)
      setTypedText("")
    }
  }, [isOpen, currentAvatarIndex]) // Include currentAvatarIndex to update message when avatar changes

  // Backup mechanism to ensure regular avatar keeps cycling
  useEffect(() => {
    if (!isOpen) {
      const backupInterval = setInterval(() => {
        // Only trigger if no speech bubble is currently showing
        if (!showSpeechBubble) {
          setShowSpeechBubble(true)
          setTypedText("")

          const characterMessages = avatarMessages[currentAvatarIndex]
          const text = characterMessages[Math.floor(Math.random() * characterMessages.length)]
          let currentIndex = 0

          const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
              setTypedText(text.slice(0, currentIndex + 1))
              currentIndex++
            } else {
              clearInterval(typeInterval)
              setTimeout(() => {
                setShowSpeechBubble(false)
                setTypedText("")
              }, 3000)
            }
          }, 50)
        }
      }, 15000) // Check every 15 seconds

      return () => clearInterval(backupInterval)
    }
  }, [isOpen, showSpeechBubble, currentAvatarIndex])

  const findAnswer = (question: string): string => {
    // Normalize the input
    const normalized = question
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim()

    // Simple tokenization
    const tokens = normalized.split(/\s+/)

    // Find all matching answers with improved scoring
    const matchingAnswers = knowledgeBase
      .map((item) => {
        let score = 0

        // Check for exact phrase matches first (highest priority)
        const exactPhraseMatch = item.keywords.some((keyword) =>
          normalized.includes(keyword.toLowerCase().replace(/[^\w\s]/gi, ""))
        )
        if (exactPhraseMatch) {
          score += 10 // High score for exact phrase match
        }

        // Then check individual keyword matches
        const keywordScore = item.keywords.reduce((totalScore, keyword) => {
          const keywordTokens = keyword
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .split(/\s+/)
          const matchScore = keywordTokens.reduce((score, token) => {
            if (tokens.includes(token)) {
              return score + 1
            }
            // Check for partial matches only for longer tokens and only if no exact match
            if (token.length > 3 && !exactPhraseMatch) {
              const partialMatch = tokens.some((t) => t.includes(token) || token.includes(t))
              return partialMatch ? score + 0.3 : score
            }
            return score
          }, 0)
          return totalScore + matchScore
        }, 0)

        score += keywordScore

        return { ...item, score }
      })
      .filter((item) => item.score >= 0.5) // Minimum score threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, 2) // Only take top 2 matches
      .map((item) => item.answer)

    // If multiple matches, combine them intelligently
    if (matchingAnswers.length > 1) {
      return combineAnswers(matchingAnswers)
    }

    return matchingAnswers[0] || ""
  }

  // Combine multiple answers intelligently
  const combineAnswers = (answers: string[]): string => {
    if (answers.length === 0) return ""
    if (answers.length === 1) return answers[0]

    // Remove duplicates and combine
    const uniqueAnswers = [...new Set(answers)]

    if (uniqueAnswers.length === 1) return uniqueAnswers[0]

    // Only combine if answers are significantly different (not just greetings)
    const isGreetingAnswer = (answer: string) => {
      const greetingKeywords = [
        "hello",
        "hi",
        "hey",
        "how are you",
        "what's up",
        "thanks",
        "goodbye",
      ]
      return greetingKeywords.some((keyword) => answer.toLowerCase().includes(keyword))
    }

    const greetingAnswers = uniqueAnswers.filter(isGreetingAnswer)
    const nonGreetingAnswers = uniqueAnswers.filter((answer) => !isGreetingAnswer(answer))

    // If we have both greeting and non-greeting answers, prefer the non-greeting
    if (nonGreetingAnswers.length > 0) {
      return nonGreetingAnswers[0]
    }

    // If only greeting answers, return the first one
    if (greetingAnswers.length > 0) {
      return greetingAnswers[0]
    }

    // Fallback: combine with a separator
    return uniqueAnswers.join("\n\nAdditionally, ")
  }

  // Get contextual follow-up options based on current topic
  const getContextualOptions = (question: string): typeof helpOptions => {
    const normalized = question
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim()

    // Define topic relationships
    const topicRelations = {
      allergen: ["Label Types & Features", "Natasha's Law Compliance", "Compliance & Safety"],
      printer: ["Mobile Printing", "Technical Setup", "Hardware Compatibility"],
      label: ["Allergen Management", "Bulk Printing", "Label Types & Features"],
      compliance: ["Natasha's Law Compliance", "Allergen Management", "Food Safety Standards"],
      mobile: ["Mobile Printing", "Technical Setup", "Printer Compatibility"],
      setup: ["Technical Setup", "Printer Compatibility", "Getting Started"],
      pricing: ["Free Trial & Demo", "Plans & Pricing", "Contact Support"],
      trial: ["Free Trial & Demo", "Setup & Onboarding", "Contact Support"],
    }

    // Find related topics
    let relatedTopics: string[] = []
    for (const [topic, related] of Object.entries(topicRelations)) {
      if (normalized.includes(topic)) {
        relatedTopics = [...relatedTopics, ...related]
      }
    }

    // Get all options and prioritize related ones
    const allOptions = getDynamicOptions()
    const relatedOptions = allOptions.filter((option) =>
      relatedTopics.some((topic) => option.text.includes(topic))
    )
    const otherOptions = allOptions.filter(
      (option) => !relatedTopics.some((topic) => option.text.includes(topic))
    )

    // Return related options first, then others
    return [...relatedOptions, ...otherOptions].slice(0, 6)
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

  // Reusable function to send bot messages
  const sendBotMessage = (
    text: string,
    showOptions = true,
    showContactForm = false,
    contextualOptions?: typeof helpOptions
  ) => {
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text,
      isUser: false,
      timestamp: new Date(),
      showOptions,
      showContactForm,
    }
    setMessages((prev) => [...prev, botMessage])
  }

  // Improved message handling with better context
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
      const isUnknown = !answer
      const isSupportQuestion =
        (inputValue.toLowerCase().includes("contact") ||
          inputValue.toLowerCase().includes("support") ||
          inputValue.toLowerCase().includes("help") ||
          inputValue.toLowerCase().includes("customer service")) &&
        !answer // Only treat as support question if no answer found

      if (answer) {
        // Get contextual options based on the question
        const contextualOptions = getContextualOptions(inputValue)
        sendBotMessage(answer, true, false)

        // Update the last message with contextual options
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage && !lastMessage.isUser) {
            lastMessage.contextualOptions = contextualOptions
          }
          return newMessages
        })
      } else if (isSupportQuestion) {
        // Support question - show only contact form without the "I'm not sure" text
        sendBotMessage("", false, true)
      } else {
        // Unknown question - show contact form with explanation
        sendBotMessage(
          "I'm not sure about that specific question, but I'd be happy to help you get in touch with our team for more detailed assistance!",
          false,
          true
        )
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
      const isSupportOption =
        option.text.toLowerCase().includes("contact") ||
        option.text.toLowerCase().includes("support")

      if (answer && !isSupportOption) {
        // Get contextual options based on the option clicked
        const contextualOptions = getContextualOptions(option.text)
        sendBotMessage(answer, true, false)

        // Update the last message with contextual options
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage && !lastMessage.isUser) {
            lastMessage.contextualOptions = contextualOptions
          }
          return newMessages
        })
      } else if (isSupportOption) {
        // Support option - show only contact form without the "I'm not sure" text
        sendBotMessage("", false, true)
      } else {
        // Fallback for unknown questions - show contact form with explanation
        sendBotMessage(
          "I'm not sure about that specific question, but I'd be happy to help you get in touch with our team for more detailed assistance!",
          false,
          true
        )
      }
      setIsTyping(false)
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const dynamicOptions = getDynamicOptions()

  return (
    <div className={`fixed bottom-20 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button with avatar1 and animated speech bubbles */}
      <div
        className={`transition-all duration-300 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <div className="relative">
          <Button
            onClick={toggleChat}
            className="h-16 w-16 rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-110"
            size="icon"
          >
            <Image
              src={avatarImages[currentAvatarIndex]}
              alt="InstaLabel Assistant"
              width={48}
              height={48}
              className="rounded-full"
            />
          </Button>

          {/* Animated speech bubbles */}
          <div className="absolute -left-52 top-2">
            {/* Regular avatar speech bubble */}
            <div
              className={`absolute z-10 transition-all duration-500 ${showSpeechBubble ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
            >
              <div className="min-w-[200px] max-w-[320px] rounded-lg border border-white/20 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 shadow-lg">
                <div className="text-sm font-medium leading-relaxed text-white">
                  {typedText}
                  {showSpeechBubble && typedText.length < 50 && (
                    <span className="animate-pulse">|</span>
                  )}
                </div>
                {/* Speech bubble arrow pointing right to the button */}
                <div className="absolute -right-2 top-3 h-0 w-0 border-b-4 border-l-4 border-t-4 border-transparent border-l-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
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
                  src={avatarImages[currentAvatarIndex]}
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
