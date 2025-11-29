'use client'

import { useState, useRef } from 'react'
import SendIcon from './icons/SendIcon'
import FolderIcon from './icons/FolderIcon'

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void
  isLoading?: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Optionally auto-send file or show file name
      console.log('File selected:', file.name, file.type, file.size)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    if ((message.trim() || selectedFile) && !isLoading) {
      onSendMessage(message.trim(), selectedFile || undefined)
      setMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    if ((message.trim() || selectedFile) && !isLoading) {
      onSendMessage(message.trim(), selectedFile || undefined)
      setMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ paddingBottom: '16px' }}>
      <div className="relative" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="*/*"
        />
        
        {/* File preview jika ada file yang dipilih */}
        {selectedFile && (
          <div className="mb-2 px-3 py-2 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FolderIcon className="w-[12px] h-[12px] flex-shrink-0" />
              <span className="text-[11px] text-[#979c9e] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {selectedFile.name}
              </span>
              <span className="text-[10px] text-[#979c9e] flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-[#979c9e] hover:text-gray-700 text-xs ml-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tanya sesuatu......."
            className="w-full h-[81px] rounded-[18px] border-[1.5px] border-[#979c9e] text-[12px] text-[#979c9e] font-normal focus:outline-none"
            style={{ 
              fontFamily: "'DM Sans', sans-serif",
              paddingLeft: '52px',
              paddingRight: '52px'
            }}
            disabled={isLoading}
          />
          {/* Folder button - di dalam input field, kiri sesuai Figma */}
          <button
            type="button"
            className="absolute w-[30px] h-[30px] rounded-[20px] border-[1.5px] border-[#979c9e] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            onClick={handleFileButtonClick}
          >
            <FolderIcon className="w-[10px] h-[10px]" />
          </button>
          {/* Send button - di dalam input field, kanan sesuai Figma */}
          <button
            type="button"
            disabled={isLoading || (!message.trim() && !selectedFile)}
            className="absolute w-[30px] h-[30px] rounded-[20px] border-[1.5px] border-[#979c9e] flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
            onClick={handleButtonClick}
          >
            <SendIcon className="w-[10px] h-[10px]" />
          </button>
        </form>
      </div>
    </div>
  )
}

