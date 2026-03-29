'use client';

import { motion } from 'framer-motion';

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1a63a8] to-[#153e6a] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur mb-6">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-medium text-white">Thống kê nổi bật</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Con Số Ấn Tượng
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Những thành tựu và con số đáng tự hào của STARTECH trong lĩnh vực công nghệ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: 150, suffix: "+", label: "Dự án hoàn thành", color: "text-green-400", icon: "🚀" },
            { number: 98, suffix: "%", label: "Khách hàng hài lòng", color: "text-blue-400", icon: "😊" },
            { number: 24, suffix: "/7", label: "Hỗ trợ khách hàng", color: "text-yellow-400", icon: "🕒" },
            { number: 5, suffix: "+", label: "Năm kinh nghiệm", color: "text-purple-400", icon: "⭐" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                  <span data-stats-count data-target={stat.number} data-suffix={stat.suffix}>
                    0{stat.suffix}
                  </span>
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
