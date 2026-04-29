"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  User, Mail, Phone, Target, Calendar, Ruler, 
  Scale, Lock, Save, Loader2, CheckCircle2, Eye, EyeOff 
} from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    fullName: "", email: "", phone: "", age: "", target: "", 
    currentWeight: "", targetWeight: "", height: "", password: ""
  });

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    if (email) {
      fetch(`/api/subscriber/settings?email=${email}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) setFormData({...json.data, password: ""});
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/subscriber/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowSuccess(true);
        setFormData((prev: any) => ({ ...prev, password: "" }));
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally { setSaving(false); }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#004d3d] h-10 w-10" /></div>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6" dir="rtl">
      {/* العنوان المحدث */}
      <div className="flex items-center gap-2 text-[#004d3d] border-b pb-4 text-right">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-bold">إعدادات الحساب الشخصي</h1>
      </div>

      <Card className="border-none shadow-sm bg-[#fdfcf9] relative overflow-hidden text-right">
        {showSuccess && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <CheckCircle2 className="h-12 w-12 text-[#004d3d] mb-2" />
            <p className="font-bold text-[#004d3d]">تم التحديث بنجاح!</p>
          </div>
        )}

        <CardContent className="space-y-6 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-right">
              <Label className="font-bold text-gray-700">الاسم الكامل</Label>
              <Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="text-right bg-white" />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold text-gray-700">رقم الهاتف</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="text-right bg-white" />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold text-gray-700">البريد الإلكتروني</Label>
              <Input value={formData.email} disabled className="bg-gray-100 text-right opacity-70 cursor-not-allowed" />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold text-gray-700">كلمة مرور جديدة</Label>
              <div className="relative">
                <Input 
                  type={showPass ? "text" : "password"} 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="text-right bg-white pl-10" 
                  placeholder="" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-2.5 text-gray-400">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <hr className="opacity-40" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-right">
              <Label className="flex items-center gap-2 font-bold text-[#004d3d]"><Target className="h-4 w-4 text-[#7fb3a6]" /> الهدف الحالي</Label>
              <Input value={formData.target} disabled className="text-right bg-gray-100 font-bold text-[#004d3d] border-[#7fb3a6]" />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold text-gray-700">العمر</Label>
              <Input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="text-right bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2 text-right">
              <Label className="flex items-center gap-2 text-gray-600"><Scale className="h-4 w-4" /> الوزن الحالي (كجم)</Label>
              <Input type="number" value={formData.currentWeight} onChange={(e) => setFormData({...formData, currentWeight: e.target.value})} className="text-right bg-white" />
            </div>
            <div className="space-y-2 text-right">
              <Label className="flex items-center gap-2 text-gray-600"><Target className="h-4 w-4" /> الوزن المستهدف</Label>
              <Input type="number" value={formData.targetWeight} onChange={(e) => setFormData({...formData, targetWeight: e.target.value})} className="text-right bg-white border-[#7fb3a6]/30" />
            </div>
            <div className="space-y-2 text-right">
              <Label className="flex items-center gap-2 text-gray-600"><Ruler className="h-4 w-4" /> الطول (سم)</Label>
              <Input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="text-right bg-white" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-[#004d3d] hover:bg-[#00362b] text-white h-12 mt-4 font-bold shadow-md transition-all active:scale-95">
            {saving ? <Loader2 className="animate-spin ml-2 h-5 w-5" /> : <Save className="ml-2 h-5 w-5" />}
            حفظ البيانات
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}