import './App.css'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import GridExample from './components/GridExample';
import CarGrid from './CarGrid';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      color: '#213547' 
    }}>
      {/* <GridExample /> */}
      <CarGrid />
    </div>
  )
}

export default App
