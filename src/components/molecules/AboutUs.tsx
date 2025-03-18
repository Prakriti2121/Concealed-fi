"use client";
import React from "react";
import Image from "next/image";
import Container from "../atoms/Container";
import { Button } from "../ui/button";
import { motion, useScroll } from "motion/react";

const AboutUs = () => {
  const { scrollYProgress } = useScroll();

  return (
    <Container>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="md:grid grid-cols-2 items-stretch gap-12"
      >
        {/* Image section: Animates on scroll (fade in from bottom) */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="">
            <Image
              src="/images/barrels.jpg"
              alt="About Us"
              width={500}
              height={500}
              className="w-full h-full object-cover rounded-[60px] "
            />
          </div>
        </motion.div>

        {/* Text section: Animates on scroll (fade in from bottom) with a slight delay */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h4 className="text-4xl md:text-6xl font-black my-6">About Us</h4>
          <p className="mt-12 text-gray-700 font-light text-xl">
            Concealed Wines on pohjoismaisten markkinoiden viinintoimittaja.
            Meidän tavoitteemme on tarjota loistoviinejä kuluttajille. Tällä
            hetkellä myymme muutamia laatuviinejä Suomessa ja samanaikaisesti
            tuomme markkinoille uusia viinejä.
          </p>
          <p className="mt-12 text-gray-700 font-light text-xl">
            Esittelemme tällä nettisivulla viinejä, joita maahantuomme Suomeen.
            Saadaksesi lisätietoja Concealed Wines yhtiöstä, vieraile
            osoitteessa
          </p>

          <div className="mt-12">
            <Button className="relative overflow-hidden bg-[#09090B] text-xl px-4 py-2 h-full text-white border border-transparent group transition-all duration-300 ease-in-out hover:border-black">
              <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:text-black">
                Read More
              </span>
              <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default AboutUs;
