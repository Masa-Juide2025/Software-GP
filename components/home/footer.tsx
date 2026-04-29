import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">NutriSync AI</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {"مركز صحي متكامل للتغذية واللياقة البدنية. نساعدك في تحقيق أهدافك الصحية بإشراف نخبة من المتخصصين."}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">{"روابط سريعة"}</h4>
            <ul className="space-y-2">
              {[
                { href: "#services", label: "خدماتنا" },
                { href: "#specialists", label: "فريقنا" },
                { href: "/login", label: "تسجيل الدخول" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">{"تواصل معنا"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{"البريد: admin@fitnesscenter.com"}</li>
              <li>{"الهاتف:0599120935"}</li>
              <li>{"العنوان: فلسطين-قلقيلية"}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {"جميع الحقوق محفوظة"} &copy; {new Date().getFullYear()} NutriSync AI
        </div>
      </div>
    </footer>
  )
}