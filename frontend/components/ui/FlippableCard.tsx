"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface FlippableCardProps {
    image: string;
    title: string;
    description: string;
    color: string;
}

export function FlippableCard({ image, title, description, color }: FlippableCardProps) {
    return (
        <div className="perspective-1000 h-[320px]">
            <motion.div
                className="relative w-full h-full preserve-3d group cursor-pointer"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                {/* Front Face - Image */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                    <div className="relative w-full h-full">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {/* Gradient overlay for better aesthetics */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />

                        {/* Glass effect border */}
                        <div className="absolute inset-0 border-2 border-white/10 rounded-2xl" />
                    </div>
                </div>

                {/* Back Face - Text */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${color} p-8 flex flex-col items-center justify-center text-center space-y-4`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            {title}
                        </h3>
                        <p className="text-white/90 text-base md:text-lg leading-relaxed">
                            {description}
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white/20 rotate-45" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
