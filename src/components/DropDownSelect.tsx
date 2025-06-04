// src/components/DropDownSelect.tsx
"use client";

import { useState } from "react";

export type WMSLayerConfig = {
  id: number;
  name: string;
  url: string;
  layerName: string;
};

interface DropDownSelectProps {
  layers: WMSLayerConfig[];
  selectedLayer: WMSLayerConfig;
  onLayerChange: (layer: WMSLayerConfig) => void;
  className?: string;
}

export default function DropDownSelect({
  layers,
  selectedLayer,
  onLayerChange,
  className = "",
}: DropDownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (layer: WMSLayerConfig) => {
    onLayerChange(layer);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900 truncate">
            {selectedLayer?.name || "Select a layer"}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => handleSelect(layer)}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${
                  selectedLayer?.id === layer.id
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{layer.name}</span>
                  {selectedLayer?.id === layer.id && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  );
}
