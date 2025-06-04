// MapProvider.tsx
import React, { createContext, useState } from "react";
import type { MapLayer } from "./MapContext"; // or define it here
import type Map from "ol/Map";
export const MapContext = createContext<{
  map: Map | null;
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  layers: MapLayer[];
  setLayers: React.Dispatch<React.SetStateAction<MapLayer[]>>;
  toggleLayerVisibility: (name: string) => void;
}>({
  map: null,
  setMap: () => {},
  layers: [],
  setLayers: () => {},
  toggleLayerVisibility: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [map, setMap] = useState<Map | null>(null);
  const [layers, setLayers] = useState<MapLayer[]>([]);

  const toggleLayerVisibility = (name: string) => {
    const updated = layers.map((layer) => {
      if (layer.name === name) {
        layer.olLayer.setVisible(!layer.visible);
        return { ...layer, visible: !layer.visible };
      }
      return layer;
    });
    setLayers(updated);
  };

  return (
    <MapContext.Provider
      value={{ map, setMap, layers, setLayers, toggleLayerVisibility }}
    >
      {children}
    </MapContext.Provider>
  );
};
