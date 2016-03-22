import L from 'leaflet';
import TransformPolygonWithImageOverlay from './feature/TransformPolygonWithImageOverlay';
import TransformImageOverlay from './feature/TransformImageOverlay';
import TransformPolygonWithMarkers from './feature/TransformPolygonWithMarkers';

L.TransformPolygonWithImageOverlay = TransformPolygonWithImageOverlay;
L.TransformImageOverlay = TransformImageOverlay;
L.TransformPolygonWithMarkers = TransformPolygonWithMarkers;

window.L = L;
