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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [recentChats, setRecentChats] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load recent chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('recentChats')
    if (savedChats) {
      try {
        setRecentChats(JSON.parse(savedChats))
      } catch (e) {
        console.error('Error loading recent chats:', e)
      }
    }
  }, [])

  // Update recent chats when user sends a message
  useEffect(() => {
    const userMessages = messages.filter(m => m.isUser)
    if (userMessages.length > 0) {
      const chatTitles = userMessages
        .map(m => {
          // Extract first line or first 50 characters as title
          const firstLine = m.text.split('\n')[0]
          return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
        })
        .filter((title, index, self) => self.indexOf(title) === index) // Remove duplicates
        .slice(-10) // Keep only last 10
      
      setRecentChats(chatTitles)
      localStorage.setItem('recentChats', JSON.stringify(chatTitles))
    }
  }, [messages])

  const handleResetChat = () => {
    if (confirm('Apakah Anda yakin ingin mereset percakapan?')) {
      setMessages([])
      setIsLoading(false)
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
    
    // Jika ada file, tambahkan info file ke pesan
    if (file) {
      const fileInfo = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      displayText = messageText ? `${messageText}\n${fileInfo}` : fileInfo

      // Jika file adalah gambar, buat preview kecil
      if (file.type.startsWith('image/')) {
        imageUrl = URL.createObjectURL(file)
      }
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
        formData.append('file', file)
        
        body = formData
        headers = {} // Don't set Content-Type, browser will set it with boundary
      } else {
        body = JSON.stringify({ message: messageText })
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
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} recentChats={recentChats} />
      <div className="flex flex-col w-full max-w-[720px] md:max-w-[900px] min-h-screen relative px-4 md:px-8">
        {/* Top navbar - terkunci di atas (sticky) */}
        <div className="sticky top-0 z-10 flex justify-between pt-[25px] pb-3 bg-white px-4">
          <button
            onClick={handleDashboard}
            className="w-[36px] h-[36px] rounded-[20px] border-[1.5px] border-[#979c9e] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Dashboard"
          >
            <img src="/icons/menu.svg" alt="Menu" width={20} height={20} />
          </button>
          <button
            onClick={handleResetChat}
            className="w-[36px] h-[36px] rounded-[20px] border-[1.5px] border-[#979c9e] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
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

