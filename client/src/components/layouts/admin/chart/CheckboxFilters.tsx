import React, { useState } from 'react';
import Chart from './chart';

const CheckboxFilters = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('desktop');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <div>
      <div id="devices">
        <label>
          <input
            type="checkbox"
            value="desktop"
            checked={selectedDevice === 'desktop'}
            onChange={handleCheckboxChange}
          />
          Desktop
        </label>
        <label>
          <input
            type="checkbox"
            value="tablet"
            checked={selectedDevice === 'tablet'}
            onChange={handleCheckboxChange}
          />
          Tablet
        </label>
        <label>
          <input
            type="checkbox"
            value="mobile"
            checked={selectedDevice === 'mobile'}
            onChange={handleCheckboxChange}
          />
          Mobile
        </label>
      </div>

      <Chart />
    </div>
  );
};

export default CheckboxFilters;
