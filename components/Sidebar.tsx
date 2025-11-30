'use client'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  recentChats?: string[]
}

export default function Sidebar({ isOpen, onClose, recentChats = [] }: SidebarProps) {

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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Menu
              </h2>
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
                className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1 mb-6">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-left">
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
            </div>

            {/* Recent Chats */}
            {recentChats.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-2 px-3" style={{ fontFamily: "'DM Sans', sans-serif", color: '#000000', fontWeight: 600 }}>
                  Recent
                </h3>
                <div className="space-y-1">
                  {recentChats.slice(0, 10).map((chat, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-gray-700 text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {chat}
                      </p>
                    </button>
                  ))}
                </div>
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

