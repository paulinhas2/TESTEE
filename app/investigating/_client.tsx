"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Globe, BarChart, MessageCircle, Trash2, History, Clock, FileText, Volume2, Play } from "lucide-react"
import WhatsAppBackground from "@/components/whatsapp-background"
import { useSearchParams, useRouter } from "next/navigation"

interface InvestigationStep {
  id: number
  text: string
  icon: React.ElementType
  delay: number
  duration: number
}

const stepsData: InvestigationStep[] = [
  { id: 0, text: "Cruzando dados com o número fornecido...", icon: Globe, delay: 1000, duration: 19000 },
  { id: 1, text: "Gerando conversas arquivadas...", icon: MessageCircle, delay: 1000, duration: 20000 },
  { id: 2, text: "Recuperando conversas apagadas...", icon: Trash2, delay: 1000, duration: 20000 },
  { id: 3, text: "Compilando conversas antigas...", icon: History, delay: 1000, duration: 20000 },
  { id: 4, text: "Coletando conversas atuais...", icon: Clock, delay: 1000, duration: 20000 },
  { id: 5, text: "Compilando relatório completo da investigação...", icon: FileText, delay: 1000, duration: 19000 },
]

const totalSimulationDuration = 120_000 // 2 minutos exatos (120 segundos)

export default function InvestigatingClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const phoneParam = searchParams.get("phone") ?? "(XX) XXXXX-XXXX"
  const [phoneNumber] = useState<string>(phoneParam)

  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [showPlayButton, setShowPlayButton] = useState(true)

  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // Função para salvar o progresso no localStorage
  const saveProgress = useCallback(() => {
    if (progress < 100 && progress >= 0) {
      localStorage.setItem(
        "investigationProgress",
        JSON.stringify({
          progress: Math.round(progress * 100) / 100,
          currentStepIndex: currentStepIndex,
          phoneNumber: phoneNumber,
          totalSimulationDuration: totalSimulationDuration,
          timestamp: Date.now(),
        }),
      )
    }
  }, [progress, currentStepIndex, phoneNumber])

  // Efeito principal - INICIA AUTOMATICAMENTE
  useEffect(() => {
    if (typeof window === "undefined") return

    let initialElapsedTime = 0

    // Verificar se há progresso salvo
    const savedProgress = localStorage.getItem("investigationProgress")
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress)
        const isValid =
          data.phoneNumber === phoneNumber &&
          data.totalSimulationDuration === totalSimulationDuration &&
          Date.now() - data.timestamp < 600000 &&
          data.progress < 100

        if (isValid) {
          initialElapsedTime = (data.progress / 100) * totalSimulationDuration
          setCurrentStepIndex(data.currentStepIndex)
          setProgress(data.progress)
        } else {
          localStorage.removeItem("investigationProgress")
        }
      } catch {
        localStorage.removeItem("investigationProgress")
      }
    }

    // INICIAR ANIMAÇÃO IMEDIATAMENTE
    startTimeRef.current = Date.now() - initialElapsedTime

    const animate = () => {
      if (startTimeRef.current === null) return

      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min(100, (elapsed / totalSimulationDuration) * 100)

      setProgress(pct)

      // Calcular etapa atual
      let acc = 0
      let foundStepIndex = -1
      for (let i = 0; i < stepsData.length; i++) {
        const s = stepsData[i]
        const start = acc + s.delay
        const end = start + s.duration
        if (elapsed >= start && elapsed < end) {
          foundStepIndex = i
          break
        }
        acc += s.delay + s.duration
      }

      if (foundStepIndex !== -1) {
        setCurrentStepIndex(foundStepIndex)
      }

      if (pct >= 100) {
        setCurrentStepIndex(stepsData.length - 1)
        setProgress(100)
        localStorage.removeItem("investigationProgress")

        setTimeout(() => {
          router.push(`/results?phone=${encodeURIComponent(phoneNumber)}`)
        }, 2000)
      } else {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // COMEÇAR ANIMAÇÃO
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [phoneNumber, router])

  // Salvar progresso periodicamente
  useEffect(() => {
    const saveInterval = setInterval(saveProgress, 2000)
    return () => clearInterval(saveInterval)
  }, [saveProgress])

  // Lógica do botão voltar
  useEffect(() => {
    window.history.pushState(null, "", window.location.href)

    const handlePopState = () => {
      if (progress < 100 && progress > 0) {
        saveProgress()
      }
      router.replace("/back-redirect")
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [router, progress, saveProgress])

  const handlePlayClick = () => {
    setShowPlayButton(false)
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage('{"method":"play"}', "*")
      } catch (error) {
        console.log("Error playing video:", error)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col py-4 px-2 relative overflow-hidden">
      <WhatsAppBackground />

      <div className="relative z-10 flex flex-col w-full">
        <div className="w-full max-w-sm mx-auto mb-4">
          <p className="text-sm text-whatsapp-text-light mb-3 text-center">
            Essa análise pode durar até <span className="font-semibold text-hacking-primary">2 minutos...</span>
          </p>

          <div className="bg-hacking-card-bg border border-hacking-primary/50 rounded-lg p-4 text-center animate-led-glow-pulse">
            <h2 className="mb-3 text-xl text-[rgba(255,0,0,1)] font-black">ASSISTA O VÍDEO ENQUANTO</h2>
            <div className="flex items-center justify-center gap-2 mb-1">
              <p className="text-hacking-primary text-2xl font-extrabold">O NÚMERO É RASTREADO </p>
            </div>
            <p className="text-whatsapp-text-light mb-3 text-xl">e as conversas são processadas</p>
            <div className="flex items-center justify-center gap-2 text-sm text-hacking-secondary">
              <Volume2 className="w-4 h-4 text-[rgba(3,255,0,1)]" />
              <span className="text-[rgba(3,255,0,1)]">Verifique se seu som está ligado</span>
            </div>
          </div>
        </div>

        <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-hacking-primary/30 w-full mb-6 mx-auto max-w-sm">
          <div className="w-full h-48 relative">
            <iframe
              ref={iframeRef}
              src="https://player.vimeo.com/video/1097730571?h=bd53fcce96&autoplay=0&muted=0&playsinline=1&badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=0"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title="WhatsApp Investigation VSL"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Overlay transparente para bloquear interação direta com o iframe */}
            <div className="absolute inset-0 bg-transparent pointer-events-auto z-10" />

            {showPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] z-20">
                <button
                  onClick={handlePlayClick}
                  className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse border-4 border-white/30"
                  style={{
                    boxShadow:
                      "0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.6), 0 0 60px rgba(220, 38, 38, 0.4)",
                  }}
                >
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center w-full max-w-sm mx-auto">
          <div className="w-full p-3 rounded-lg bg-hacking-card-bg border border-hacking-primary/50 mb-4 text-center animate-led-glow-pulse">
            <p className="text-base font-semibold text-whatsapp-text-light mb-2">
              Analisando: <span className="text-hacking-primary text-sm">{phoneNumber}</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="text-gray-400">Status:</span>
              <span className="text-hacking-primary font-medium">Ativo</span>
            </div>
          </div>

          <p className="text-lg font-bold text-whatsapp-text-light mb-6 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-hacking-primary" />
            {Math.round(progress)}% CONCLUÍDO
          </p>

          <div className="w-full space-y-3">
            {stepsData.map((step, idx) => (
              <div
                key={step.id}
                className={`relative p-3 rounded-lg transition-all duration-500
                ${
                  idx === currentStepIndex
                    ? "bg-hacking-card-bg border border-hacking-primary/80 shadow-lg animate-pulse-border"
                    : idx < currentStepIndex
                      ? "bg-hacking-card-bg border border-hacking-primary/80"
                      : "bg-hacking-card-bg border border-hacking-primary/10 opacity-40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      idx <= currentStepIndex ? "bg-hacking-primary" : "bg-gray-800"
                    } ${idx === currentStepIndex ? "animate-hacking-icon-glow-primary" : ""}`}
                  >
                    <step.icon className={`w-4 h-4 ${idx <= currentStepIndex ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <p
                    className={`text-sm font-medium leading-tight ${
                      idx <= currentStepIndex ? "text-hacking-primary" : "text-whatsapp-text-light"
                    }`}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
