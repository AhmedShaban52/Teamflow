"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface ThredContextType {
    selectedThredId: string | null,
    openThread: (messageId: string) => void,
    closeThred: () => void,
    toggleThread: (messageId: string) => void,
    isThreadOpen: boolean
}

const ThredContext = createContext<ThredContextType | undefined>(undefined)


export function ThreadProvider({ children }: { children: ReactNode }) {
    const [selectedThredId, setSelectedThredId] = useState<string | null>(null)
    const [isThreadOpen, setIsThreadOpen] = useState(false)

    const openThread = (messageId: string) => {
        setSelectedThredId(messageId)
        setIsThreadOpen(true)
    }

    const closeThred = () => {
        setSelectedThredId(null)
        setIsThreadOpen(false)
    }

    const toggleThread = (messageId: string) => {
        if (selectedThredId === messageId && isThreadOpen) {
            closeThred()
        } else {
            openThread(messageId)
        }
    }

    const value: ThredContextType = {
        selectedThredId,
        openThread,
        closeThred,
        toggleThread,
        isThreadOpen
    }
    return (
        <ThredContext.Provider value={value}>
            {children}
        </ThredContext.Provider>
    )
}

export function useThread() {
    const context = useContext(ThredContext)

    if (context === undefined) {
        throw new Error("useThread must be used within a ThreadProvider")
    }

    return context
}