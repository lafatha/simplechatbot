'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import Sidebar from '@/components/Sidebar'

interface Message {
  id: string
  text: string
  isUser: boolean
  imageUrl?: string
}

interface ChatTopic {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [recentChats, setRecentChats] = useState<ChatTopic[]>([])
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load recent topics from localStorage on mount
  useEffect(() => {
    const savedTopics = localStorage.getItem('chatTopics')
    if (savedTopics) {
      try {
        const topics: ChatTopic[] = JSON.parse(savedTopics)
        setRecentChats(topics)
      } catch (e) {
        console.error('Error loading chat topics:', e)
      }
    }
  }, [])

  // Save current topic when messages change
  useEffect(() => {
    if (messages.length > 0 && currentTopicId) {
      const userMessages = messages.filter(m => m.isUser)
      if (userMessages.length > 0) {
        // Get title from first user message
        const firstMessage = userMessages[0].text
        const title = firstMessage.split('\n')[0]
        const finalTitle = title.length > 50 ? title.substring(0, 50) + '...' : title

        // Update or create topic using functional update
        setRecentChats(prevTopics => {
          const updatedTopics = [...prevTopics]
          const topicIndex = updatedTopics.findIndex(t => t.id === currentTopicId)
          
          const topic: ChatTopic = {
            id: currentTopicId,
            title: finalTitle,
            messages: messages,
            createdAt: topicIndex >= 0 ? updatedTopics[topicIndex].createdAt : Date.now()
          }

          if (topicIndex >= 0) {
            updatedTopics[topicIndex] = topic
          } else {
            updatedTopics.unshift(topic)
          }

          // Keep only last 20 topics
          const sortedTopics = updatedTopics.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20)
          localStorage.setItem('chatTopics', JSON.stringify(sortedTopics))
          return sortedTopics
        })
      }
    }
  }, [messages, currentTopicId])

  const handleResetChat = () => {
    if (confirm('Apakah Anda yakin ingin mereset percakapan?')) {
      setMessages([])
      setIsLoading(false)
      setCurrentTopicId(null)
    }
  }

  const handleNewChat = () => {
    // Save current topic before creating new one
    if (messages.length > 0 && currentTopicId) {
      const userMessages = messages.filter(m => m.isUser)
      if (userMessages.length > 0) {
        const firstMessage = userMessages[0].text
        const title = firstMessage.split('\n')[0]
        const finalTitle = title.length > 50 ? title.substring(0, 50) + '...' : title

        const updatedTopics = [...recentChats]
        const topicIndex = updatedTopics.findIndex(t => t.id === currentTopicId)
        
        const topic: ChatTopic = {
          id: currentTopicId,
          title: finalTitle,
          messages: messages,
          createdAt: topicIndex >= 0 ? updatedTopics[topicIndex].createdAt : Date.now()
        }

        if (topicIndex >= 0) {
          updatedTopics[topicIndex] = topic
        } else {
          updatedTopics.unshift(topic)
        }

        const sortedTopics = updatedTopics.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20)
        setRecentChats(sortedTopics)
        localStorage.setItem('chatTopics', JSON.stringify(sortedTopics))
      }
    }

    // Create new topic
    const newTopicId = `topic-${Date.now()}`
    setCurrentTopicId(newTopicId)
    setMessages([])
    setIsLoading(false)
    setIsSidebarOpen(false)
  }

  const handleLoadTopic = (topicId: string) => {
    const topic = recentChats.find(t => t.id === topicId)
    if (topic) {
      setCurrentTopicId(topic.id)
      setMessages(topic.messages)
      setIsSidebarOpen(false)
    }
  }

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus topik ini?')) {
      // Remove topic from state
      const updatedTopics = recentChats.filter(t => t.id !== topicId)
      setRecentChats(updatedTopics)
      localStorage.setItem('chatTopics', JSON.stringify(updatedTopics))

      // If deleted topic is current topic, clear messages
      if (currentTopicId === topicId) {
        setMessages([])
        setCurrentTopicId(null)
      }
    }
  }

  const handleDashboard = () => {
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  const handleSendMessage = async (messageText: string, file?: File) => {
    let displayText = messageText
    let imageUrl: string | undefined

    // Buat history percakapan untuk dikirim ke server (memory per sesi)
    const history = messages
      .map((m) => `${m.isUser ? 'User' : 'ChatBot AI'}: ${m.text}`)
      .join('\n')

    // Jika ada file, JANGAN tampilkan info file di bubble chat (hanya gambar preview)
    if (file) {
      const isImage = file.type.startsWith('image/')
      
      // Jika file adalah gambar, buat preview kecil
      if (isImage) {
        imageUrl = URL.createObjectURL(file)
      }
    }

    // Create topic ID if not exists
    if (!currentTopicId) {
      const newTopicId = `topic-${Date.now()}`
      setCurrentTopicId(newTopicId)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: displayText,
      isUser: true,
      imageUrl,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Jika ada file, kirim sebagai FormData
      let body: FormData | string
      let headers: HeadersInit

      if (file) {
        const formData = new FormData()
        formData.append('message', messageText || '')
        formData.append('history', history)
        formData.append('file', file)

        body = formData
        headers = {} // Don't set Content-Type, browser akan set dengan boundary
      } else {
        body = JSON.stringify({ message: messageText, history })
        headers = {
          'Content-Type': 'application/json',
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body,
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.details || data.error || 'Failed to get response')
      }

      if (!data.response) {
        throw new Error('No response from server')
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error: any) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error?.message?.includes('API') 
          ? `Error: ${error.message}` 
          : 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        isUser: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
        recentChats={recentChats}
        onNewChat={handleNewChat}
        onLoadTopic={handleLoadTopic}
        onDeleteTopic={handleDeleteTopic}
      />
      <div className="flex flex-col w-full max-w-[720px] md:max-w-[900px] min-h-screen relative px-4 md:px-8">
        {/* Top navbar - terkunci di atas (sticky) */}
        <div className="sticky top-0 z-10 flex justify-between pt-[25px] pb-3 bg-white px-4">
          <button
            onClick={handleDashboard}
            className="w-[36px] h-[36px] flex items-center justify-center bg-transparent border-none cursor-pointer"
            aria-label="Dashboard"
          >
            <img src="/icons/menu.svg" alt="Menu" width={20} height={20} />
          </button>
          <button
            onClick={handleResetChat}
            className="w-[36px] h-[36px] flex items-center justify-center bg-transparent border-none cursor-pointer"
            aria-label="Reset Chat"
          >
            <img src="/icons/rotate-left.svg" alt="Reset" width={20} height={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-24 md:pb-28">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#979c9e] text-[12px] font-normal" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Mulai percakapan dengan mengetik pesan...
              </p>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  imageUrl={message.imageUrl}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4 pl-4">
                  <div className="max-w-[219px] min-h-[46px] px-4 py-3 border-[1.5px] border-[#979c9e] rounded-bl-[18px] rounded-br-[18px] rounded-tl-[18px] bg-white flex items-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#979c9e] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#979c9e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-[#979c9e] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* Bottom navbar-style chat input: selalu terlihat, naik saat keyboard muncul */}
        <div className="fixed inset-x-0 bottom-0">
          <div className="flex justify-center bg-transparent">
            <div className="w-full max-w-[720px] md:max-w-[900px] px-4 md:px-8 bg-transparent">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

