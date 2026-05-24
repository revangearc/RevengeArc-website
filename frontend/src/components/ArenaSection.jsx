import { motion } from "motion/react";
import { Heart, MessageCircle, Trophy, Zap, Globe, Users } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import SectionHeader from "./SectionHeader";
import { MOCKUPS } from "../lib/mockups";

const posts = [
  {
    name: "Mark Henry",
    handle: "@markhenryy",
    time: "1h",
    rank: 6,
    xp: 180,
    avatar: "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=200&h=200&fit=crop&q=80",
    text: "Hitting back & biceps hard today 💪 Stay consistent, the results come.",
    likes: 20,
    comments: 24,
    flex: 38,
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&h=600&fit=crop&q=80",
  },
  {
    name: "Sarah Johnson",
    handle: "@sarahjfit",
    time: "2h",
    rank: 7,
    xp: 320,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80",
    text: "What protein do you use? Been looking for a clean one with no bloat.",
    likes: 15,
    comments: 8,
    flex: 12,
  },
  {
    name: "Diego Vasquez",
    handle: "@diegoarcs",
    time: "3h",
    rank: 9,
    xp: 540,
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&q=80",
    text: "Day 240 of my arc. Down 38lbs. The streak is everything. 🔥",
    likes: 412,
    comments: 87,
    flex: 198,
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=600&fit=crop&q=80",
  },
];

export default function ArenaSection() {
  return (
    <section id="arena" className="relative py-28 sm:py-36 overflow-hidden" data-testid="section-arena">
      <div className="orb orb-purple w-[600px] h-[600px] top-1/4 -right-40 opacity-25" />
      <div className="orb orb-pink w-[400px] h-[400px] bottom-0 left-0 opacity-20" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            <div className="orb orb-pink w-[280px] h-[280px] -top-10 -right-10 opacity-50" />
            <PhoneMockup src={MOCKUPS.arena} alt="The Arena" className="w-[280px] sm:w-[330px]" glow="pink" floatVariant="tilt" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHeader
            kicker="THE ARENA"
            variant="slide-left"
            title={<>Built for warriors. <br/>One <span className="gradient-text">movement.</span></>}
            subtitle="Post your wins, ask your questions, flex your gains. The Arena is competitive, real, and very much alive."
          />

          <div className="mt-6 inline-flex items-center gap-3 px-1 py-1 rounded-full glass">
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-sm font-bold flex items-center gap-1.5 glow-purple">
              <Globe className="h-3.5 w-3.5" /> Global Arena
            </button>
            <button className="px-4 py-2 rounded-full text-white/60 text-sm flex items-center gap-1.5 hover:text-white">
              <Users className="h-3.5 w-3.5" /> Squad
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {posts.map((p, i) => (
              <motion.div
                key={p.name + p.rank}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass rounded-2xl p-4 sm:p-5"
                data-testid={`arena-post-${i}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={p.avatar} alt={p.name} className="h-11 w-11 rounded-full object-cover border border-purple-500/30" />
                    <span className="absolute -bottom-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-purple-500 grid place-items-center text-[10px] font-bold text-white border-2 border-[#0a0814]">
                      {p.rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-white/40 text-sm">{p.handle}</span>
                      <span className="text-white/30 text-xs">· {p.time}</span>
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-bold">
                        <Zap className="h-3 w-3" /> {p.xp}
                      </span>
                    </div>
                    <p className="mt-1.5 text-white/85 text-sm leading-relaxed">{p.text}</p>
                    {p.img && (
                      <img src={p.img} alt="post" className="mt-3 rounded-xl w-full h-48 sm:h-60 object-cover border border-white/10" />
                    )}
                    <div className="mt-3 flex items-center gap-2.5">
                      <Stat icon={Heart} value={p.likes} color="text-white/70" bg="bg-white/5 border-white/10" />
                      <Stat icon={MessageCircle} value={p.comments} color="text-cyan-300" bg="bg-cyan-500/8 border-cyan-500/30" />
                      <Stat icon={Trophy} value={p.flex} color="text-amber-300" bg="bg-amber-500/8 border-amber-500/30" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, value, color, bg }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${bg}`}>
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}
