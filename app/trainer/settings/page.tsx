"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Calendar, Save, Eye, EyeOff, Loader2, Building2 } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState("") 
  
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    experience: 0,
    maxSubscribers: 0,
    sportClubName: "", // حقل اسم المركز
  })

  const [availability, setAvailability] = useState<string[]>([])
  const allDaysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayTranslation: { [key: string]: string } = {
    "Sunday": "الأحد", "Monday": "الاثنين", "Tuesday": "الثلاثاء", 
    "Wednesday": "الأربعاء", "Thursday": "الخميس", "Friday": "الجمعة", "Saturday": "السبت"
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const userEmail = localStorage.getItem("userEmail")
      if (!userEmail) { setLoading(false); return; }

      try {
        const res = await fetch(`/api/trainer/settings?email=${userEmail}`)
        const result = await res.json()
        if (result.success) {
          setProfile({
            fullName: result.data.fullName || result.data.name || "", 
            email: result.data.email,
            phone: result.data.phone || "",
            specialization: result.data.specialization || "",
            bio: result.data.bio || "",
            experience: result.data.experienceYears || 0,
            maxSubscribers: result.data.maxSubscribers || 0,
            sportClubName: result.data.sportClubName || "غير محدد",
          })
          setAvailability(result.data.availableDays || []) 
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally { setLoading(false) }
    }
    fetchProfile()
  }, [])

  const toggleDay = (day: string) => {
    setAvailability(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/nutritionist/profiles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          phone: profile.phone,
          specialization: profile.specialization,
          bio: profile.bio,
          experienceYears: Number(profile.experience), 
          maxSubscribers: Number(profile.maxSubscribers),
          availableDays: availability,
          password: newPassword
        }),
      })
      const result = await res.json()
      if (result.success) {
        toast.success("تم حفظ التغييرات بنجاح ✅")
        setNewPassword("") 
      } else {
        toast.error(result.error || "فشل الحفظ")
      }
    } catch (error) { toast.error("حدث خطأ أثناء الحفظ") } finally { setSaving(false) }
  }

  if (loading) return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h2 className="text-xl font-bold lg:text-2xl">{"الاعدادات"}</h2>
        <p className="text-sm text-muted-foreground">{"ادارة حسابك واعداداتك الشخصية"}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile">{"الملف الشخصي"}</TabsTrigger>
          <TabsTrigger value="availability">{"التواجد"}</TabsTrigger>
          <TabsTrigger value="security">{"الأمان"}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />{"الملف الشخصي"}</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 py-2 border-b">
                <Avatar className="h-20 w-20 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/10 text-xl text-primary font-bold">{profile.fullName?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-primary">{profile.fullName}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" /> {profile.sportClubName}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>{"رقم الهاتف"}</Label><Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} dir="ltr" /></div>
                <div className="space-y-2"><Label>{"التخصص"}</Label><Input value={profile.specialization} onChange={(e) => setProfile({...profile, specialization: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>{"نبذة عنك"}</Label><Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="min-h-[100px]" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>{"سنوات الخبرة"}</Label><Input type="number" value={profile.experience} onChange={(e) => setProfile({...profile, experience: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>{"الحد الأقصى للمشتركين"}</Label><Input type="number" value={profile.maxSubscribers} onChange={(e) => setProfile({...profile, maxSubscribers: Number(e.target.value)})} /></div>
              </div>
              <div className="flex justify-end"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}{"حفظ التغييرات"}</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{"أيام التواجد"}</div>
                <div className="text-sm font-normal text-muted-foreground bg-slate-50 px-3 py-1 rounded-full border flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> {profile.sportClubName}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {allDaysEn.map((day) => (
                  <Button key={day} variant={availability.includes(day) ? "default" : "outline"} size="sm" onClick={() => toggleDay(day)}>
                    {dayTranslation[day]}
                  </Button>
                ))}
              </div>
              <div className="flex justify-end"><Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}{"حفظ أيام التواجد"}</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />{"تغيير كلمة المرور"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>{"كلمة المرور الجديدة"}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} className="pl-10 text-left" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">{saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}{"تحديث الأمان"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}