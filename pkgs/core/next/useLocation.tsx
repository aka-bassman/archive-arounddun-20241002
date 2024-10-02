import { Geolocation } from "@capacitor/geolocation";

export const useLocation = () => {
  const checkPermission = async () => {
    const { location: geolocation, coarseLocation } = await Geolocation.requestPermissions();
    return { geolocation, coarseLocation };
  };

  const getPosition = async () => {
    const { geolocation, coarseLocation } = await checkPermission();
    if (geolocation === "denied" || coarseLocation === "denied") {
      location.assign("app-settings:");
      return;
    }
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  };

  return {
    checkPermission,
    getPosition,
  };
};
