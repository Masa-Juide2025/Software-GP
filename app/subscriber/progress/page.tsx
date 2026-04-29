"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Scale, Calendar, Star, Send, MessageSquare, CheckCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function ProgressPage() {
  const [userEmail, setUserEmail] = useState("") 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackTarget, setFeedbackTarget] = useState({ id: "", type: "" })
  const [newWeight, setNewWeight] = useState("")

  const fetchProgress = async (email: string) => {
    try {
      const res = await fetch(`/api/subscriber/progress?email=${email}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) { console.error("Error fetching data"); }
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    if (email) {
      setUserEmail(email);
      fetchProgress(email);
    }
  }, []);

  const handleLogWeight = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriber/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateWeight", email: userEmail, weight: newWeight }),
      });
      if (res.ok) {
        setNewWeight("");
        fetchProgress(userEmail);
      }
    } catch (error) { console.error("Error saving weight");
    } finally { setLoading(false); }
  }

  const handleSubmitFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriber/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "sendMessage", 
          email: userEmail, 
          feedbackData: { 
            targetId: feedbackTarget.id, 
            targetType: feedbackTarget.type, 
            message: feedbackMessage, 
            rating: feedbackRating 
          } 
        }),
      });
      if (res.ok) {
        setShowSuccess(true);
        setFeedbackRating(0); setFeedbackMessage(""); setFeedbackTarget({ id: "", type: "" });
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <div className="flex items-center justify-start gap-2">
          <TrendingUp className="h-5 w-5 text-[#004d3d]" />
          <h2 className="text-xl font-bold lg:text-2xl text-[#004d3d]">
            {"مرحباً، "} {data?.userName ? data.userName.split(" ")[0] : "تقدمي الشخصي"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">{"سجل وزنك وشارك تعليقاتك مع الفريق الطبي والرياضي"}</p>
      </div>

      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-[#f4f7f6]">
          <TabsTrigger value="weight" className="font-bold">{"سجل الوزن"}</TabsTrigger>
          <TabsTrigger value="feedback" className="font-bold">{"الفيدباك والتقييم"}</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card className="text-right border-primary/10 bg-[#fdfcf9]">
            <CardHeader className="pb-3 text-right">
              <CardTitle className="flex items-center gap-2 text-base justify-start text-[#7fb3a6]">
                <Scale className="h-5 w-5" />
                {"تحديث الوزن الحالي"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="أدخل الوزن (كجم)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="text-right bg-white"
                />
                <Button onClick={handleLogWeight} disabled={!newWeight || loading} className="bg-[#7fb3a6] hover:bg-[#6a9a8e]">
                  {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                  {"حفظ"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="text-right bg-[#fdfcf9]">
            <CardHeader className="pb-3 text-right">
              <CardTitle className="flex items-center gap-2 text-base justify-start text-[#004d3d]">
                <Calendar className="h-5 w-5" />
                {"السجلات السابقة"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data?.weightHistory?.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f9f7] border border-[#7fb3a6]/20">
                        <Scale className="h-4 w-4 text-[#7fb3a6]" />
                      </div>
                      <span className="text-sm font-bold">{entry.date}</span>
                    </div>
                    <Badge variant="outline" className="font-bold text-[#004d3d] border-[#7fb3a6] bg-[#e9f2f0]">{entry.weight} كجم</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card className="text-right bg-[#fdfcf9] relative overflow-hidden">
            {showSuccess && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-2 animate-in fade-in zoom-in duration-300">
                <CheckCircle className="h-12 w-12 text-[#004d3d]" />
                <h3 className="text-lg font-bold text-[#004d3d]">تم الإرسال بنجاح!</h3>
              </div>
            )}
            <CardHeader className="pb-3 text-right">
              <CardTitle className="flex items-center gap-2 text-base justify-start text-[#7fb3a6]">
                <MessageSquare className="h-5 w-5" />
                {"إرسال ملاحظة للمدرب أو الأخصائي"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-right">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">{"موجه إلى:"}</Label>
                  <Select onValueChange={(val) => {
                    const [id, type] = val.split("|");
                    setFeedbackTarget({ id, type });
                  }} value={feedbackTarget.id ? `${feedbackTarget.id}|${feedbackTarget.type}` : ""}>
                    <SelectTrigger className="text-right h-10 bg-white">
                      <SelectValue placeholder="اختر المستلم" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.trainerId && <SelectItem value={`${data.trainerId}|trainer`}>مدرب: {data.trainerName}</SelectItem>}
                      {data?.nutritionistId && <SelectItem value={`${data.nutritionistId}|nutritionist`}>أخصائي: {data.nutritionistName}</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-right">
                  <Label className="text-xs">{"التقييم:"}</Label>
                  <div className="flex gap-2 justify-start py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setFeedbackRating(star)}>
                        <Star className={`h-5 w-5 ${star <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{"رسالتك:"}</Label>
                <Textarea placeholder="اكتب ملاحظاتك هنا..." value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} className="text-right bg-white" rows={3} />
              </div>
              <Button onClick={handleSubmitFeedback} disabled={!feedbackRating || !feedbackMessage || !feedbackTarget.id || loading} className="w-full bg-[#004d3d] hover:bg-[#00362b] text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Send className="h-4 w-4 ml-2" />}
                {"إرسال الآن"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}