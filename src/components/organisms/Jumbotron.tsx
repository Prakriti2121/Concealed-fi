"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";

const Jumbotron = () => {
  return (
    <div className="container mx-auto flex items-center h-screen overflow-hidden">
      <div className="grid  md:grid-cols-2 items-center gap-8">
        <div className="z-10 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }} // triggers when 50% of the component is in view
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-6xl font-black"
          >
            Bertrand Machard de Gramont Nuits-saint-Georges Les Terrasses des
            Vallerots 2014
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }} // triggers when 50% of the component is in view
            transition={{ duration: 0.5, delay: 0.3 }}
            className="my-8"
          >
            Berried and fresh reds are light or medium-bodied wines infused with
            the flavours and activity of fresh berries. You can discern lippik
            cranberry, raspberry and cherry notes in these wines. Crisp
            freshness makes them ideal for a variety of foods.
          </motion.p>
          <Button className="relative overflow-hidden bg-[#09090B] text-xl px-4 py-2 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black">
            {/* Text that changes color */}
            <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
              Read More
            </span>
            {/* Expanding background on hover */}
            <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
          </Button>
        </div>
        <div className="-z-10 md:order-2">
          <div className="rotate-[30deg]">
            <Image
              src="/images/wine-header.webp"
              width={500}
              height={500}
              alt="Header Wine"
              className="animate-floating cursor-pointer"
            />

            {/* jumbotron image */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
