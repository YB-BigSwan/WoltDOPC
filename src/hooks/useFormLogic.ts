import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchVenueStaticData,
  fetchVenueDynamicData,
} from "@/services/venueService";
import { getDistance } from "geolib";

export const useFormLogic = () => {
  const [venueSlug, setVenueSlug] = useState<string>("");
  const [cartValue, setCartValue] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 0,
    lng: 0,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryDistance, setDeliveryDistance] = useState<number>(0);
  const [smallOrderSurcharge, setSmallOrderSurcharge] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { toast } = useToast();

  // Validation
  const validateVenueSlug = (slug: string) => {
    const regex = /^[a-z0-9-]+$/;
    return regex.test(slug);
  };

  const validateCartValue = (value: number) => {
    const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (cartValue != 0) {
      return regex.test(value.toString());
    }
    return false;
  };

  const validateLatitude = (lat: number) => lat >= -90 && lat <= 90;
  const validateLongitude = (lng: number) => lng >= -180 && lng <= 180;
  //Coords 0, 0 are in the middle of the ocean so it's safe to assume the default is invalid.
  const isDefaultLocation = userLocation.lat === 0 && userLocation.lng === 0;

  //Get user location
  const getUserLocation = (e: React.FormEvent) => {
    e.preventDefault();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
          toast({
            title: "Error",
            description:
              "Failed to get location. Please check your browser settings and try again!",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation may not be supported by this browser.",
      });
    }
  };

  //Form submit logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!venueSlug || !validateVenueSlug(venueSlug)) {
      console.error("Error: Venue slug required");
      toast({
        title: "Error",
        description: "Venue Slug is required!",
      });
      return;
    }

    if (!cartValue || !validateCartValue(cartValue)) {
      console.error("Error: Please enter a valid cart value");
      toast({
        title: "Error",
        description: "Please enter a valid Cart Value!",
      });
      return;
    }

    if (
      isDefaultLocation ||
      !validateLatitude(userLocation.lat) ||
      !validateLongitude(userLocation.lng)
    ) {
      console.error(
        "Error: Location still set to default. Please click 'Get Location' button to change location from default"
      );
      toast({
        title: "Error",
        description:
          "Invalid location coordinates. Please use the 'Get Location' button to get valid coordinates",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Delivery price calculation started!",
    });
    calculatePrice();
    setSubmitted(true);
  };

  // Calculate price
  const calculatePrice = async () => {
    try {
      const staticData = await fetchVenueStaticData(venueSlug);
      const dynamicData = await fetchVenueDynamicData(venueSlug);
      const venueCoords: [number, number] = staticData.coordinates;
      const userCoords: [number, number] = [userLocation.lng, userLocation.lat];
      const cartValueCents = Number(cartValue) * 100;

      const distance = calculateStraightLineDistance(venueCoords, userCoords);
      setDeliveryDistance(distance);

      const distanceRange = dynamicData.distance_ranges.find(
        (range) =>
          distance >= range.min && (distance < range.max || range.max === 0)
      );

      if (!distanceRange) {
        toast({
          title: "Error",
          description: "Delivery not possible for this distance.",
        });
        return;
      }

      const smallOrderSurcharge = Math.max(
        0,
        dynamicData.order_minimum_no_surcharge - (cartValueCents || 0)
      );
      setSmallOrderSurcharge(smallOrderSurcharge / 100);

      const deliveryFee =
        dynamicData.base_price +
        distanceRange.a +
        Math.round((distanceRange.b * distance) / 10);
      setDeliveryFee(deliveryFee / 100);

      const total = cartValueCents + smallOrderSurcharge + deliveryFee;
      setTotalPrice(total / 100);
    } catch (error) {
      toast({
        title: `${error}`,
        description: "Failed to fetch data or calculate price.",
      });
    }
  };

  // Get distance
  const calculateStraightLineDistance = (
    [lng1, lat1]: [number, number],
    [lng2, lat2]: [number, number]
  ) => {
    return getDistance(
      { latitude: lat1, longitude: lng1 },
      { latitude: lat2, longitude: lng2 }
    );
  };

  return {
    venueSlug,
    setVenueSlug,
    validateVenueSlug,
    cartValue,
    setCartValue,
    validateCartValue,
    userLocation,
    setUserLocation,
    validateLatitude,
    validateLongitude,
    getUserLocation,
    handleSubmit,
    totalPrice,
    deliveryFee,
    deliveryDistance,
    smallOrderSurcharge,
    calculatePrice,
    submitted,
  };
};
