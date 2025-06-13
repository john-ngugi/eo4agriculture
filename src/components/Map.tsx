import React, { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS.js";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from "ol/Overlay";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { fromLonLat } from "ol/proj";
import Attribution from "ol/control/Attribution";
import { Style, Fill, Stroke, Circle } from "ol/style";
import {
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import LULCDashboard from "./Charts";
export type LayerType = "WMS" | "WFS";

export interface LayerConfig {
  id: number;
  name: string;
  url: string;
  layerName: string;
  type: LayerType;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  };
}

interface ActiveLayer extends LayerConfig {
  visible: boolean;
  opacity: number;
  olLayer?: TileLayer<TileWMS> | VectorLayer<VectorSource>;
}

interface LULCData {
  areaName: string;
  level: "county" | "subcounty";
  year: number;
  classes: {
    [className: string]: {
      hectares: number;
      percentage: number;
    };
  };
}

// Sample LULC data for the dashboard
const sampleLULCData2022: LULCData = {
  areaName: "Murang'a County",
  level: "county",
  year: 2022,
  classes: {
    Crop: { hectares: 129919.25, percentage: 51.1 },
    Trees: { hectares: 51423.65, percentage: 20.23 },
    Road: { hectares: 31428.71, percentage: 12.36 },
    Building: { hectares: 21886.05, percentage: 8.61 },
    "Shrub & Scrub": { hectares: 15931.48, percentage: 6.27 },
    Grass: { hectares: 1442.52, percentage: 0.57 },
    Water: { hectares: 1184.94, percentage: 0.47 },
    "Bare Ground": { hectares: 1007.88, percentage: 0.4 },
  },
};

// Create county-level 2024 data 
const sampleLULCData2024: LULCData = {
  areaName: "Murang'a County",
  level: "county",
  year: 2024,
  classes: {
    Trees: { hectares: 136632.57, percentage: 56.41 },
    Crop: { hectares: 71384.12, percentage: 29.47 },
    "Bare Ground": { hectares: 26378.49, percentage: 10.89 },
    Building: { hectares: 5709.85, percentage: 2.36 },
    Grass: { hectares: 1500.99, percentage: 0.62 },
    Water: { hectares: 601.3, percentage: 0.25 },
  },
};

const kangemaLULCData2022: LULCData = {
  areaName: "Kangema",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 35461.43, percentage: 51.29 },
    Trees: { hectares: 25498.97, percentage: 36.87 },
    Building: { hectares: 2905.7, percentage: 4.2 },
    Road: { hectares: 2793.1, percentage: 4.04 },
    "Shrub & Scrub": { hectares: 2294.48, percentage: 3.32 },
    Grass: { hectares: 25.41, percentage: 0.04 },
    "Bare Ground": { hectares: 5.61, percentage: 0.01 },
    Water: { hectares: 5.4, percentage: 0.01 },
  },
};

const kigumoLULCData2022: LULCData = {
  areaName: "Kigumo",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 35650.82, percentage: 50.37 },
    Trees: { hectares: 26024.37, percentage: 36.79 },
    Road: { hectares: 4327.36, percentage: 6.11 },
    Building: { hectares: 3904.74, percentage: 5.52 },
    "Shrub & Scrub": { hectares: 2808.22, percentage: 3.97 },
    Water: { hectares: 238.81, percentage: 0.34 },
    Grass: { hectares: 31.85, percentage: 0.05 },
    "Bare Ground": { hectares: 13.61, percentage: 0.02 },
  },
};

const gatangaLULCData2022: LULCData = {
  areaName: "Gatanga",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 70578.98, percentage: 60.76 },
    Trees: { hectares: 27836.89, percentage: 23.96 },
    Road: { hectares: 7567.39, percentage: 6.52 },
    Building: { hectares: 4429.35, percentage: 3.81 },
    Water: { hectares: 758.4, percentage: 0.65 },
    "Shrub & Scrub": { hectares: 957.0, percentage: 0.82 },
    Grass: { hectares: 420.55, percentage: 0.36 },
    "Bare Ground": { hectares: 622.57, percentage: 0.54 },
  },
};

const maragwaLULCData2022: LULCData = {
  areaName: "Maragwa",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 50109.62, percentage: 70.77 },
    Road: { hectares: 7788.51, percentage: 11.0 },
    "Shrub & Scrub": { hectares: 2969.34, percentage: 4.19 },
    Building: { hectares: 2816.97, percentage: 3.98 },
    Trees: { hectares: 3364.9, percentage: 4.75 },
    Grass: { hectares: 1022.44, percentage: 1.44 },
    Water: { hectares: 392.95, percentage: 0.55 },
    "Bare Ground": { hectares: 216.57, percentage: 0.31 },
  },
};

const mathioyaLULCData2022: LULCData = {
  areaName: "Mathioya",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 36898.38, percentage: 51.72 },
    Trees: { hectares: 25588.45, percentage: 35.89 },
    Road: { hectares: 3401.86, percentage: 4.77 },
    "Shrub & Scrub": { hectares: 2693.97, percentage: 3.78 },
    Building: { hectares: 2558.5, percentage: 3.59 },
    Water: { hectares: 16.23, percentage: 0.02 },
    Grass: { hectares: 34.43, percentage: 0.05 },
    "Bare Ground": { hectares: 14.05, percentage: 0.02 },
  },
};

const kandaraLULCData2022: LULCData = {
  areaName: "Kandara",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 54566.14, percentage: 82.14 },
    Road: { hectares: 4577.51, percentage: 6.89 },
    Building: { hectares: 3177.23, percentage: 4.78 },
    "Shrub & Scrub": { hectares: 2377.95, percentage: 3.58 },
    Trees: { hectares: 3873.52, percentage: 5.83 },
    "Bare Ground": { hectares: 25.65, percentage: 0.04 },
    Grass: { hectares: 23.37, percentage: 0.04 },
    Water: { hectares: 4.28, percentage: 0.01 },
  },
};

const kiharuLULCData2022: LULCData = {
  areaName: "Kiharu",
  level: "subcounty",
  year: 2022,
  classes: {
    Crop: { hectares: 29279.09, percentage: 73.72 },
    Road: { hectares: 5622.21, percentage: 14.15 },
    "Shrub & Scrub": { hectares: 3309.55, percentage: 8.33 },
    Building: { hectares: 2581.96, percentage: 6.5 },
    Trees: { hectares: 4205.41, percentage: 10.59 },
    Water: { hectares: 135.18, percentage: 0.34 },
    Grass: { hectares: 49.5, percentage: 0.12 },
    "Bare Ground": { hectares: 114.83, percentage: 0.29 },
  },
};

const gatangaLULCData2024: LULCData = {
  areaName: "Gatanga",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 253.25, percentage: 0.82 },
    Trees: { hectares: 27371.53, percentage: 88.22 },
    Crop: { hectares: 1797.91, percentage: 5.79 },
    Building: { hectares: 325.01, percentage: 1.05 },
    "Bare Ground": { hectares: 1257.74, percentage: 4.05 },
    Grass: { hectares: 20.32, percentage: 0.07 },
  },
};

const kandaraLULCData2024: LULCData = {
  areaName: "Kandara",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 0.27, percentage: 0.0 },
    Trees: { hectares: 3878.44, percentage: 30.53 },
    Crop: { hectares: 5832.11, percentage: 45.91 },
    Building: { hectares: 604.88, percentage: 4.76 },
    "Bare Ground": { hectares: 2365.11, percentage: 18.62 },
    Grass: { hectares: 23.67, percentage: 0.19 },
  },
};

const maragwaLULCData2024: LULCData = {
  areaName: "Maragwa",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 58.5, percentage: 0.2 },
    Trees: { hectares: 6404.61, percentage: 21.65 },
    Crop: { hectares: 15732.16, percentage: 53.18 },
    Building: { hectares: 1048.65, percentage: 3.54 },
    "Bare Ground": { hectares: 5612.66, percentage: 18.97 },
    Grass: { hectares: 726.92, percentage: 2.46 },
  },
};

const kiharuLULCData2024: LULCData = {
  areaName: "Kiharu",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 29.38, percentage: 0.09 },
    Trees: { hectares: 5663.0, percentage: 16.55 },
    Crop: { hectares: 19490.31, percentage: 56.94 },
    Building: { hectares: 1568.85, percentage: 4.58 },
    "Bare Ground": { hectares: 6864.53, percentage: 20.06 },
    Grass: { hectares: 610.66, percentage: 1.78 },
  },
};

const mathioyaLULCData2024: LULCData = {
  areaName: "Mathioya",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 0.02, percentage: 0.0 },
    Trees: { hectares: 30735.76, percentage: 65.83 },
    Crop: { hectares: 11356.3, percentage: 24.32 },
    Building: { hectares: 661.4, percentage: 1.42 },
    "Bare Ground": { hectares: 3893.61, percentage: 8.34 },
    Grass: { hectares: 42.33, percentage: 0.09 },
  },
};

const kangemaLULCData2024: LULCData = {
  areaName: "Kangema",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 0.17, percentage: 0.0 },
    Trees: { hectares: 30799.44, percentage: 69.9 },
    Crop: { hectares: 9572.76, percentage: 21.72 },
    Building: { hectares: 607.61, percentage: 1.38 },
    "Bare Ground": { hectares: 3050.61, percentage: 6.92 },
    Grass: { hectares: 33.03, percentage: 0.07 },
  },
};

const kigumoLULCData2024: LULCData = {
  areaName: "Kigumo",
  level: "subcounty",
  year: 2024,
  classes: {
    Water: { hectares: 259.71, percentage: 0.59 },
    Trees: { hectares: 31779.78, percentage: 72.37 },
    Crop: { hectares: 7602.57, percentage: 17.31 },
    Building: { hectares: 893.46, percentage: 2.03 },
    "Bare Ground": { hectares: 3334.24, percentage: 7.59 },
    Grass: { hectares: 44.06, percentage: 0.1 },
  },
};


// Define your layers here
const availableLayers: LayerConfig[] = [
  {
    id: 1,
    name: "KSA Microsoft AI4G (WMS)",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Counties:msai4g_lulc_muranga_aoi_final",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },

  {
  id: 2,
  name: "Muranga LULC 2024 KSA",
  url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
  layerName: "	Counties:LULC_MJF1 ",
  type: "WMS",
  style: {
    opacity: 0.8,
  },
},


  {
    id: 3,
    name: "crop type",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Counties:Crop classificatio Raster",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },
    {
    id: 4,
    name: "Kenya Subcounties",
    url: "data/sub_counties.geojson", 
    layerName: "subcounties",
    type: "WFS", 
    style: {
      fill: "rgba(255, 165, 0, 0.1)",
      stroke: "#ff6b35",
      strokeWidth: 2,
      opacity: 0.7,
    },
  },
  {
    id: 5,
    name: "GCI",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Counties:GCI ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },
  {
    id: 6,
    name: "NDVI",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: " 	Counties:NDVI ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },
  {
    id: 7,
    name: "NDWI",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Agriculture:NDWI_Muranaga_2024 ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },

  {
    id: 8,
    name: "GNDVI",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "	Agriculture:GNDVI_Muranga ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },

    {
    id: 9,
    name: "Elevation",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "	Counties:Elevation_Muranga ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },
    {
    id: 10,
    name: "Slope",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "	Counties:SlopeMuranga ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },
    {
    id: 11,
    name: "RainFall",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "	Counties:AnnualRainfall_2024Muranga ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },
    {
    id: 12,
    name: "Aspect",
    url: "https://geoserver-service-ksa.ksa.go.ke/geoserver/wms",
    layerName: "Counties:aspectMuranga ",
    type: "WMS",
    style: {
      opacity: 0.8,
    },
  },

];

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [currentLULCData, setCurrentLULCData] =
    useState<LULCData>(sampleLULCData2022);
  // State to manage active layers and their visibility
  const [activeLayers, setActiveLayers] = useState<ActiveLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [dashboardPosition, setDashboardPosition] = useState<
    "left" | "right" | "center"
  >("left");
  // New state for legend collapse
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  // const [tooltip, setTooltip] = useState<{
  //   coordinate: [number, number];
  //   content: string;
  // } | null>(null);
  const [overlayRef, setOverlayRef] = useState<Overlay | null>(null);

  // 2. Create a mapping object for subcounty data lookup
  const subcountyDataMap: { [key: string]: LULCData } = {
    kangema: kangemaLULCData2022,
    kigumo: kigumoLULCData2022,
    gatanga: gatangaLULCData2022,
    maragwa: maragwaLULCData2022,
    mathioya: mathioyaLULCData2022,
    kandara: kandaraLULCData2022,
    kiharu: kiharuLULCData2022,
  };


const subcountyDataMap2024: { [key: string]: LULCData } = {
  kangema: kangemaLULCData2024,
  kigumo: kigumoLULCData2024,
  gatanga: gatangaLULCData2024,
  maragwa: maragwaLULCData2024,
  mathioya: mathioyaLULCData2024,
  kandara: kandaraLULCData2024,
  kiharu: kiharuLULCData2024,
};






const getCurrentLULCDataMaps = (layerId: number | null) => {
  if (layerId === 2) { // Muranga LULC 2024 KSA
    return {
      countyData: sampleLULCData2024,
      subcountyMap: subcountyDataMap2024
    };
  } else { // Default to 2022 data (KSA Microsoft AI4G or others)
    return {
      countyData: sampleLULCData2022,
      subcountyMap: subcountyDataMap
    };
  }
};



  useEffect(() => {
    if (!mapRef.current) return;

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [baseLayer],
      view: new View({
        center: fromLonLat([37.15, -0.7832]),
        zoom: 10,
      }),
      controls: [
        new Attribution({
          collapsible: true,
          collapsed: false,
          className: "custom-attribution",
        }),
      ],
    });

    mapInstanceRef.current = mapInstance;

    // Create tooltip overlay
    const tooltipOverlay = new Overlay({
      element: document.createElement("div"),
      offset: [10, 0],
      positioning: "bottom-left",
    });

    tooltipOverlay.getElement()!.className =
      "bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50";
    mapInstance.addOverlay(tooltipOverlay);
    setOverlayRef(tooltipOverlay);

    // Show dashboard after map loads
    const timer = setTimeout(() => setIsDashboardVisible(true), 1000);

    return () => {
      clearTimeout(timer);
      mapInstance.setTarget(undefined);
    };
  }, []);
  // // Add the default layer (id: 1) on map initialization
  // const defaultLayer = availableLayers.find((layer) => layer.id === 1);
  // if (defaultLayer) {
  //   addLayer(defaultLayer);
  // }

  const createVectorStyle = (styleConfig?: LayerConfig["style"]) => {
    return new Style({
      fill: new Fill({
        color: styleConfig?.fill || "rgba(0, 0, 255, 0.1)",
      }),
      stroke: new Stroke({
        color: styleConfig?.stroke || "#0000ff",
        width: styleConfig?.strokeWidth || 2,
      }),
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: styleConfig?.fill || "rgba(0, 0, 255, 0.6)",
        }),
        stroke: new Stroke({
          color: styleConfig?.stroke || "#0000ff",
          width: styleConfig?.strokeWidth || 2,
        }),
      }),
    });
  };

const createWMSLayer = (layerConfig: LayerConfig, opacity: number = 0.8): TileLayer<TileWMS> => {
  return new TileLayer({
    source: new TileWMS({
      url: layerConfig.url,
      params: {
        LAYERS: layerConfig.layerName,
        FORMAT: "image/png",
        TRANSPARENT: true,
      },
      serverType: "geoserver",
      transition: 0,
    }),
    opacity: opacity,
  });
};

const createWFSLayer = (layerConfig: LayerConfig, opacity: number = 0.8): VectorLayer<VectorSource> | null => {
  // Check if this is our local GeoJSON layer
  if (layerConfig.id === 4) { // Changed from 7 to 8 based on your layer config
    return createLocalGeoJSONLayer(layerConfig, opacity);
  }

  // Original WFS logic for remote layers
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return `${
        layerConfig.url
      }?service=WFS&version=1.1.0&request=GetFeature&typename=${
        layerConfig.layerName
      }&outputFormat=application/json&srsname=EPSG:3857&bbox=${extent.join(
        ","
      )},EPSG:3857`;
    },
    strategy: bboxStrategy,
  });

  const layer = new VectorLayer({
    source: vectorSource,
    style: createVectorStyle(layerConfig.style),
  });

  layer.setOpacity(opacity);
  return layer;
};

const createLocalGeoJSONLayer = (
  layerConfig: LayerConfig,
  opacity: number = 0.8
): VectorLayer<VectorSource> => {
  const vectorSource = new VectorSource({
    url: layerConfig.url,
    format: new GeoJSON(),
  });

  const layer = new VectorLayer({
    source: vectorSource,
    style: createVectorStyle(layerConfig.style),
  });

  layer.setOpacity(opacity);

  // Add hover and click interactions
  if (mapInstanceRef.current && overlayRef) {
    const map = mapInstanceRef.current;

    const pointerMoveHandler = (evt: any) => {
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer === layer) return feature;
      });

      const target = map.getTarget();
      const targetElement = target instanceof Element ? target : null;

      if (feature) {
        const admen2 = feature.get("ADM2_EN") || "Unknown Area";
        const coordinate = evt.coordinate;

        overlayRef.setPosition(coordinate);
        overlayRef.getElement()!.innerHTML = `<strong>${admen2}</strong><br><small>Click to view data</small>`;
        overlayRef.getElement()!.style.display = "block";

        if (targetElement) {
          (targetElement as HTMLElement).style.cursor = "pointer";
        }
      } else {
        overlayRef.getElement()!.style.display = "none";
        if (targetElement) {
          (targetElement as HTMLElement).style.cursor = "";
        }
      }
    };

    const clickHandler = (evt: any) => {
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer === layer) return feature;
      });

      if (feature) {
        const subcountyName = feature.get("ADM2_EN");
        if (subcountyName) {
          const normalizedName = subcountyName.toLowerCase().trim();
          
          // Get current data maps based on selected layer
          const { countyData, subcountyMap } = getCurrentLULCDataMaps(selectedLayerId);
          
          // Look for matching LULC data
          const matchingData = subcountyMap[normalizedName];

          if (matchingData) {
            setCurrentLULCData(matchingData);
            setIsDashboardVisible(true);
            console.log(`Updated dashboard with ${matchingData.year} data for: ${subcountyName}`);
          } else {
            setCurrentLULCData(countyData);
            setIsDashboardVisible(true);
            console.log(`No specific data found for ${subcountyName}, showing ${countyData.year} county data`);
          }
        }
      }
    };

    map.on("pointermove", pointerMoveHandler);
    map.on("click", clickHandler);

    // Store both handlers for cleanup
    layer.set("pointerMoveHandler", pointerMoveHandler);
    layer.set("clickHandler", clickHandler);
  }

  return layer;
};

const addLayer = (layerConfig: LayerConfig) => {
  if (!mapInstanceRef.current) return;

  // Check if layer already exists
  const existingLayer = activeLayers.find((l) => l.id === layerConfig.id);
  if (existingLayer) return;

  const opacity = layerConfig.style?.opacity || 0.8;
  let olLayer: TileLayer<TileWMS> | VectorLayer<VectorSource>;

  // Create layer based on type
  switch (layerConfig.type) {
    case "WMS":
      olLayer = createWMSLayer(layerConfig, opacity);
      break;
    case "WFS":
      const wfsLayer = createWFSLayer(layerConfig, opacity);
      if (!wfsLayer) {
        console.error("Failed to create WFS layer");
        return;
      }
      olLayer = wfsLayer;
      break;
    default:
      console.error("Unknown layer type:", layerConfig.type);
      return;
  }

  mapInstanceRef.current.addLayer(olLayer);

  const newActiveLayer: ActiveLayer = {
    ...layerConfig,
    visible: true,
    opacity: opacity,
    olLayer: olLayer,
  };

  setActiveLayers((prev) => {
    // Double-check to prevent duplicates
    if (prev.some((l) => l.id === layerConfig.id)) return prev;
    return [...prev, newActiveLayer];
  });

  setSelectedLayerId(layerConfig.id);
  setIsDropdownOpen(false);

  // Show dashboard and set appropriate data when LULC layers are added
  if (layerConfig.id === 1 || layerConfig.id === 2) {
    setIsDashboardVisible(true);
    const { countyData } = getCurrentLULCDataMaps(layerConfig.id);
    setCurrentLULCData(countyData);
  }
};

  // 4. Update the removeLayer function to clean up click handlers
  const removeLayer = (layerId: number) => {
    if (!mapInstanceRef.current) return;

    const layerToRemove = activeLayers.find((l) => l.id === layerId);
    if (!layerToRemove || !layerToRemove.olLayer) return;

    // Clean up event handlers for local GeoJSON layer
    if (layerId === 4) {
      const pointerHandler = layerToRemove.olLayer.get("pointerMoveHandler");
      const clickHandler = layerToRemove.olLayer.get("clickHandler");

      if (pointerHandler) {
        mapInstanceRef.current.un("pointermove", pointerHandler);
      }
      if (clickHandler) {
        mapInstanceRef.current.un("click", clickHandler);
      }
    }

    // Remove the layer from the map immediately
    mapInstanceRef.current.removeLayer(layerToRemove.olLayer);

    // Update state to remove layer from active layers
    setActiveLayers((prev) => {
      const filteredLayers = prev.filter((l) => l.id !== layerId);
      return filteredLayers;
    });

    // Update selected layer if the removed layer was selected
    if (selectedLayerId === layerId) {
      const remainingLayers = activeLayers.filter((l) => l.id !== layerId);
      setSelectedLayerId(
        remainingLayers.length > 0 ? remainingLayers[0].id : null
      );
    }

    // Hide dashboard when MSAI4G layer (id: 1) is removed
    if (layerId === 1) {
      setIsDashboardVisible(false);
    }
  };

  // Update the toggleLayerVisibility function
const toggleLayerVisibility = (layerId: number) => {
  setActiveLayers((prev) =>
    prev.map((layer) => {
      if (layer.id === layerId && layer.olLayer) {
        const newVisible = !layer.visible;
        layer.olLayer.setVisible(newVisible);

        // Show/hide dashboard and update data when LULC layers visibility changes
        if (layerId === 1 || layerId === 2) {
          setIsDashboardVisible(newVisible);
          if (newVisible) {
            // Update to appropriate year data when layer becomes visible
            const { countyData } = getCurrentLULCDataMaps(layerId);
            setCurrentLULCData(countyData);
          }
        }

        return { ...layer, visible: newVisible };
      }
      return layer;
    })
  );
};
  const updateLayerOpacity = (layerId: number, opacity: number) => {
    setActiveLayers((prev) =>
      prev.map((layer) => {
        if (layer.id === layerId && layer.olLayer) {
          // This now works for ALL layers including default layer (id: 1)
          layer.olLayer.setOpacity(opacity);
          return { ...layer, opacity };
        }
        return layer;
      })
    );
  };

  const getLayerTypeIcon = (type: LayerType) => {
    switch (type) {
      case "WMS":
        return "🗺️";
      case "WFS":
        return "📍";
      default:
        return "📄";
    }
  };

  const getDashboardPositionClasses = () => {
    switch (dashboardPosition) {
      case "left":
        return "left-4 top-1/2 transform -translate-y-1/2";
      case "right":
        return "right-4 top-1/2 transform -translate-y-1/2";
      case "center":
        return "left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2";
      default:
        return "left-4 top-1/2 transform -translate-y-1/2";
    }
  };

  const selectedLayer = activeLayers.find((l) => l.id === selectedLayerId);

const resetToCountyData = () => {
  const { countyData } = getCurrentLULCDataMaps(selectedLayerId);
  setCurrentLULCData(countyData);
};
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Dashboard Controls - Top Left */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={resetToCountyData}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
        🌍  County View
        </button>
        <button
          onClick={() => setIsDashboardVisible(!isDashboardVisible)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-lg ${
            isDashboardVisible
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
        📊 {isDashboardVisible ? "Hide" : "Show"} Analytics
        </button>

        {isDashboardVisible && (
          <div className="flex gap-1 bg-white rounded-lg shadow-lg p-1">
            {(["left", "center", "right"] as const).map((position) => (
              <button
                key={position}
                onClick={() => setDashboardPosition(position)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  dashboardPosition === position
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {position === "left"
                  ? "⬅️"
                  : position === "center"
                  ? "⬆️"
                  : "➡️"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Layer Management Panel - Top Right */}
      <div className="absolute top-4 right-4 z-20 w-80">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/95">
          {/* Panel Header */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Layer Management
            </h3>
            <button
              onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isLayerPanelOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {isLayerPanelOpen && (
            <>
              {/* Add Layer Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-150 border-b border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PlusIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">Add Layer</span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto z-30">
                    {availableLayers
                      .filter(
                        (layer) =>
                          !activeLayers.some((al) => al.id === layer.id)
                      )
                      .map((layer) => (
                        <button
                          key={layer.id}
                          onClick={() => addLayer(layer)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getLayerTypeIcon(layer.type)}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-700 truncate">
                                {layer.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {layer.type}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    {availableLayers.filter(
                      (layer) => !activeLayers.some((al) => al.id === layer.id)
                    ).length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        All layers added
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Active Layers List */}
              <div className="max-h-96 overflow-y-auto">
                {activeLayers.map((layer) => (                  
                <div
                    key={layer.id}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      selectedLayerId === layer.id ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    {/* Layer Header */}
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2 min-w-0">
                        <button
                          onClick={() => setSelectedLayerId(layer.id)}
                          className="flex items-center space-x-2 flex-grow text-left min-w-0"
                        >
                          <span className="text-sm flex-shrink-0">
                            {getLayerTypeIcon(layer.type)}
                          </span>
                          <div className="flex flex-col min-w-0 flex-grow">
                            <span className="text-sm text-gray-900 truncate">
                              {layer.name}
                              {layer.id === 1 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                                  Default
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {layer.type}
                            </span>
                          </div>
                        </button>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {/* Visibility Toggle */}
                          <button
                            onClick={() => toggleLayerVisibility(layer.id)}
                            className={`p-1 rounded transition-colors flex-shrink-0 ${
                              layer.visible
                                ? "text-blue-600 hover:bg-blue-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={layer.visible ? "Hide layer" : "Show layer"}
                          >
                            {layer.visible ? (
                              <EyeIcon className="w-4 h-4" />
                            ) : (
                              <EyeSlashIcon className="w-4 h-4" />
                            )}
                          </button>

                          {/* Remove Layer - Now works for ALL layers including default (id: 1) */}
                          <button
                            onClick={() => removeLayer(layer.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                            title="Remove layer"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>

                          {/* Drag Handle */}
                          <div className="p-1 text-gray-400 cursor-move flex-shrink-0">
                            <Bars3Icon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Opacity Slider - Now works for ALL layers including default (id: 1) */}
                      {layer.visible && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Opacity</span>
                            <span>{Math.round(layer.opacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={layer.opacity}
                            onChange={(e) =>
                              updateLayerOpacity(
                                layer.id,
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {activeLayers.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No active layers. Add a layer to get started.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Selected Layer Info */}
        {selectedLayer && (
          <div className="mt-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">Selected Layer:</div>
              <div className="flex items-center space-x-2">
                <span>{getLayerTypeIcon(selectedLayer.type)}</span>
                <span>{selectedLayer.name}</span>
                {selectedLayer.id === 1 && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="mt-1 text-gray-500">
                Type: {selectedLayer.type} | Opacity:{" "}
                {Math.round(selectedLayer.opacity * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LULC Dashboard Overlay */}
      <div
        className={`absolute z-10 transition-all duration-700 ease-in-out ${
          isDashboardVisible
            ? `${getDashboardPositionClasses()} opacity-100 scale-100`
            : "left-4 top-1/2 transform -translate-y-1/2 opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          width: dashboardPosition === "center" ? "90vw" : "480px",
          maxWidth: dashboardPosition === "center" ? "1200px" : "480px",
          maxHeight: "calc(100vh - 120px)", // Account for navbar and padding
          overflow: "auto",
        }}
      >
        <div className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl border border-gray-200/50">
          <LULCDashboard data={currentLULCData} />
        </div>
      </div>

      {/* Collapsible Legend Panel - Bottom Left */}
      {selectedLayer && selectedLayer.type === "WMS" && (
        <div className="absolute bottom-4 left-4 z-10 max-w-xs">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Legend Header with Collapse Button */}
            <div className="px-3 py-2 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Legend</h3>
                <div className="text-xs text-gray-600 truncate max-w-48">
                  {selectedLayer.name}
                </div>
              </div>
              <button
                onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                title={isLegendCollapsed ? "Expand legend" : "Collapse legend"}
              >
                {isLegendCollapsed ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronUpIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Legend Content - Collapsible */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isLegendCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
              }`}
            >
              <div className="p-3">
                <img
                  src={`${selectedLayer.url}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${selectedLayer.layerName}&STYLE=&LEGEND_OPTIONS=fontAntiAliasing:true;fontSize:12;fontColor:0x333333`}
                  alt={`Legend for ${selectedLayer.name}`}
                  className="max-w-full h-auto"
                  onError={(e) => {
                    console.error("Legend failed to load");
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `,
        }}
      />
    </div>
  );
};

export default MapView;
