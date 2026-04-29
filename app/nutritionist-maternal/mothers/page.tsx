"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Calendar, HeartPulse, Baby, Send, Lock, Save, Loader2, MessageCircle, CheckCircle } from "lucide-react"

export default function MothersPage() {
  const [mothers, setMothers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedMother, setSelectedMother] = useState<any | null>(null)
  
  const [privateNote, setPrivateNote] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)

  const [dbNotes, setDbNotes] = useState<any[]>([])
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)

  const [recommendation, setRecommendation] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => { fetchMothers(); }, []);

  const fetchMothers = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;
      const res = await fetch(`/api/nutritionist-maternal/mothers?email=${userEmail}`);
      const result = await res.json();
      setMothers(Array.isArray(result) ? result : []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchDBNotes = async (subId: string) => {
    setIsLoadingNotes(true);
    try {
      const res = await fetch(`/api/nutritionist-maternal/mothers?subscriberId=${subId}`);
      const data = await res.json();
      if (data.notes) setDbNotes(data.notes);
    } catch (err) { console.error(err); }
    finally { setIsLoadingNotes(false); }
  };

  const handleSelectMother = (mother: any) => {
    setSelectedMother(mother);
    fetchDBNotes(mother._id);
  };

  const handleSavePrivateNote = async () => {
    if (!privateNote.trim() || !selectedMother) return;
    setIsSavingNote(true)
    try {
      const res = await fetch('/api/nutritionist-maternal/mothers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: selectedMother._id,
          nutritionistId: selectedMother.nutritionistId,
          note: privateNote,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setNoteSaved(true)
        setPrivateNote("")
        fetchDBNotes(selectedMother._id);
        setTimeout(() => setNoteSaved(false), 3000)
      }
    } catch (err) { console.error(err) }
    finally { setIsSavingNote(false) }
  }

  const handleSendMessage = async () => {
    if (!recommendation.trim() || !selectedMother) return;
    setIsSending(true)
    try {
      const res = await fetch('/api/nutritionist-maternal/mothers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberId: selectedMother._id,
          nutritionistId: selectedMother.nutritionistId,
          message: recommendation,
        }),
      })
      if (res.ok) {
        setIsSent(true);
        setRecommendation("");
        setTimeout(() => setIsSent(false), 3000);
      }
    } catch (err) { console.error(err) }
    finally { setIsSending(false) }
  }

  const filteredMothers = mothers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h2 className="text-2xl font-bold font-sans">الأمهات</h2>
        <p className="text-sm text-muted-foreground font-sans">إدارة ومتابعة الأمهات الحوامل </p>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="بحث بالاسم..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pr-10 text-right font-sans border-gray-100 rounded-xl" 
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMothers.map((mother) => (
          <Card key={mother._id} className="cursor-pointer hover:shadow-md border-none bg-white text-right rounded-3xl overflow-hidden group transition-all" onClick={() => handleSelectMother(mother)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 shrink-0 border-2 border-pink-50">
                  <AvatarFallback className="bg-pink-50 text-pink-500 font-bold">{mother.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-800">{mother.name}</h3>
                    <Badge className="bg-pink-50 text-pink-600 border-none rounded-lg text-[10px]">{mother.status}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">الأسبوع {mother.weekOrMonths} • العمر: {mother.age}</p>
                  
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                    <Baby className="h-3 w-3 text-pink-300" />
                    <span>{mother.children} أطفال</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{mother.nextVisit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMother} onOpenChange={() => { setSelectedMother(null); setPrivateNote(""); setDbNotes([]); }}>
        <DialogContent className="max-w-md font-sans rounded-[35px] p-0 overflow-hidden border-none shadow-2xl bg-white" dir="rtl">
          {selectedMother && (
            <div className="max-h-[85vh] overflow-y-auto">
              <DialogHeader className="p-6 bg-pink-50/50 text-right border-b border-pink-100/50">
                <DialogTitle className="flex items-center gap-3 font-bold text-xl text-gray-800">
                  <div className="bg-white p-2 rounded-2xl shadow-sm"><HeartPulse className="h-6 w-6 text-pink-500" /></div>
                  {selectedMother.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <InfoBox label="العمر" value={`${selectedMother.age} سنة`} />
                  <InfoBox label="الأطفال" value={`${selectedMother.children} أطفال`} />
                  <InfoBox label="الهاتف" value={selectedMother.phone} isLtr={true} />
                  <InfoBox label="البريد" value={selectedMother.email} />
                </div>

                <div className="bg-pink-50/40 p-5 rounded-[28px] border border-pink-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-pink-800 flex items-center gap-2">
                      <Lock size={14} className="text-pink-500" /> ملاحظات خاصة سرية
                    </h4>
                    {noteSaved && <span className="text-[10px] text-green-600 font-bold animate-bounce">تم الحفظ!</span>}
                  </div>
                  <Textarea 
                    placeholder="اكتب ملاحظة لن يراها المشترك..." 
                    className="bg-white border-pink-100 text-sm min-h-[90px] rounded-2xl focus-visible:ring-pink-200 shadow-inner"
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                  />
                  <Button 
                    onClick={handleSavePrivateNote}
                    disabled={isSavingNote || !privateNote.trim()}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl h-10 gap-2 font-bold shadow-lg shadow-pink-100"
                  >
                    {isSavingNote ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save size={16} /> حفظ الملاحظة</>}
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-gray-700 flex items-center gap-2 px-1">
                    <MessageCircle size={14} className="text-pink-400" /> ملاحظات السجل الطبي التاريخي
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 min-h-[60px]">
                    {isLoadingNotes ? (
                      <div className="flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-pink-300" /></div>
                    ) : dbNotes.length > 0 ? (
                      <div className="space-y-2">
                        {dbNotes.map((n, i) => (
                          <div key={i} className="text-[13px] text-gray-600 border-b border-gray-200/50 pb-2 last:border-0 italic leading-relaxed">
                            • {n.note}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-gray-400 text-center py-2">لا توجد ملاحظات مسجلة مسبقاً</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="font-bold text-xs text-gray-700 flex items-center gap-2 px-1">
                    <Send size={14} className="text-pink-500" /> إرسال توصية طبية للأم
                  </h4>
                  <Textarea 
                    placeholder="اكتب التوجيهات التي ستظهر للأم..." 
                    className="text-right text-sm rounded-2xl border-gray-100 bg-gray-50/50 min-h-[110px]"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isSending || !recommendation.trim()}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-2xl h-12 font-bold gap-2 shadow-lg shadow-pink-100"
                  >
                    {isSending ? <Loader2 className="animate-spin h-5 w-5" /> : <><Send size={18} /> إرسال التوصية</>}
                  </Button>
                  {isSent && <div className="text-center text-[10px] text-green-600 font-bold animate-pulse flex items-center justify-center gap-1 mt-2"><CheckCircle size={12}/> تم الإرسال بنجاح</div>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoBox({ label, value, isLtr = false }: any) {
  return (
    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 text-center">
      <p className="text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{label}</p>
      <p className={`text-[13px] font-black text-gray-700 truncate ${isLtr ? 'font-sans' : ''}`} dir={isLtr ? 'ltr' : 'rtl'}>{value || "---"}</p>
    </div>
  )
}