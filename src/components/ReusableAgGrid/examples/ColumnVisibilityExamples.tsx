import React from 'react';
import { ReusableAgGrid, createGridConfig, createGridColumn } from '../index';

// Sample data for examples
interface SampleData {
  id: number;
  name: string;
  age: number;
  city: string;
  status: string;
}

const sampleData: SampleData[] = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York', status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 25, city: 'London', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', age: 35, city: 'Paris', status: 'Active' }
];

const sampleColumns = [
  createGridColumn<SampleData>('id', 'ID', { width: 80 }),
  createGridColumn<SampleData>('name', 'Name', { width: 150 }),
  createGridColumn<SampleData>('age', 'Age', { width: 100 }),
  createGridColumn<SampleData>('city', 'City', { width: 120 }),
  createGridColumn<SampleData>('status', 'Status', { width: 100 })
];

export const ColumnVisibilityExamples: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Column Visibility Control Examples</h2>
      
      {/* Example 1: Icon Button (Left) */}
      <div style={{ marginBottom: '40px' }}>
        <h3>1. Icon Button (Left Aligned)</h3>
        <p>Compact icon button with visible column count badge, positioned on the left.</p>
        <ReusableAgGrid<SampleData>
          data={sampleData}
          columns={sampleColumns}
          config={createGridConfig({
            columnVisibilityButtonVariant: 'icon',
            columnVisibilityButtonPosition: 'left',
            pagination: false
          })}
        />
      </div>

      {/* Example 2: Text Button (Right) */}
      <div style={{ marginBottom: '40px' }}>
        <h3>2. Text Button (Right Aligned)</h3>
        <p>Text-only button with custom label, positioned on the right.</p>
        <ReusableAgGrid<SampleData>
          data={sampleData}
          columns={sampleColumns}
          config={createGridConfig({
            columnVisibilityButtonVariant: 'text',
            columnVisibilityButtonPosition: 'right',
            columnVisibilityButtonText: 'Configure Columns',
            pagination: false
          })}
        />
      </div>

      {/* Example 3: Both Icon and Text (Default) */}
      <div style={{ marginBottom: '40px' }}>
        <h3>3. Icon + Text Button (Default)</h3>
        <p>Combined icon and text button with visible/total count display.</p>
        <ReusableAgGrid<SampleData>
          data={sampleData}
          columns={sampleColumns}
          config={createGridConfig({
            columnVisibilityButtonVariant: 'both',
            columnVisibilityButtonPosition: 'left',
            columnVisibilityButtonText: 'Manage Columns',
            pagination: false
          })}
        />
      </div>

      {/* Example 4: Custom Styling */}
      <div style={{ marginBottom: '40px' }}>
        <h3>4. Custom Styling Example</h3>
        <p>You can also pass custom styles via props for more control.</p>
        <ReusableAgGrid<SampleData>
          data={sampleData}
          columns={sampleColumns}
          config={createGridConfig({
            columnVisibilityButtonVariant: 'both',
            columnVisibilityButtonPosition: 'left',
            columnVisibilityButtonText: 'Custom',
            pagination: false
          })}
        />
      </div>
    </div>
  );
};

export default ColumnVisibilityExamples;
