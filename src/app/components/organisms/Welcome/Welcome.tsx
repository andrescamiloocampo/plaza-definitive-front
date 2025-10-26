'use client'

import { type ReactElement } from "react";
import { CartButton } from "../../molecules";

interface Props {
  title: string;
  description: string;
}

export const Welcome = ({ title, description }: Props): ReactElement => {
  return (
    <div
      className="
        flex flex-col sm:flex-row 
        items-start sm:items-center justify-between 
        w-full py-6 sm:py-8 
        px-6 sm:px-12 md:px-24 lg:px-32
        gap-4 sm:gap-0
      "
    >
      <div className="text-left sm:text-left w-full sm:w-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base md:text-lg">
          {description}
        </p>
      </div>

      <div className="self-end sm:self-auto">
        <CartButton />
      </div>
    </div>
  );
};
