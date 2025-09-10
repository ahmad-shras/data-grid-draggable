import './App.css'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import GridExample from './components/GridExample';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  return (

    <>
    
    <GridExample />
    
    </>
  )
}

export default App
