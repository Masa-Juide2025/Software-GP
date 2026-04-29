"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Calculator, Utensils, Loader2, Info } from "lucide-react"

export default function NutriChat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "مرحباً بك! أنا مساعدك الذكي من NutriSync. كيف يمكنني مساعدتك في حساب سعراتك اليوم؟" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // التمرير التلقائي للأسفل
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/subscriber/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: currentInput,
          history: messages 
        })
      })

      const data = await res.json()
      if (data.success) {
        setMessages(prev => [...prev, { role: "bot", content: data.content }])
      } else {
        // عرض الخطأ بشكل ودي للمستخدم
        setMessages(prev => [...prev, { role: "bot", content: data.error || "عذراً، واجهت مشكلة في الاتصال." }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "فشل الاتصال بالخادم، تأكد من تشغيل المشروع." }])
    } finally {
      setIsLoading(false)
    }
  }

  const healthyFoods = [
    { name: "أفوكادو وبيض", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400", desc: "دهون صحية وشبع طويل" },
    { name: "سلطة الكينوا", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", desc: "ألياف عالية" },
    { name: "دجاج مشوي", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", desc: "بروتين لبناء العضلات" }
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4" dir="rtl">
      {/* هيدر الصفحة */}
      <div className="flex items-center justify-between bg-[#004d3d] p-6 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-4 text-right">
          <div className="bg-[#fbbf24] p-3 rounded-full shadow-inner">
            <Bot className="h-8 w-8 text-[#004d3d]" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">NutriSync AI</h1>
            <p className="text-sm opacity-80 italic">مساعد التغذية الذكي</p>
          </div>
        </div>
        <Badge className="bg-white/20 text-white border-none px-4 py-1">Gemini AI Active</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* صندوق الدردشة */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden flex flex-col h-[600px]">
          <CardHeader className="bg-muted/30 border-b p-4 text-right">
            <CardTitle className="text-base flex items-center gap-2 justify-start font-bold text-[#004d3d]">
              <Calculator className="h-5 w-5" />
              حساب السعرات التفاعلي
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm text-right ${
                  msg.role === "user" 
                  ? "bg-[#004d3d] text-white rounded-tr-none" 
                  : "bg-gray-50 border rounded-tl-none text-gray-800"
                }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-60 justify-start">
                    {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    <span className="text-[10px] font-bold">{msg.role === "user" ? "أنت" : "المساعد الذكي"}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-end p-2">
                <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                   <Loader2 className="h-4 w-4 animate-spin text-[#004d3d]" />
                   <span className="text-xs text-gray-500">جاري التفكير...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </CardContent>

          <div className="p-4 bg-gray-50 border-t flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "يرجى الانتظار..." : "مثال: فطوري كان 2 بيض ورغيف خبز..."}
              disabled={isLoading}
              className="bg-white h-12 text-right focus:ring-[#004d3d]"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-[#004d3d] hover:bg-[#00362b] h-12 w-12 rounded-xl transition-transform active:scale-95"
            >
              <Send className="h-5 w-5 rotate-180 text-white" />
            </Button>
          </div>
        </Card>

        {/* الجانب الأيمن (اقتراحات) */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-b from-[#004d3d] to-[#00362b] text-white">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2 justify-start"><Utensils className="h-4 w-4 text-[#fbbf24]" /> أطباق مقترحة</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {healthyFoods.map((f, i) => (
                <div key={i} className="group relative h-24 rounded-xl overflow-hidden shadow-md">
                  <img src={f.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-2 text-right">
                    <p className="font-bold text-[10px] text-[#fbbf24]">{f.name}</p>
                    <p className="text-[9px] text-white opacity-80">{f.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-dashed border-2 border-[#004d3d]/20 bg-[#004d3d]/5">
            <CardContent className="p-4 flex gap-3 text-right">
              <Info className="h-4 w-4 text-[#004d3d] shrink-0 mt-1" />
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                نصيحة: كلما وصفت وجبتك بدقة أكبر، كانت النتائج من الذكاء الاصطناعي أدق وأفضل.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}