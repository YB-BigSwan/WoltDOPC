import { Button } from "../ui/button";
import { useFormLogic } from "../../hooks/useFormLogic";
import FormHeader from "./FormHeader";
import InputField from "./InputField";
import LocationField from "./LocationField";
import PriceBreakdown from "./PriceBreakdown";

const Form = () => {
  const {
    venueSlug,
    setVenueSlug,
    cartValue,
    setCartValue,
    userLocation,
    getUserLocation,
    totalPrice,
    deliveryFee,
    deliveryDistance,
    smallOrderSurcharge,
    handleSubmit,
    submitted,
  } = useFormLogic();

  return (
    <form
      className="flex flex-col justify-center items-start bg-neutral-600 text-white p-4 rounded-xl gap-4"
      onSubmit={handleSubmit}
    >
      <FormHeader />

      <InputField
        label="Venue Slug"
        value={venueSlug}
        onChange={(e) => setVenueSlug(e.target.value)}
        placeholder="Enter venue slug"
        dataTestId="venueSlug"
      />

      <InputField
        label="Cart Value"
        value={cartValue}
        onChange={(e) => setCartValue(Number(e.target.value))}
        placeholder="Input value: e.g., 10 or 10.00"
        dataTestId="cartValue"
      />

      <LocationField
        getUserLocation={getUserLocation}
        userLocation={userLocation}
      />

      <Button type="submit" className="bg-cyan-300">
        Calculate Delivery Price
      </Button>

      {submitted && (
        <PriceBreakdown
          cartValue={cartValue}
          deliveryFee={deliveryFee}
          deliveryDistance={deliveryDistance}
          smallOrderSurcharge={smallOrderSurcharge}
          totalPrice={totalPrice}
        />
      )}
    </form>
  );
};

export default Form;
