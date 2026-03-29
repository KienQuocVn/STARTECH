'use client';

import { motion } from 'framer-motion';

export default function TechnologySection() {
  const technologies = [
    { 
      name: 'Next.js', 
      category: 'Framework', 
      color: 'from-gray-800 to-gray-900',
      icon: 'https://www.svgrepo.com/show/342062/next-js.svg'
    },
    { 
      name: 'Vite', 
      category: 'Build Tool', 
      color: 'from-purple-500 to-purple-600',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/1200px-Vitejs-logo.svg.png'
    },
    { 
      name: 'MySQL', 
      category: 'Database', 
      color: 'from-blue-500 to-blue-600',
      icon: 'https://cdn3d.iconscout.com/3d/free/thumb/free-mysql-3d-icon-png-download-9325319.png'
    },
    { 
      name: 'PostgreSQL', 
      category: 'Database', 
      color: 'from-indigo-500 to-indigo-600',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Database-postgres.svg/1448px-Database-postgres.svg.png'
    },
    { 
      name: 'React', 
      category: 'Library', 
      color: 'from-cyan-400 to-cyan-500',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png'
    },
    { 
      name: 'WordPress', 
      category: 'CMS', 
      color: 'from-blue-600 to-blue-700',
      icon: 'https://p7.hiclipart.com/preview/175/368/966/wordpress-logo-computer-icons-theme-wordpress.jpg'
    },
    { 
      name: 'Prisma', 
      category: 'ORM', 
      color: 'from-gray-700 to-gray-800',
      icon: 'https://cdn.worldvectorlogo.com/logos/prisma-3.svg'
    },
    { 
      name: 'GSAP', 
      category: 'Animation', 
      color: 'from-green-500 to-green-600',
      icon: 'https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg'
    },
    { 
      name: 'NestJS', 
      category: 'Framework', 
      color: 'from-red-500 to-red-600',
      icon: 'https://docs.nestjs.com/assets/logo-small-gradient.svg'
    },
    { 
      name: 'Three.js', 
      category: '3D Library', 
      color: 'from-orange-500 to-orange-600',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Three.js_Icon.svg/250px-Three.js_Icon.svg.png'
    },
    { 
      name: 'Tailwind CSS', 
      category: 'CSS Framework', 
      color: 'from-teal-400 to-teal-500',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png'
    },
    { 
      name: 'shadcn/ui', 
      category: 'UI Components', 
      color: 'from-slate-600 to-slate-700',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMxODExODIiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KPHBhdGggZD0iTTkgMTJMMTUgMTJNOSA2TDE1IDZNOSAxOEwxNSAxOCIvPgo8L3N2Zz4KPC9zdmc+'
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-muted/40 overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#1a63a8]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#49b1ff]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-r from-[#1a63a8]/5 to-[#49b1ff]/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1a63a8]/20 bg-[#1a63a8]/10 px-4 py-2 backdrop-blur mb-6">
            <div className="h-2 w-2 rounded-full bg-[#1a63a8] animate-pulse" />
            <span className="text-sm font-medium text-[#1a63a8]">Công nghệ hiện đại</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Công nghệ StarTech sử dụng
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hạ tầng hiện đại, linh hoạt và hiệu suất cao với các công nghệ tiên tiến nhất
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" data-stagger>
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(26,99,168,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,99,168,0.15)]">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`}></div>
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/90 dark:bg-white/10 shadow-lg mb-3 p-2">
                    <img 
                      src={tech.icon} 
                      alt={tech.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-gray-700 dark:text-gray-300 font-bold text-lg">${tech.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-foreground">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tech.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-gradient-to-r from-white/60 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl px-8 py-4 shadow-[0_8px_32px_rgba(26,99,168,0.1)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground">Luôn cập nhật</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground">Hiệu suất cao</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground">Bảo mật tốt</span>
            </div>
          </div>
        </motion.div>

        {/* Tech Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { number: 12, suffix: "+", label: "Công nghệ sử dụng", color: "text-[#1a63a8]" },
            { number: 99, suffix: "%", label: "Hiệu suất tối ưu", color: "text-green-600" },
            { number: 24, suffix: "/7", label: "Hỗ trợ kỹ thuật", color: "text-blue-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur border border-white/20"
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                <span data-tech-count data-target={stat.number} data-suffix={stat.suffix}>
                  0{stat.suffix}
                </span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
