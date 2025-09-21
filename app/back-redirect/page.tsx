"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Globe, MessageCircle, Trash2, History, Clock, FileText } from "lucide-react"
import Image from "next/image"
import WhatsAppBackground from "@/components/whatsapp-background"

interface InvestigationStep {
  id: number
  text: string
  icon: React.ElementType
  delay: number
  duration: number
}

export default function BackRedirectPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStepText, setCurrentStepText] = useState("Iniciando análise...")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [hasSavedProgress, setHasSavedProgress] = useState(false)

  const stepsRef = useRef<InvestigationStep[]>([
    { id: 0, text: "Cruzando dados com o número fornecido...", icon: Globe, delay: 1000, duration: 19000 },
    { id: 1, text: "Gerando conversas arquivadas...", icon: MessageCircle, delay: 1000, duration: 20000 },
    { id: 2, text: "Recuperando conversas apagadas...", icon: Trash2, delay: 1000, duration: 20000 },
    { id: 3, text: "Compilando conversas antigas...", icon: History, delay: 1000, duration: 20000 },
    { id: 4, text: "Coletando conversas atuais...", icon: Clock, delay: 1000, duration: 20000 },
    { id: 5, text: "Compilando relatório completo da investigação...", icon: FileText, delay: 1000, duration: 19000 },
  ])
  const totalSimulationDuration = 120_000 // 2 minutos exatos

  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href)
    }

    window.addEventListener("popstate", handlePopState)

    // Carregar progresso salvo
    const savedProgress = localStorage.getItem("investigationProgress")
    if (savedProgress) {
      try {
        const {
          progress: savedProgressPct,
          currentStepIndex: savedStepIndex,
          phoneNumber: savedPhoneNumber,
          totalSimulationDuration: savedTotalDuration,
          timestamp: savedTimestamp,
        } = JSON.parse(savedProgress)

        // Verificar se os dados são válidos e não muito antigos
        const isDataValid =
          savedTotalDuration === totalSimulationDuration && savedPhoneNumber && Date.now() - savedTimestamp < 600000 // 10 minutos

        if (isDataValid) {
          setPhoneNumber(savedPhoneNumber)
          const validProgress = Math.max(0, Math.min(100, Number(savedProgressPct) || 0))
          setProgress(validProgress)
          setHasSavedProgress(true)

          if (validProgress >= 99.9) {
            setCurrentStepText("Análise concluída!")
          } else if (savedStepIndex !== -1 && savedStepIndex >= 0 && stepsRef.current[savedStepIndex]) {
            setCurrentStepText(stepsRef.current[savedStepIndex].text)
          } else {
            setCurrentStepText("Retomando análise...")
          }
        } else {
          localStorage.removeItem("investigationProgress")
          setHasSavedProgress(false)
          setCurrentStepText("Nenhuma análise em andamento.")
        }
      } catch (error) {
        console.error("Erro ao carregar progresso:", error)
        localStorage.removeItem("investigationProgress")
        setHasSavedProgress(false)
        setCurrentStepText("Nenhuma análise em andamento.")
      }
    } else {
      setHasSavedProgress(false)
      setCurrentStepText("Nenhuma análise em andamento.")
    }

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const handleContinueVerification = () => {
    router.replace("/investigating")
  }

  return (
    <div className="min-h-screen flex flex-col py-4 px-2 relative overflow-hidden">
      <WhatsAppBackground />

      {/* Red Alert Banner - MANTÉM EFEITO */}
      <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-4 z-50 shadow-lg">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold px-4 flex items-center justify-center gap-3 animate-pulse">
          <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-300" />
          ANÁLISE PAUSADA
          <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-300" />
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mt-24 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Card - SEM EFEITOS */}
        <div className="w-full p-8 sm:p-10 rounded-xl bg-hacking-card-bg border border-hacking-primary/50 shadow-lg text-center">
          {/* FRASE FIXA - SEM EFEITOS */}
          <p className="text-xl sm:text-2xl font-semibold text-whatsapp-text-light mb-8">
            MENSAGENS E FOTOS SUSPEITAS JÁ FORAM ENCONTRADAS...
          </p>

          {/* WhatsApp Screenshot - SEM EFEITOS */}
          <div className="relative w-full max-w-full mx-auto mb-10">
            <Image
              src="/images/blurred-whatsapp-messages.png"
              alt="Mensagens e fotos suspeitas"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg border border-hacking-primary/30"
              priority
            />
          </div>

          {/* Mini Loading / Progress Bar (Exibido apenas se houver progresso salvo) - SEM EFEITOS */}
          {hasSavedProgress && (
            <>
              <div className="w-full bg-gray-800 rounded-full h-4 mb-4 overflow-hidden border border-hacking-primary/30">
                <div
                  className="bg-gradient-to-r from-hacking-primary to-hacking-secondary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-hacking-primary mb-8 font-medium">
                {currentStepText} ({Math.round(progress)}%)
              </p>
            </>
          )}

          {/* Backup Message Bubble - SEM EFEITOS */}
          <div className="bg-hacking-card-bg border border-hacking-primary/30 p-5 rounded-lg shadow-md mb-10 max-w-sm mx-auto">
            <p className="text-base text-whatsapp-text-light">
              Fazendo backup de conversas arquivadas e excluídas. Por favor, aguarde...
            </p>
          </div>

          {/* FRASE FIXA - SEM EFEITOS */}
          <p className="text-2xl sm:text-3xl font-bold text-whatsapp-text-light mb-10">
            CONTINUE ASSISTINDO O VÍDEO ENQUANTO BUSCAMOS MAIS ARQUIVOS SUSPEITOS!
          </p>

          {/* Continue Button - BOTÃO VERMELHO COM EFEITOS */}
          <Button
            onClick={handleContinueVerification}
            className="w-full py-5 sm:py-7 rounded-full text-lg sm:text-xl md:text-2xl font-bold shadow-xl hover:opacity-90 hover:shadow-2xl hover:scale-105 transition-all animate-pulse border-2 text-white"
            style={{
              background: "linear-gradient(45deg, #FF0000, #CC0000)",
              borderColor: "#FF0000",
              boxShadow:
                "0 0 3px #FF0000, 0 0 6px #FF0000, 0 0 9px #FF0000, 0 0 12px #FF0000, 0 0 18px #FF0000, 0 0 22px #FF0000",
            }}
          >
            {"DESCOBRIR TUDO AGORA"}
          </Button>
        </div>
      </div>
    </div>
  )
}
