// DirectionsDisplay.js
import React from 'react';
import { DirectionsRenderer } from '@react-google-maps/api';

const DirectionsDisplay = ({ directions }) => {
  return directions ? <DirectionsRenderer directions={directions} /> : null;
};

export default DirectionsDisplay;
