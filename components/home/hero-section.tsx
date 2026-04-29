import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 lg:flex-row lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex-1 text-center lg:text-right">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            {"مركز صحي متكامل"}
          </div>
          <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {"حياة صحية تبدأ"}
            <br />
            <span className="text-primary">{"من هنا"}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg">
            {"نقدم لك خطط تغذية مخصصة وبرامج تدريب رياضية متكاملة بإشراف نخبة من الأخصائيين والمدربين المعتمدين."}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" asChild className="gap-2">
              <Link href="/login?tab=register">
                {"ابدأ رحلتك الآن"}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
            {[""].map((stat) => (
              <div key={stat} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                
                {stat}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/Home Image.jpg"
              alt="مركز NutriSync Ai للصحة واللياقة"
              fill
              className="object-cover"
              priority
            />
          </div>
          
        </div>
      </div>
    </section>
  )
}