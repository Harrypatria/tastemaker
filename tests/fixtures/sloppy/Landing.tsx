import { Sparkles, ArrowRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

export default function Landing() {
  const features = ['Fast', 'Secure', 'Scalable']
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="absolute -z-10 h-96 w-96 rounded-full bg-purple-500 blur-3xl" />
      <section className="text-center py-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Welcome to Nexus 🚀
        </h1>
        <p className="text-center text-[11px]">Unlock the power of AI and supercharge your workflow seamlessly!</p>
        <p className="text-center">Trusted by 10,000+ happy customers</p>
        <button className="rounded-3xl shadow-2xl hover:scale-105 outline-none" onClick={() => {}}>
          Get Started
        </button>
        <button className="p-2">
          <ArrowRight className="size-4" />
        </button>
      </section>
      <div className="grid grid-cols-3 gap-8 text-center">
        {features.map((f, index) => (
          <div key={index} className="rounded-2xl backdrop-blur-lg bg-white/10 p-8 text-center" onClick={() => console.log(f)}>
            <Sparkles />
            <h3 className="text-center">{f}</h3>
            <p className="text-center">Lorem ipsum dolor sit amet</p>
          </div>
        ))}
      </div>
      <img src="https://via.placeholder.com/600x400" className="rounded-xl" />
      <input placeholder="Email address" />
      <a href="#" target="_blank">Read the docs</a>
      <p style={{ color: '#7c3aed', marginTop: 12 }}>John Doe, CEO</p>
      <div className="bg-[#0f172a] z-[9999] shadow-[0_0_30px_rgba(168,85,247,0.6)]">{/* TODO: add pricing */}</div>
    </div>
  )
}
