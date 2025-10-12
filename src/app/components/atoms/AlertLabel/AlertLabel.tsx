"use client";

import React, { ReactElement } from "react";
import { AlertLabelProps } from "./AlertLabel.model";

export const AlertLabel = ({
  show,
  restaurantName,
}: AlertLabelProps): ReactElement => {

  if (!show || !restaurantName) return <></>;

  return (
    <div className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg flex items-center gap-1">
      <span>⚠️</span>
      <span>
        Tienes productos de <strong>{restaurantName}</strong> en tu carrito
      </span>
    </div>
  );
};
