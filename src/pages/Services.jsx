import React from 'react'
import {
  Dumbbell, Bike, HeartPulse, Swords, Salad, User, Weight, Sparkles, Activity, Music, Gauge
} from 'lucide-react'

const SERVICES = [
  { name: 'Adult Sports', icon: Activity, desc: 'Structured sport sessions for adults of all fitness levels.' },
  { name: 'CrossFit', icon: Dumbbell, desc: 'High-intensity functional training in a coached group setting.' },
  { name: 'Cycling', icon: Bike, desc: 'Indoor cycling sessions built for endurance and cardio power.' },
  { name: 'HIIT Exercise Classes', icon: HeartPulse, desc: 'Interval-based conditioning to build strength and stamina.' },
  { name: 'Kickboxing', icon: Swords, desc: 'Technique-focused striking training for fitness and discipline.' },
  { name: 'Nutrition Consulting', icon: Salad, desc: 'Guidance to align your eating habits with your training goals.' },
  { name: 'Personal Training', icon: User, desc: 'One-on-one coaching tailored to your specific goals.' },
  { name: 'Weight Training', icon: Weight, desc: 'Progressive resistance training using free weights and machines.' },
  { name: 'Yoga Classes', icon: Sparkles, desc: 'Mobility, breathing and recovery-focused sessions.' },
  { name: 'Zumba', icon: Music, desc: 'Dance-based cardio sessions in a high-energy group format.' },
  { name: 'BMI', icon: Gauge, desc: 'Body composition assessment to track your progress.' }
]

export default function Services() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">Services</p>
      <h1 className="mb-12 font-display text-4xl text-ink">Everything you need to perform</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ name, icon: Icon, desc }) => (
          <div
            key={name}
            className="group rounded-2xl border border-white/5 bg-surface/50 p-7 transition hover:border-violet/40 hover:bg-surface"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet/10 text-violet-soft transition group-hover:bg-violet/20">
              <Icon size={20} />
            </div>
            <h3 className="mb-2 text-lg text-ink">{name}</h3>
            <p className="text-sm text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
