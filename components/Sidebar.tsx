'use client'

import { useState, useMemo, useEffect } from 'react'

interface ChatTopic {
  id: string
  title: string
  messages: any[]
  createdAt: number
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  recentChats?: ChatTopic[]
  onNewChat?: () => void
  onLoadTopic?: (topicId: string) => void
  onDeleteTopic?: (topicId: string) => void
}

export default function Sidebar({ isOpen, onClose, recentChats = [], onNewChat, onLoadTopic, onDeleteTopic }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Reset search query when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  // Filter recent chats based on search query
  const filteredRecentChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return recentChats
    }
    const query = searchQuery.toLowerCase().trim()
    return recentChats.filter(topic => 
      topic.title.toLowerCase().includes(query)
    )
  }, [recentChats, searchQuery])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1 mb-6">
              <button 
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                  <span className="text-black text-xs font-bold">C</span>
                </div>
                <span className="text-gray-900 text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  ChatBot
                </span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <img src="/icons/folder.svg" alt="Library" width={20} height={20} />
                <span className="text-gray-700 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Library
                </span>
              </button>

              <button 
                onClick={onNewChat}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-700 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  New Chat
                </span>
              </button>
            </div>

            {/* Recent Chats */}
            {filteredRecentChats.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-2 px-3" style={{ fontFamily: "'DM Sans', sans-serif", color: '#000000', fontWeight: 600 }}>
                  Recent
                </h3>
                <div className="space-y-1">
                  {filteredRecentChats.slice(0, 10).map((topic) => (
                    <div
                      key={topic.id}
                      className="group relative w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => onLoadTopic && onLoadTopic(topic.id)}
                        className="w-full text-left pr-8"
                      >
                        <p className="text-gray-700 text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {topic.title}
                        </p>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onDeleteTopic) {
                            onDeleteTopic(topic.id)
                          }
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                        aria-label="Delete chat"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11V17" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 11V17" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {searchQuery && filteredRecentChats.length === 0 && recentChats.length > 0 && (
              <div className="mb-6 px-3">
                <p className="text-gray-500 text-sm text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  No results found
                </p>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-700 text-xs font-semibold">G</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Gagah Athallah Fatha
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

