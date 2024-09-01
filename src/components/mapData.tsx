import React, { useEffect, useRef, useState } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css'; // Import CSS if needed
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';

interface MapDataProps {
  lon: number;
  lat: number;
}

const MAPTILER_API_KEY = import.meta.env.VITE_MAP_KEY;

const MapData: React.FC<MapDataProps> = ({ lon, lat }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [pointerData, setPointerData] = useState<string>('');
  const [timeText, setTimeText] = useState<string>('');
  const weatherLayerRef = useRef<maptilerweather.PrecipitationLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    maptilersdk.config.apiKey = MAPTILER_API_KEY;
    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.BACKDROP,
      zoom: 2,
      center: [lon, lat],
      hash: true,
    });

    const weatherLayer = new maptilerweather.PrecipitationLayer();
    weatherLayerRef.current = weatherLayer;

    map.on('load', () => {
      map.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.4)");
      map.addLayer(weatherLayer, 'Water');

      // Start animation loop
      const animate = () => {
        refreshTime();
        updatePointerValue(map.getCenter());
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });

    map.on('mousemove', (e: maptilersdk.MapMouseEvent) => {
      updatePointerValue(e.lngLat);
    });

    map.on('mouseout', (evt: maptilersdk.MapMouseEvent) => {
      if (!evt.originalEvent.relatedTarget) {
        setPointerData("");
      }
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      weatherLayerRef.current = null;
    };
  }, [lon, lat]);

  const refreshTime = () => {
    if (!weatherLayerRef.current) return;
    const d = weatherLayerRef.current.getAnimationTimeDate(); 
    setTimeText(d.toString());
  };

  const updatePointerValue = (lngLat: maptilersdk.LngLat) => {
    if (!weatherLayerRef.current) return;
    const value = weatherLayerRef.current.pickAt(lngLat.lng, lngLat.lat);
    if (!value) {
      setPointerData("");
      return;
    }
    setPointerData(`${value.value.toFixed(1)} mm`);
  };

  return (
    <div className='w-full h-full rounded-3xl overflow-hidden relative opacity-70'>
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-3/5 bg-black text-white text-center py-4 z-10">
        <span className="text-xs font-semibold">{timeText}</span>
      </div>
      <div className="fixed top-0 left-0 p-2 text-white text-xl font-medium z-10">
        Precipitation
      </div>
      <div className="fixed top-12 left-0 p-2 text-white text-lg font-bold z-10">
        {pointerData}
      </div>
      <div
        ref={mapContainerRef}
        className="absolute top-0 bottom-0 w-full h-full"
      ></div>
    </div>
  );
};

export default MapData;
