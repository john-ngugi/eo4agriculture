// src/components/WMSLayer.tsx
import { useEffect } from "react";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import { Map as OLMap } from "ol";

interface WMSLayerProps {
  map: OLMap | null;
  name: string;
  url: string;
  layerName: string;
}

const WMSLayer: React.FC<WMSLayerProps> = ({ map, name, url, layerName }) => {
  useEffect(() => {
    if (!map) return;

    const layer = new ImageLayer({
      source: new ImageWMS({
        url,
        params: { LAYERS: layerName, TILED: true },
        ratio: 1,
        serverType: "geoserver",
      }),
      visible: true,
      opacity: 0.8,
      // title: name,
    });

    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, url, layerName, name]);

  return null;
};

export default WMSLayer;
