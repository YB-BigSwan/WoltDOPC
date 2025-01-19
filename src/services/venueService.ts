import apiClient from "./apiClient";

export interface VenueStaticData {
  coordinates: [number, number];
}

export interface VenueDynamicData {
  order_minimum_no_surcharge: number;
  base_price: number;
  distance_ranges: Array<{
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
  }>;
}

export const fetchVenueStaticData = async (
  venueSlug: string
): Promise<VenueStaticData> => {
  const response = await apiClient.get(`/venues/${venueSlug}/static`);
  const coordinates = response.data.venue_raw.location.coordinates;
  return { coordinates };
};

export const fetchVenueDynamicData = async (
  venueSlug: string
): Promise<VenueDynamicData> => {
  const response = await apiClient.get(`/venues/${venueSlug}/dynamic`);
  const { order_minimum_no_surcharge, delivery_pricing } =
    response.data.venue_raw.delivery_specs;
  return {
    order_minimum_no_surcharge,
    base_price: delivery_pricing.base_price,
    distance_ranges: delivery_pricing.distance_ranges,
  };
};
