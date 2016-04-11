import L from 'leaflet';
import TransformPolygonWithImageOverlay from './feature/TransformPolygonWithImageOverlay';
import TransformImageOverlay from './feature/TransformImageOverlay';
import TransformPolygonWithMarkers from './feature/TransformPolygonWithMarkers';
import DoublePolygon from './draw/handler/DoublePolygon';
import DoublePolyline from './draw/handler/DoublePolyline';

L.TransformPolygonWithImageOverlay = TransformPolygonWithImageOverlay;
L.TransformImageOverlay = TransformImageOverlay;
L.TransformPolygonWithMarkers = TransformPolygonWithMarkers;
L.DoublePolygon = DoublePolygon;
L.DoublePolyline = DoublePolyline;

window.L = L;
