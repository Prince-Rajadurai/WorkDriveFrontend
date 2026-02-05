import React from 'react';
import moment from 'moment-timezone';

function Timezone() {
  const timezones = moment.tz.names();

  return (
    <div>
      <label htmlFor="timezone">Select Timezone: </label>
      <select name="timezone" id="timezone">
        {timezones.map((zone) => (
          <option key={zone} value={zone}>
            {zone.replace('_', ' ').replace('/', ' - ')}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Timezone;
