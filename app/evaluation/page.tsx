"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, Heart, Flame, MessageCircle, Lock, Users, MapPin, PhoneCall } from "lucide-react"
import WhatsAppBackground from "@/components/whatsapp-background"

const aggressivePhrases = [
  "ELE ESTÁ TE TRAINDO DESCARADAMENTE!",
  "VOCÊ ESTÁ SENDO FEITA DE IDIOTA!",
  "ELE TEM OUTRAS MULHERES E VOCÊ NEM DESCONFIA!",
  "PARE DE SER INGÊNUA - ELE NÃO TE AMA!",
  "ENQUANTO VOCÊ CONFIA, ELE ESTÁ COM OUTRAS!",
  "VOCÊ MERECE SABER A VERDADE CRUEL!",
  "ELE RI DA SUA CARA PELAS SUAS COSTAS!",
  "CHEGA DE SER ENGANADA - DESCUBRA TUDO!",
  "ELE NUNCA FOI FIEL - ACEITE A REALIDADE!",
  "VOCÊ É APENAS UMA OPÇÃO PARA ELE!",
]

const foundResults = [
  { icon: MessageCircle, text: "15 conversas suspeitas encontradas", color: "text-red-400" },
  { icon: Eye, text: "37 fotos íntimas detectadas", color: "text-yellow-400" },
  { icon: PhoneCall, text: "23 ligações secretas registradas", color: "text-blue-400" },
  { icon: Users, text: "8 novos contatos femininos", color: "text-pink-400" },
  { icon: MapPin, text: "3 localizações suspeitas visitadas", color: "text-green-400" },
  { icon: Lock, text: "12 mensagens apagadas recuperadas", color: "text-purple-400" },
]

export default function EvaluationPage() {
  const router = useRouter()
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    // Iniciar o vídeo automaticamente após 1 segundo
    const videoTimer = setTimeout(() => {
      setShowVideo(true)
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage('{"method":"play"}', "*")
        } catch (error) {
          console.log("Error playing video:", error)
        }
      }
    }, 1000)

    // Alternar frases agressivas a cada 3 segundos
    const phraseTimer = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % aggressivePhrases.length)
    }, 3000)

    return () => {
      clearTimeout(videoTimer)
      clearInterval(phraseTimer)
    }
  }, [])

  const handleCheckout = () => {
    window.open("https://whatscheckout.netlify.app/", "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col py-4 px-2 relative overflow-hidden">
      <WhatsAppBackground />

      {/* Red Alert Banner */}
      <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-4 z-50 shadow-lg">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold px-4 flex items-center justify-center gap-3 animate-pulse">
          <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-300" />
          NÃO FECHE ESTA PÁGINA
          <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-300" />
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mt-24 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Found Section */}
        <div className="w-full p-6 rounded-xl bg-hacking-card-bg border border-red-500 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center text-red-500 mb-6 animate-pulse">RESULTADOS ENCONTRADOS:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foundResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <result.icon className={`w-5 h-5 ${result.color}`} />
                <span className="text-white font-medium text-sm">{result.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aggressive Phrase Section */}
        <div className="w-full p-8 sm:p-10 rounded-xl bg-hacking-card-bg border border-red-500 shadow-lg text-center mb-8 animate-pulse">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-2xl sm:text-4xl font-bold text-red-500 animate-pulse">
              {aggressivePhrases[currentPhraseIndex]}
            </h2>
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
          </div>

          <p className="text-xl sm:text-2xl font-semibold text-white mb-6">
            Você precisa ver isso AGORA antes que seja tarde demais!
          </p>
        </div>

        {/* Video Section - Mobile Format */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-red-500 w-full mb-8 mx-auto max-w-sm">
          <div className="w-full h-[70vh] relative">
            {showVideo && (
              <iframe
                ref={iframeRef}
                src="https://player.vimeo.com/video/1097730571?h=bd53fcce96&autoplay=1&muted=0&playsinline=1&badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=0"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                title="Avaliação Urgente"
                className="w-full h-full object-cover pointer-events-none"
                style={{ pointerEvents: "none" }}
              />
            )}

            {!showVideo && (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-white text-lg">Carregando avaliação...</p>
                </div>
              </div>
            )}

            {/* Overlay to prevent any interaction */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-10"></div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="w-full p-6 rounded-xl bg-red-900/50 border border-red-500 text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-red-400">ÚLTIMA CHANCE!</h3>
            <Eye className="w-6 h-6 text-red-400" />
          </div>

          <p className="text-white mb-4">
            Esta é sua única oportunidade de descobrir a verdade sobre ele(a). Não deixe que continue te enganando!
          </p>

          <div className="flex items-center justify-center gap-2 text-yellow-300">
            
            <span className="font-semibold">Mais de 3.000 pessoas descobriram a traição hoje</span>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="text-center w-full">
          <Button
            onClick={handleCheckout}
            className="w-full sm:w-auto py-6 px-8 rounded-xl text-xl font-bold shadow-xl hover:opacity-90 hover:shadow-2xl hover:scale-105 transition-all animate-pulse border-2 text-white mb-4"
            style={{
              background: "linear-gradient(45deg, #FF0000, #CC0000)",
              borderColor: "#FF0000",
              boxShadow:
                "0 0 3px #FF0000, 0 0 6px #FF0000, 0 0 9px #FF0000, 0 0 12px #FF0000, 0 0 18px #FF0000, 0 0 22px #FF0000",
            }}
          >
            <Heart className="w-6 h-6 mr-2" />
            DESCOBRIR A VERDADE AGORA 
          </Button>

          <p className="text-red-400 text-sm font-semibold animate-pulse">⚠️ Esta oferta expira em poucos minutos!</p>
        </div>

        {/* Bottom Warning */}
        <div className="w-full p-4 rounded-lg bg-yellow-900/50 border border-yellow-500 text-center mt-8">
          <p className="text-yellow-300 text-sm">
            <AlertTriangle className="inline-block w-4 h-4 mr-1" />
            Não feche esta página! Você pode perder esta oportunidade única de descobrir a verdade.
          </p>
        </div>
      </div>
    </div>
  )
}
