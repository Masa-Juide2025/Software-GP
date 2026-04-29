"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Save,
  Loader2,
} from "lucide-react"

const pages = [
  { id: "dashboard", label: "لوحة التحكم" },
  { id: "subscribers", label: "المشتركين" },
  { id: "meal-plans", label: "الخطط الغذائية" },
  { id: "exercises", label: "برامج التمارين" },
  { id: "chat", label: "المحادثات" },
  { id: "reports", label: "التقارير" },
  { id: "ai-tools", label: "أدوات الذكاء الاصطناعي" },
  { id: "notifications", label: "الاشعارات" },
]

const roleMap: Record<string, string> = {
  nutritionist: "أخصائي تغذية",
  trainer: "مدرب رياضي",
}

type PermissionsMap = Record<string, Record<string, boolean>>

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [specialists, setSpecialists] = useState<any[]>([])
  const [permissions, setPermissions] = useState<PermissionsMap>({})

  const [generalSettings, setGeneralSettings] = useState({
    centerName: "NutriSync Ai",
    email: "admin@fitnesscenter.com",
    phone: "0599120935",
    address: "فلسطين-قلقيلية",
    enableNotifications: true,
    enableAiChat: true,
    enableGuestAccess: true,
    maintenanceMode: false,
    defaultLanguage: "ar",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/settings")
        const json = await res.json()
        if (json.success) {
          setSpecialists(json.data)
          const initial: PermissionsMap = {}
          json.data.forEach((spec: any) => {
            initial[spec.id] = {}
            pages.forEach((page) => {
              if (spec.role === "nutritionist") {
                initial[spec.id][page.id] = ["dashboard", "subscribers", "meal-plans", "chat", "reports", "ai-tools"].includes(page.id)
              } else {
                initial[spec.id][page.id] = ["dashboard", "subscribers", "exercises", "chat", "reports", "ai-tools"].includes(page.id)
              }
            })
          })
          setPermissions(initial)
        }
      } catch (err) {
        console.error("Failed to load", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const togglePermission = (specId: string, pageId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [specId]: { ...prev[specId], [pageId]: !prev[specId][pageId] },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold lg:text-2xl">الاعدادات</h2>
          <p className="text-sm text-muted-foreground">اعدادات النظام وادارة الصلاحيات</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="hidden sm:inline">حفظ التغييرات</span>
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="gap-2"><Settings className="h-4 w-4" /><span>عام</span></TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2"><Shield className="h-4 w-4" /><span>الصلاحيات</span></TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /><span>الاشعارات</span></TabsTrigger>
          <TabsTrigger value="localization" className="gap-2"><Globe className="h-4 w-4" /><span>اللغة</span></TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">معلومات المركز</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="centerName">اسم المركز</Label>
                  <Input id="centerName" value={generalSettings.centerName} onChange={(e) => setGeneralSettings({ ...generalSettings, centerName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الالكتروني</Label>
                  <Input id="email" type="email" value={generalSettings.email} onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" value={generalSettings.phone} dir="ltr" className="text-left" onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input id="address" value={generalSettings.address} onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">خيارات النظام</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">تفعيل الاشعارات</p>
                  <p className="text-xs text-muted-foreground">ارسال اشعارات للمشتركين بمواعيد الوجبات والتمارين</p>
                </div>
                <Switch checked={generalSettings.enableNotifications} onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableNotifications: checked })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">شات الذكاء الاصطناعي</p>
                  <p className="text-xs text-muted-foreground">السماح للمشتركين بالتحدث مع الذكاء الاصطناعي</p>
                </div>
                <Switch checked={generalSettings.enableAiChat} onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableAiChat: checked })} />
              </div>
              <Separator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">صلاحيات الأخصائيين</CardTitle>
              <p className="text-xs text-muted-foreground">حدد الصفحات التي يمكن لكل أخصائي الوصول اليها</p>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="space-y-6 lg:hidden">
                {specialists.map((spec) => (
                  <div key={spec.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`text-xs font-bold ${spec.role === "nutritionist" ? "bg-primary/10 text-primary" : "bg-info/10 text-info"}`}>
                          {spec.name?.trim() ? spec.name.split(" ").slice(0, 2).map((n: any) => n[0]).join("") : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{spec.name}</p>
                        <Badge variant="outline" className="text-xs">{roleMap[spec.role]}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {pages.map((page) => (
                        <label key={page.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                          <Checkbox checked={permissions[spec.id]?.[page.id] ?? false} onCheckedChange={() => togglePermission(spec.id, page.id)} />
                          <span className="text-xs">{page.label}</span>
                        </label>
                      ))}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
              {/* Desktop View */}
              <div className="hidden overflow-x-auto lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right min-w-[180px]">الأخصائي</TableHead>
                      {pages.map((page) => <TableHead key={page.id} className="text-center text-xs">{page.label}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialists.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={`text-xs ${spec.role === "nutritionist" ? "bg-primary/10 text-primary" : "bg-info/10 text-info"}`}>
                                {spec.name?.trim() ? spec.name.split(" ").slice(0, 2).map((n: any) => n[0]).join("") : "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{spec.name}</p>
                              <p className="text-xs text-muted-foreground">{roleMap[spec.role]}</p>
                            </div>
                          </div>
                        </TableCell>
                        {pages.map((page) => (
                          <TableCell key={page.id} className="text-center">
                            <Checkbox checked={permissions[spec.id]?.[page.id] ?? false} onCheckedChange={() => togglePermission(spec.id, page.id)} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">اعدادات الاشعارات</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {[
                { title: "تذكير بمواعيد الوجبات", desc: "ارسال اشعار قبل كل وجبة بـ 15 دقيقة", defaultOn: true },
                { title: "تذكير بالتمارين", desc: "ارسال اشعار يومي بموعد التمارين", defaultOn: true },
              ].map((item, i, arr) => (
                <div key={item.title}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.defaultOn} />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">اللغة والمنطقة</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>اللغة الافتراضية</Label>
                <div className="flex gap-3">
                  <Button variant={generalSettings.defaultLanguage === "ar" ? "default" : "outline"} size="sm" onClick={() => setGeneralSettings({ ...generalSettings, defaultLanguage: "ar" })}>العربية</Button>
                  <Button variant={generalSettings.defaultLanguage === "en" ? "default" : "outline"} size="sm" onClick={() => setGeneralSettings({ ...generalSettings, defaultLanguage: "en" })}>English</Button>
                </div>
              </div>
              <Separator />
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">دعم تعدد اللغات</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">حاليا النظام يدعم اللغة العربية والانجليزية لكن مش بالكامل </p>
                <Badge variant="outline" className="mt-2 text-xs">قريبا سيدعم اللغة العربية بالكامل واللغة الانجليزية بالكامل 
                
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}