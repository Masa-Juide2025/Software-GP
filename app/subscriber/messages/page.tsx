"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MoreVertical, Search, CheckCheck, MessageSquare, Loader2 } from "lucide-react"

export default function ChatPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [subObjectId, setSubObjectId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadData = async (isFirstLoad = false) => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    const url = `/api/subscriber/messages?email=${email}${selectedUser ? `&otherId=${selectedUser.id}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      if (isFirstLoad) setContacts(data.contacts);
      setSubObjectId(data.subObjectId);
      setMessages(data.messages || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(true); }, []);
  useEffect(() => { if (selectedUser) loadData(); }, [selectedUser]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser || !subObjectId) return;

    const res = await fetch("/api/subscriber/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subObjectId: subObjectId,
        otherId: selectedUser.id,
        content: newMessage
      })
    });

    if (res.ok) {
      setNewMessage("");
      loadData();
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#f8fafc]"><Loader2 className="animate-spin text-[#004d3d] h-8 w-8" /></div>

  return (
    <div className="flex h-[85vh] gap-4 bg-[#f8fafc] p-2" dir="rtl">
      {/* القائمة اليمنى */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="relative pt-2">
          <Search className="absolute right-3 top-5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث..." className="pr-10 bg-white border-none shadow-sm h-11 rounded-xl text-right" />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {contacts.map((contact) => (
            <Card key={contact.id} className={`cursor-pointer border-none shadow-sm transition-all ${selectedUser?.id === contact.id ? 'bg-[#004d3d] text-white' : 'bg-white hover:bg-gray-50'}`} onClick={() => setSelectedUser(contact)}>
              <CardContent className="p-4 flex items-center gap-3 text-right">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarFallback className={selectedUser?.id === contact.id ? "bg-[#7fb3a6] text-white" : "bg-[#f0f9f7] text-[#004d3d] font-bold"}>{contact.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-bold text-sm">{contact.name}</div>
                  <div className={`text-[10px] ${selectedUser?.id === contact.id ? 'text-gray-200' : 'text-muted-foreground'}`}>{contact.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* منطقة المحادثة */}
      <Card className="flex-1 flex flex-col bg-white border-none shadow-sm overflow-hidden rounded-2xl">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3 text-right">
                <Avatar><AvatarFallback className="bg-[#f0f9f7] text-[#004d3d] font-bold">{selectedUser.name[0]}</AvatarFallback></Avatar>
                <div>
                  <div className="font-bold text-[#004d3d] text-sm">{selectedUser.name}</div>
                  <div className="text-[9px] text-green-500 font-bold">متصل الآن</div>
                </div>
              </div>
              <MoreVertical className="text-gray-300 h-5 w-5 cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fdfcf9]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "subscriber" ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm relative ${msg.sender === "subscriber" ? 'bg-[#004d3d] text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
                    {msg.message}
                    <div className={`text-[8px] mt-1 flex items-center justify-end gap-1 ${msg.sender === "subscriber" ? 'text-gray-300' : 'text-gray-400'}`}>
                       {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                       {msg.sender === "subscriber" && <CheckCheck className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <Input placeholder="اكتب رسالتك..." className="flex-1 bg-gray-50 border-none h-11 rounded-xl text-right" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <Button onClick={handleSend} className="bg-[#004d3d] hover:bg-[#00362b] rounded-full w-11 h-11 p-0 flex items-center justify-center transition-all active:scale-95">
                <Send className="h-5 w-5 rotate-180 text-white" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
             <MessageSquare className="h-12 w-12 opacity-20 text-[#004d3d]" />
             <p className="font-bold text-[#004d3d] opacity-60">اختر جهة اتصال للبدء</p>
          </div>
        )}
      </Card>
    </div>
  )
}