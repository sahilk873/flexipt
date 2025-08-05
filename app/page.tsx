import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Calendar, BarChart3, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FlexiPT</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Virtual Physical Therapy <br className="hidden md:inline" />
              <span className="text-primary">With Real-Time Feedback</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
              FlexiPT helps licensed providers remotely assign rehab exercises while patients
              receive real-time feedback on form, improving adherence and outcomes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/signup?role=provider">
                <Button size="lg" className="gap-2">
                  For Providers <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup?role=patient">
                <Button size="lg" variant="outline" className="gap-2">
                  For Patients <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Exercise Library</h3>
                <p className="text-muted-foreground">
                  Access a comprehensive library of clinically vetted exercises with detailed metadata.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Feedback</h3>
                <p className="text-muted-foreground">
                  Computer vision technology provides instant form correction and rep counting.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics for providers and motivational progress tracking for patients.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    [Demo Video Placeholder]
                  </div>
                </div>
              </div>
              <div>
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</div>
                    <div>
                      <h3 className="font-bold mb-1">Provider Assigns Exercises</h3>
                      <p className="text-muted-foreground">Licensed providers create personalized rehab programs from our exercise library.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</div>
                    <div>
                      <h3 className="font-bold mb-1">Patient Performs Exercises</h3>
                      <p className="text-muted-foreground">Patients follow along with video guidance while their webcam captures movement.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</div>
                    <div>
                      <h3 className="font-bold mb-1">Real-Time Feedback</h3>
                      <p className="text-muted-foreground">Our AI provides instant form correction and counts repetitions automatically.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">4</div>
                    <div>
                      <h3 className="font-bold mb-1">Progress Tracking</h3>
                      <p className="text-muted-foreground">Both providers and patients can track progress with detailed analytics.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform physical therapy?</h2>
            <p className="max-w-2xl mx-auto mb-10 text-primary-foreground/80">
              Join thousands of providers and patients who are already experiencing better outcomes with FlexiPT.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                  Request Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-background rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="ml-4">
                      <p className="font-bold">User Name</p>
                      <p className="text-sm text-muted-foreground">Role</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "FlexiPT has transformed how I deliver care to my patients. The real-time feedback ensures they're doing exercises correctly, even when I'm not there."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FlexiPT</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Virtual physical therapy with real-time feedback for better outcomes.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">HIPAA</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FlexiPT. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant & Secure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
