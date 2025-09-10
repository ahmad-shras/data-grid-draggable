import './App.css'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import GridExample from './components/GridExample';
import CarGrid from './CarGrid';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  return (

    <>
    
    {/* <GridExample /> */}
    <CarGrid />
    </>
  )
}

export default App
