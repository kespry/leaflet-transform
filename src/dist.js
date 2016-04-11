import L from 'leaflet';
import TransformPolygonWithImageOverlay from './feature/TransformPolygonWithImageOverlay';
import TransformImageOverlay from './feature/TransformImageOverlay';
import TransformPolygonWithMarkers from './feature/TransformPolygonWithMarkers';
import DoublePolygon from './draw/handler/DoublePolygon';

L.TransformPolygonWithImageOverlay = TransformPolygonWithImageOverlay;
L.TransformImageOverlay = TransformImageOverlay;
L.TransformPolygonWithMarkers = TransformPolygonWithMarkers;
L.DoublePolygon = DoublePolygon;

window.L = L;
