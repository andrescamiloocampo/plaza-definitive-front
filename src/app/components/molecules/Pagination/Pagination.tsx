"use client";

import { PaginationButton } from "../../atoms/PaginationButton/PaginationButton";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface PaginatorProps {
  page: number;  
  hasNext: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const Pagination: React.FC<PaginatorProps> = ({
  page,
  hasNext,
  onNext,
  onPrev,
}) => {
  const [direction, setDirection] = React.useState(0);

  const handleNext = () => {
    setDirection(1);
    onNext();
  };

  const handlePrev = () => {
    setDirection(-1);
    onPrev();
  };

  return (
    <div className="flex justify-center items-center gap-3 mt-8 mb-6">
      <PaginationButton disabled={page === 0} onClick={handlePrev}>
        Anterior
      </PaginationButton>

      <div
        className="relative w-8 h-8 rounded-full
         bg-white/20 flex justify-center items-center 
         overflow-hidden shadow-inner bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.span
            key={page}
            custom={direction}
            initial={{ x: direction > 0 ? 20 : -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -20 : 20, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.8, 0.25, 1],
            }}
            className="absolute text-lg font-bold"
          >
            {page + 1}
          </motion.span>
        </AnimatePresence>
      </div>

      <PaginationButton disabled={!hasNext} onClick={handleNext}>
        Siguiente
      </PaginationButton>
    </div>
  );
};
