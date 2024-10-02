"use client";
import { GoogleMap, type Libraries, useJsApiLoader } from "@react-google-maps/api";
import { clsx } from "@core/client";
import { cnst, fetch } from "@util";
import { useEffect, useState } from "react";

export interface GoogleProps {
  id?: string;
  className?: string;
  mapKey: string;
  onClick?: (coordinate: cnst.Coordinate) => void;
  onRightClick?: (coordinate: cnst.Coordinate) => void;
  center?: cnst.Coordinate;
  onChangeCenter?: (coordinate: cnst.Coordinate) => void;
  zoom?: number;
  onChangeZoom?: (zoom: number) => void;
  bounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number } | null;
  onLoad?: () => void;
  onMouseMove?: (coordinate: cnst.Coordinate, e: google.maps.MapMouseEvent) => void;
  options?: google.maps.MapOptions;
  children: any;
}
const libraries: Libraries = ["core", "maps", "marker"];
export default function Google({
  id,
  className,
  mapKey,
  onClick,
  onRightClick,
  center = { type: "Point", coordinates: [127.0016985, 37.5642135], altitude: 0 },
  onChangeCenter,
  zoom,
  onChangeZoom,
  bounds,
  onLoad,
  onMouseMove,
  options,
  children,
}: GoogleProps) {
  const { isLoaded } = useJsApiLoader({
    id: id ?? "google-map-container",
    googleMapsApiKey: mapKey,
    version: "3.56.11",
    libraries,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Set center
  useEffect(() => {
    const currentCenter = map?.getCenter();
    if (!map || !currentCenter) return;
    const [lng, lat] = [currentCenter.lng(), currentCenter.lat()];
    if (center.coordinates[0] === lng && center.coordinates[1] === lat) return;
    else map.setCenter({ lat: center.coordinates[1], lng: center.coordinates[0] });
  }, [center, map]);

  // Set zoom
  useEffect(() => {
    if (!map) return;
    const currentZoom = map.getZoom();
    if (zoom === currentZoom) return;
    map.setZoom(zoom ?? 15);
  }, [zoom, map]);

  // Change bounds
  useEffect(() => {
    if (!map || !bounds) return;
    const latLngs = [
      { lat: bounds.minLat, lng: bounds.minLng },
      { lat: bounds.maxLat, lng: bounds.maxLng },
    ];
    map.fitBounds(new google.maps.LatLngBounds(...latLngs));
  }, [bounds, map]);

  return isLoaded ? (
    <GoogleMap
      id="google-map-container"
      mapContainerClassName={clsx("h-72 w-full", className)}
      onLoad={(mapInstance) => {
        if (map) return;
        setMap(mapInstance);
        mapInstance.setCenter({ lat: center.coordinates[1], lng: center.coordinates[0] });
        mapInstance.setZoom(zoom ?? 15);
        onLoad?.();
      }}
      onClick={(e) => {
        if (!e.latLng) return;
        return onClick?.(
          fetch.crystalizeCoordinate({
            type: "Point",
            coordinates: [e.latLng.lng(), e.latLng.lat()],
            altitude: center.altitude,
          })
        );
      }}
      onRightClick={(e) => {
        if (!e.latLng) return;
        return onRightClick?.(
          fetch.crystalizeCoordinate({
            type: "Point",
            coordinates: [e.latLng.lng(), e.latLng.lat()],
            altitude: center.altitude,
          })
        );
      }}
      onCenterChanged={() => {
        const currentCenter = map?.getCenter();
        if (!currentCenter) return;
        const [lng, lat] = [currentCenter.lng(), currentCenter.lat()];
        if (center.coordinates[0] === lng && center.coordinates[1] === lat) return;
        else
          return onChangeCenter?.(
            fetch.crystalizeCoordinate({ type: "Point", coordinates: [lng, lat], altitude: center.altitude })
          );
      }}
      onZoomChanged={() => {
        const currentZoom = map?.getZoom();
        if (!currentZoom || zoom === currentZoom) return;
        else return onChangeZoom?.(currentZoom);
      }}
      options={options}
      onMouseMove={(e) => {
        if (!e.latLng) return;
        const [lng, lat] = [e.latLng.lng(), e.latLng.lat()];
        const coordinate = fetch.crystalizeCoordinate({
          type: "Point",
          coordinates: [lng, lat],
          altitude: center.altitude,
        });
        onMouseMove?.(coordinate, e);
      }}
    >
      {children}
    </GoogleMap>
  ) : null;
}
