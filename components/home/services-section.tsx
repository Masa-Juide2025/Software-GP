import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, Dumbbell, HeartPulse, Users } from "lucide-react"

const services = [
  {
    icon: UtensilsCrossed,
    title: "خطط غذائية مخصصة",
    description: "خطط تغذية مصممة خصيصا حسب احتياجاتك الصحية وأهدافك مع متابعة يومية من أخصائيي التغذية.",
  },
  {
    icon: Dumbbell,
    title: "برامج تدريب رياضية",
    description: "برامج تمارين متكاملة مصممة لتحقيق أهدافك سواء كانت خسارة وزن أو بناء عضلات أو لياقة عامة.",
  },
  {
    icon: HeartPulse,
    title: "متابعة صحية شاملة",
    description: "متابعة مستمرة لمؤشراتك الصحية مثل الوزن ومؤشر كتلة الجسم والسعرات الحرارية وشرب الماء.",
  },
  {
    icon: Users,
    title: "فريق متخصص",
    description: "نخبة من أخصائيي التغذية والمدربين الرياضيين المعتمدين لمساعدتك في كل خطوة.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            {"خدماتنا"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            {"نوفر لك كل ما تحتاجه لتحقيق أهدافك الصحية في مكان واحد"}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
