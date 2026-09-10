import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Parcel, Project, RiskLevel } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Filter, Layers, MapPin, ZoomIn, ZoomOut, AlertTriangle, Eye } from 'lucide-react';

interface GISMapProps {
  parcels: Parcel[];
  projects: Project[];
  selectedParcelId?: string;
  onSelectParcel: (parcel: Parcel) => void;
  highlightCriticalZones?: boolean;
}

export const GISMap: React.FC<GISMapProps> = ({
  parcels,
  projects,
  selectedParcelId,
  onSelectParcel,
  highlightCriticalZones = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showZones, setShowZones] = useState<boolean>(highlightCriticalZones);

  // Derive districts
  const districts = Array.from(new Set(parcels.map(p => p.district)));

  // Color mapping
  const getMarkerColor = (level: RiskLevel): string => {
    switch (level) {
      case 'LOW':
        return '#059669'; // Emerald 600
      case 'MEDIUM':
        return '#d97706'; // Amber 600
      case 'HIGH':
        return '#ea580c'; // Orange 600
      case 'CRITICAL':
        return '#dc2626'; // Red 600
      default:
        return '#64748b';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Maharashtra / Western Corridor (18.8, 73.8) by default
      const map = L.map(mapContainerRef.current, {
        center: [18.735, 73.684],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // Add CartoDB Positron / OSM tiles for clean cartographic style
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Create layer groups
      markersLayerRef.current = L.layerGroup().addTo(map);
      zonesLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Clusters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !zonesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    zonesLayerRef.current.clearLayers();

    // Filter parcels
    const filtered = parcels.filter(parcel => {
      const matchProject = filterProject === 'all' || parcel.projectId === filterProject;
      const matchRisk = filterRisk === 'all' || parcel.riskCategory === filterRisk;
      const matchDistrict = filterDistrict === 'all' || parcel.district === filterDistrict;
      const matchSearch =
        searchQuery === '' ||
        parcel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.landownerName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchProject && matchRisk && matchDistrict && matchSearch;
    });

    // Draw Critical Zones (Clusters of high/critical risk)
    if (showZones) {
      // Hotspot 1: Maval Corridor
      const mavalZone = L.circle([18.732, 73.678], {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5',
        radius: 4500
      });
      mavalZone.bindTooltip('<b>CRITICAL RISK ZONE #1</b><br/>Talegaon - Urse Corridor (NH-48)<br/>6 High/Critical Parcels Contiguous', {
        permanent: false,
        direction: 'top'
      });
      zonesLayerRef.current.addLayer(mavalZone);

      // Hotspot 2: Boisar FRA Corridor
      const boisarZone = L.circle([19.802, 72.758], {
        color: '#ea580c',
        fillColor: '#f97316',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '5, 5',
        radius: 3800
      });
      boisarZone.bindTooltip('<b>CRITICAL RISK ZONE #2</b><br/>Boisar FRA Clearance Hub (DFC)<br/>3 Delayed Right-of-Way Parcels', {
        permanent: false,
        direction: 'top'
      });
      zonesLayerRef.current.addLayer(boisarZone);
    }

    // Add Parcel Markers
    filtered.forEach(parcel => {
      const isSelected = parcel.id === selectedParcelId;
      const color = getMarkerColor(parcel.riskCategory);

      // Custom SVG Circle Marker
      const customIcon = L.divIcon({
        className: 'custom-gis-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '26px' : '20px'};
            height: ${isSelected ? '26px' : '20px'};
            background-color: ${color};
            border: ${isSelected ? '3px solid #0f2942' : '2px solid #ffffff'};
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <span style="color: #ffffff; font-size: 9px; font-weight: bold; font-family: monospace;">
              ${parcel.riskScore}
            </span>
          </div>
        `,
        iconSize: isSelected ? [26, 26] : [20, 20],
        iconAnchor: isSelected ? [13, 13] : [10, 10]
      });

      const marker = L.marker([parcel.lat, parcel.lng], { icon: customIcon });

      // Popup Content per specification:
      // Parcel ID, Village, Landowner status, Acquisition stage, Risk score, Predicted delay, Main risk factor, Recommended action
      const mainFactor = parcel.topRiskFactors[0]?.name || 'Pending Review';
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; color: #1e293b; min-width: 240px; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="font-size: 13px; color: #0f2942;">Parcel ${parcel.id}</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; background: ${color}20; color: ${color}; border: 1px solid ${color}; text-transform: uppercase;">
              ${parcel.riskCategory} (${parcel.riskScore}/100)
            </span>
          </div>
          <div style="margin-bottom: 3px;"><strong>Project:</strong> ${parcel.projectName}</div>
          <div style="margin-bottom: 3px;"><strong>Village / District:</strong> ${parcel.village}, ${parcel.district}</div>
          <div style="margin-bottom: 3px;"><strong>Landowner Status:</strong> ${parcel.landownerStatus}</div>
          <div style="margin-bottom: 3px;"><strong>Acquisition Stage:</strong> ${parcel.stage}</div>
          <div style="margin-bottom: 3px;"><strong>Predicted Delay:</strong> <span style="color: #dc2626; font-weight: bold;">+${parcel.expectedDelayDays} days</span> (${parcel.delayProbability}% prob)</div>
          <div style="margin-bottom: 3px;"><strong>Primary Risk Driver:</strong> ${mainFactor} (${parcel.topRiskFactors[0]?.weight || 0}%)</div>
          <div style="margin-top: 6px; padding: 6px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 11px; color: #334155;">
            <strong>Recommended Action:</strong><br/>
            ${parcel.recommendedAction}
          </div>
          <div style="margin-top: 8px; text-align: right;">
            <button id="btn-popup-inspect-${parcel.id}" style="background: #0f2942; color: #ffffff; border: none; padding: 4px 10px; font-size: 11px; cursor: pointer;">
              Inspect Full Analytics →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const inspectBtn = document.getElementById(`btn-popup-inspect-${parcel.id}`);
        if (inspectBtn) {
          inspectBtn.onclick = () => {
            onSelectParcel(parcel);
          };
        }
      });

      marker.on('click', () => {
        onSelectParcel(parcel);
      });

      markersLayerRef.current?.addLayer(marker);

      // Focus if selected
      if (isSelected) {
        map.setView([parcel.lat, parcel.lng], 13, { animate: true });
        marker.openPopup();
      }
    });
  }, [parcels, filterProject, filterRisk, filterDistrict, searchQuery, showZones, selectedParcelId, onSelectParcel]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => mapInstanceRef.current?.setView([18.735, 73.684], 11);

  return (
    <div className="bg-white border border-slate-300 shadow-xs flex flex-col">
      {/* Top Map Toolbar & Filters */}
      <div className="p-3 bg-slate-100 border-b border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
            <Filter className="w-4 h-4 text-[#0f2942]" />
            <span>GIS Filters:</span>
          </div>

          {/* Project Filter */}
          <select
            id="gis-filter-project"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            aria-label="Filter by Project"
            className="bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-xs focus:ring-1 focus:ring-blue-800 focus:outline-none"
          >
            <option value="all">All Infrastructure Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}: {p.name.length > 30 ? p.name.substring(0, 30) + '...' : p.name}
              </option>
            ))}
          </select>

          {/* District Filter */}
          <select
            id="gis-filter-district"
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            aria-label="Filter by District"
            className="bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-xs focus:ring-1 focus:ring-blue-800 focus:outline-none"
          >
            <option value="all">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            id="gis-filter-risk"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            aria-label="Filter by Risk Category"
            className="bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-xs focus:ring-1 focus:ring-blue-800 focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="CRITICAL">Critical (81–100)</option>
            <option value="HIGH">High (61–80)</option>
            <option value="MEDIUM">Medium (31–60)</option>
            <option value="LOW">Low (0–30)</option>
          </select>
        </div>

        {/* Search & Layers toggle */}
        <div className="flex items-center gap-2">
          <input
            id="gis-search-input"
            type="text"
            placeholder="Search parcel, village, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-xs w-48 text-xs focus:ring-1 focus:ring-blue-800 focus:outline-none"
          />

          <button
            id="btn-toggle-critical-zones"
            onClick={() => setShowZones(!showZones)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xs border text-xs font-medium transition ${
              showZones
                ? 'bg-red-50 text-red-800 border-red-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Toggle spatial clustering of high-delay risk parcels"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Critical Hotspot Zones</span>
          </button>
        </div>
      </div>

      {/* Map Container Area */}
      <div className="relative w-full h-[520px] bg-slate-200">
        <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1 bg-white border border-slate-300 shadow-sm p-1 rounded-xs">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-100 text-slate-700 border-b border-slate-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-100 text-slate-700 border-b border-slate-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 hover:bg-slate-100 text-slate-700 text-[10px] font-mono font-bold"
            title="Reset to Corridor View"
          >
            RESET
          </button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-300 p-3 shadow-md text-xs max-w-xs">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 uppercase text-[11px] tracking-wider">
            Risk Classification Legend
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
                <span className="text-slate-700">Critical Risk (81–100)</span>
              </div>
              <span className="font-mono text-slate-500 font-medium">Immediate Blockage</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                <span className="text-slate-700">High Risk (61–80)</span>
              </div>
              <span className="font-mono text-slate-500 font-medium">Imminent Delay</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="text-slate-700">Medium Risk (31–60)</span>
              </div>
              <span className="font-mono text-slate-500 font-medium">Monitoring</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                <span className="text-slate-700">Low Risk (0–30)</span>
              </div>
              <span className="font-mono text-slate-500 font-medium">On Schedule</span>
            </div>
          </div>

          {showZones && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-red-700 flex items-center space-x-1 font-medium">
              <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
              <span>Dashed Circles: Contiguous delay hotspots</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
