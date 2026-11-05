import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Ticket, UserLocation } from '../types/civic';

interface InteractiveMapProps {
  tickets: Ticket[];
  userLocation: UserLocation | null;
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  onInspectTicket: (ticket: Ticket) => void;
  onUpvoteTicket: (ticketId: string) => void;
  heightClass?: string;
  focusLocationTrigger?: number; // increments when user clicks "Center on Me"
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  tickets,
  userLocation,
  selectedTicket,
  onSelectTicket,
  onInspectTicket,
  onUpvoteTicket,
  heightClass = 'h-[460px]',
  focusLocationTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const proximityRadiusRef = useRef<L.Circle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // 1. Esri Satellite
    const esriSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and GIS User Community',
        maxZoom: 19,
        crossOrigin: 'anonymous',
      }
    );

    // 2. Esri Hybrid Layer Group
    const esriHybrid = L.layerGroup([
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, crossOrigin: 'anonymous' }
      ),
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, crossOrigin: 'anonymous' }
      ),
    ]);

    // 3. OpenStreetMap
    const osmStreet = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | CivixAI Vizag',
        maxZoom: 19,
        crossOrigin: 'anonymous',
      }
    );

    // Visakhapatnam center default
    const map = L.map(mapContainerRef.current, {
      center: [17.7385, 83.325],
      zoom: 13,
      layers: [esriSatellite],
    });

    mapInstanceRef.current = map;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Base & Overlay Controls
    const baseMaps = {
      '🛰️ Satellite (Esri)': esriSatellite,
      '🛰️ Satellite + Labels': esriHybrid,
      '🗺️ Street Map': osmStreet,
    };

    const overlayMaps = {
      '📍 Civic Hazards': markersGroup,
    };

    L.control
      .layers(baseMaps, overlayMaps, {
        position: 'topright',
        collapsed: false,
      })
      .addTo(map);

    // Delay resize invalidation for smooth layout render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Hazard Markers when tickets change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    tickets.forEach((ticket) => {
      const isResolved = ticket.status === 'Resolved (Photo Verified)';
      const isInProgress = ticket.status === 'In Progress';
      const isCritical = ticket.urgencyLevel === 'Critical';

      const pinColor = isResolved
        ? '#16a34a' // emerald-600
        : isCritical
        ? '#dc2626' // red-600
        : isInProgress
        ? '#d97706' // amber-600
        : '#0284c7'; // sky-600

      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <span style="width: 7px; height: 7px; background: white; border-radius: 50%;"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([ticket.latitude, ticket.longitude], {
        icon: pinIcon,
      });

      marker.on('click', () => {
        onSelectTicket(ticket);
      });

      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '220px';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 2px;">
          ${ticket.id} · ${ticket.zone}
        </div>
        <div style="font-weight: 800; font-size: 13px; line-height: 1.3; color: #0f172a; margin-bottom: 4px;">
          ${ticket.title}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
          📍 ${ticket.address}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 11px;">
          <span style="font-weight: 700; color: ${pinColor};">● ${ticket.status}</span>
          <span style="font-weight: 800; color: #dc2626;">${ticket.urgencyScore} / 10 Urgency</span>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 6px;">
          <button id="btn-upvote-${ticket.id}" style="
            flex: 1;
            padding: 4px 8px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            color: #334155;
            cursor: pointer;
          ">👍 Upvote (${ticket.upvotes})</button>
          <button id="btn-inspect-${ticket.id}" style="
            flex: 1;
            padding: 4px 8px;
            background: #0284c7;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            color: white;
            cursor: pointer;
          ">Audit Proof</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const upvoteBtn = document.getElementById(`btn-upvote-${ticket.id}`);
        const inspectBtn = document.getElementById(`btn-inspect-${ticket.id}`);
        if (upvoteBtn) {
          upvoteBtn.onclick = (e) => {
            e.stopPropagation();
            onUpvoteTicket(ticket.id);
          };
        }
        if (inspectBtn) {
          inspectBtn.onclick = (e) => {
            e.stopPropagation();
            onInspectTicket(ticket);
          };
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [tickets, onSelectTicket, onInspectTicket, onUpvoteTicket]);

  // Update User Live Location Marker & Radar Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.remove();
        accuracyCircleRef.current = null;
      }
      if (proximityRadiusRef.current) {
        proximityRadiusRef.current.remove();
        proximityRadiusRef.current = null;
      }
      return;
    }

    const { lat, lng, accuracy, heading, mode } = userLocation;

    // Heading arrow SVG or round center
    const rotationDeg = heading ?? 0;
    const isSimulated = mode === 'simulated';

    const userHtml = `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div class="radar-wave" style="
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(14, 165, 233, 0.45);
        "></div>
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${isSimulated ? '#8b5cf6' : '#0284c7'};
          border: 3px solid white;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(${rotationDeg}deg);
        ">
          <div style="
            width: 0;
            height: 0;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-bottom: 7px solid white;
            margin-bottom: 1px;
          "></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'user-live-pin',
      html: userHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([lat, lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      userMarkerRef.current.bindTooltip(
        isSimulated ? 'Simulated Commuter Position' : 'Your Live GPS Location',
        { permanent: false, direction: 'top', offset: [0, -14] }
      );
    } else {
      userMarkerRef.current.setLatLng([lat, lng]);
      userMarkerRef.current.setIcon(userIcon);
    }

    // 200m Proximity Deduplication Radar Circle
    if (!proximityRadiusRef.current) {
      proximityRadiusRef.current = L.circle([lat, lng], {
        radius: 200, // 200 metres
        color: '#0284c7',
        weight: 1.5,
        dashArray: '4, 6',
        fillColor: '#38bdf8',
        fillOpacity: 0.08,
      }).addTo(map);
    } else {
      proximityRadiusRef.current.setLatLng([lat, lng]);
    }

    // Accuracy Circle
    if (accuracy && accuracy > 10) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle([lat, lng], {
          radius: Math.min(accuracy, 150),
          color: '#0ea5e9',
          weight: 1,
          fillColor: '#0ea5e9',
          fillOpacity: 0.12,
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng([lat, lng]);
        accuracyCircleRef.current.setRadius(Math.min(accuracy, 150));
      }
    } else if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
      accuracyCircleRef.current = null;
    }
  }, [userLocation]);

  // Center on Selected Ticket
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedTicket) return;

    map.flyTo([selectedTicket.latitude, selectedTicket.longitude], 15, {
      duration: 1.2,
    });
  }, [selectedTicket]);

  // Handle "Center on Me" triggers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation || !focusLocationTrigger) return;

    map.flyTo([userLocation.lat, userLocation.lng], 16, {
      duration: 1.2,
    });
  }, [focusLocationTrigger, userLocation]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 shadow-sm`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
