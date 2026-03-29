"use client"

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
const projects = [
  {
    name: 'Dự án Hustle',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=533&fit=crop',
  },
  {
    name: 'Dự án Tiffanydigitizing',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=533&fit=crop',
  },
  {
    name: 'Dự án Laundry Lab',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=533&fit=crop',
  },
  {
    name: 'Dự án Sao Nam',
    image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&h=533&fit=crop',
  },
  {
    name: 'Dự án Fgroup',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=533&fit=crop',
  },
  {
    name: 'Dự án Cityhouse',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=533&fit=crop',
  },
  {
    name: 'Dự án Simply',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=533&fit=crop',
  },
];

export function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, projects.length - itemsPerPage);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-12 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a]">
              NHỮNG DỰ ÁN
              <br className="hidden sm:block" /> TIÊU BIỂU
            </h2>
          </div>

          <div className="flex justify-center sm:justify-end w-full sm:w-auto gap-3 mt-4 sm:mt-0">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 sm:p-3 rounded-full border-2 border-gray-300 hover:border-[#1a63a8] disabled:opacity-40 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 sm:p-3 rounded-full border-2 border-gray-300 hover:border-[#1a63a8] disabled:opacity-40 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3 + 1)}%)`,
            }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="
                  flex-shrink-0 
                  w-[85%] sm:w-[48%] lg:w-[32%] 
                  mx-auto sm:mx-0
                "
              >
                <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 sm:p-6 w-full">
                      <div className="flex items-center justify-between text-white">
                        <span className="font-bold text-sm sm:text-base">{project.name}</span>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/du-an"
            className="inline-block px-6 sm:px-8 py-3 bg-gradient-to-r from-[#4fafdb] to-[#1a63a8] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem thêm
          </Link>
        </div>
      </div>
    </section>
  );
}
