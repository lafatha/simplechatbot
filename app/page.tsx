'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'

interface Message {
  id: string
  text: string
  isUser: boolean
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText: string, file?: File) => {
    let displayText = messageText
    
    // Jika ada file, tambahkan info file ke pesan
    if (file) {
      const fileInfo = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      displayText = messageText ? `${messageText}\n${fileInfo}` : fileInfo
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: displayText,
      isUser: true,
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
    <div className="h-screen bg-white overflow-hidden flex justify-center">
      <div className="flex flex-col w-[390px] h-full relative">
        <div className="flex-1 overflow-y-auto pb-32 pt-4">
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
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

