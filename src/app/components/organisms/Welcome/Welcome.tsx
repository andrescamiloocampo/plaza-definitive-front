'use client'

import { type ReactElement } from "react";
import { CartButton } from "../../molecules";

interface props {
    title: string;
    description: string;
}

export const Welcome = ({title,description}:props): ReactElement => {
  return (
    <div className="flex items-start justify-between w-full py-8 px-32">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>      
      <CartButton/>
    </div>
  );
};
