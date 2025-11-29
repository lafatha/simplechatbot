interface ChatMessageProps {
  message: string
  isUser: boolean
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      style={{ paddingLeft: isUser ? '0' : '16px', paddingRight: isUser ? '16px' : '0' }}
    >
      <div
        className={`max-w-[219px] min-h-[46px] px-4 py-3 border-[1.5px] border-[#979c9e] bg-white ${
          isUser
            ? 'rounded-bl-[18px] rounded-br-[18px] rounded-tr-[18px]'
            : 'rounded-bl-[18px] rounded-br-[18px] rounded-tl-[18px]'
        }`}
      >
        <p className="text-sm text-gray-800 break-words leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

