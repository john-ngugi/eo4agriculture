import "./App.css";
import { MapProvider } from "./context/MapProvider";
import MainPage from "./Pages";

function App() {
  return (
    <MapProvider>
      <MainPage />
    </MapProvider>
  );
}
export default App;
