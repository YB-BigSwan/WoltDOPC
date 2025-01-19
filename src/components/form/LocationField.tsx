import { Button } from "../ui/button";
import InputField from "./InputField";

interface LocationFieldProps {
  getUserLocation: (e: React.FormEvent) => void;
  userLocation: { lat: number; lng: number };
}

const LocationField = ({
  getUserLocation,
  userLocation,
}: LocationFieldProps) => (
  <>
    <InputField
      label="User Latitude"
      value={userLocation.lat}
      onChange={() => {}}
      placeholder="Latitude"
      readOnly
      dataTestId="userLatitude"
    />
    <InputField
      label="User Longitude"
      value={userLocation.lng}
      onChange={() => {}}
      placeholder="Longitude"
      readOnly
      dataTestId="userLongitude"
    />
    <Button
      onClick={getUserLocation}
      className="bg-cyan-300"
      data-test-id="getLocation"
    >
      Get Location
    </Button>
  </>
);

export default LocationField;
