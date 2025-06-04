// // src/components/LayerControl.tsx
// import React from "react";
// import { useMapContext } from "../context/MapContext";

// const LayerControl: React.FC = () => {
//   const { layers, toggleLayerVisibility } = useMapContext();

//   return (
//     <div className="absolute top-4 left-4 bg-white p-3 shadow rounded z-10">
//       <h4 className="font-bold mb-2">Layer Control</h4>
//       {layers.map((layer) => (
//         <div key={layer.name}>
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={layer.visible}
//               onChange={() => toggleLayerVisibility(layer.name)}
//             />
//             <span>{layer.name}</span>
//           </label>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LayerControl;
