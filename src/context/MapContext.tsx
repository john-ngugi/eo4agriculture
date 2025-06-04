// src/context/MapContext.tsx
import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type Map from "ol/Map";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

export type WMSLayerConfig = {
  id: number;
  name: string;
  url: string;
  layerName: string;
};

export type MapLayer = {
  name: string;
  olLayer: ImageLayer<ImageWMS>;
  visible: boolean;
};

interface MapContextType {
  map: Map | null;
  setMap: (map: Map) => void;
  currentWMSLayer: WMSLayerConfig;
  switchWMSLayer: (layerConfig: WMSLayerConfig, mapInstance?: Map) => void;
  availableWMSLayers: WMSLayerConfig[];
}

// Available WMS layers configuration
export const availableWMSLayers: WMSLayerConfig[] = [
  {
    id: 1,
    name: "KSA Microsoft AI4G",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Counties:msai4g_lulc_muranga_aoi_final",
  },
  {
    id: 2,
    name: "Dynamic World",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Counties:esri_lulc_muranga_aoi_merged",
  },
];

export const MapContext = createContext<MapContextType>({
  map: null,
  setMap: () => {},
  currentWMSLayer: availableWMSLayers[0],
  switchWMSLayer: () => {},
  availableWMSLayers: availableWMSLayers,
});

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<Map | null>(null);
  const [currentWMSLayer, setCurrentWMSLayer] = useState<WMSLayerConfig>(
    availableWMSLayers[0]
  );

  const switchWMSLayer = (layerConfig: WMSLayerConfig, mapInstance?: Map) => {
    const targetMap = mapInstance || map;
    console.log("switchWMSLayer called with:", layerConfig);
    console.log("Map available:", !!targetMap);

    if (!targetMap) {
      console.log("No map available, cannot switch layer");
      return;
    }

    // Remove existing WMS layers
    const layersToRemove: ImageLayer<ImageWMS>[] = [];
    targetMap
      .getLayers()
      .getArray()
      .forEach((layer) => {
        if (layer instanceof ImageLayer && layer.get("isWMSLayer")) {
          console.log("Found WMS layer to remove:", layer.get("name"));
          layersToRemove.push(layer);
        }
      });

    layersToRemove.forEach((layer) => {
      console.log("Removing layer:", layer.get("name"));
      targetMap.removeLayer(layer);
    });

    console.log("Creating new WMS layer for:", layerConfig.name);

    // Add new WMS layer
    const wmsLayer = new ImageLayer({
      source: new ImageWMS({
        url: layerConfig.url,
        params: {
          LAYERS: layerConfig.layerName,
          TILED: true,
        },
        serverType: "geoserver",
        ratio: 1,
      }),
      visible: true,
    });

    // Mark as WMS layer for easy identification
    wmsLayer.set("name", layerConfig.name);
    wmsLayer.set("isWMSLayer", true);

    console.log("Adding new layer to map:", layerConfig.name);
    targetMap.addLayer(wmsLayer);
    setCurrentWMSLayer(layerConfig);

    console.log("Layer switch completed");
  };

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        currentWMSLayer,
        switchWMSLayer,
        availableWMSLayers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Custom hook for easier access
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
