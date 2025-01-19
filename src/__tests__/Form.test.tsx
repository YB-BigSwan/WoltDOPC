import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, vi, Mock } from "vitest";
import Form from "../components/form/Form";
import PriceBreakdown from "../components/form/PriceBreakdown";
import { useFormLogic } from "../hooks/useFormLogic";

// Mock hooks and services
vi.mock("../hooks/useFormLogic", () => ({
  useFormLogic: vi.fn(),
}));
vi.mock("@/services/venueService", () => ({
  fetchVenueStaticData: vi.fn(),
  fetchVenueDynamicData: vi.fn(),
}));

const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Define the type for the return value of useFormLogic
type UseFormLogicReturn = ReturnType<typeof useFormLogic>;

// vitest  getByTestID looks for data-testid not data-test-id so we need to add our own logic and handle undefined ids that could potentially cause issues with the get location button.
const getByDataTestId = (id: string): Element => {
  const element = document.querySelector(`[data-test-id="${id}"]`);
  if (!element) {
    throw new Error(`Unable to find an element by data-test-id: ${id}`);
  }
  return element;
};

describe("Form Component Tests", () => {
  let mockSubmitForm: UseFormLogicReturn["handleSubmit"];

  beforeEach(() => {
    mockSubmitForm = vi.fn();

    // Mock init data
    (useFormLogic as Mock).mockReturnValue({
      venueSlug: "",
      setVenueSlug: vi.fn(),
      cartValue: 0,
      setCartValue: vi.fn(),
      userLocation: { lat: 0, lng: 0 },
      getUserLocation: vi.fn(),
      totalPrice: 0,
      deliveryFee: 0,
      deliveryDistance: 0,
      smallOrderSurcharge: 0,
      handleSubmit: mockSubmitForm,
      submitted: false,
    });
  });

  // Test 1: Render form with correct Fields
  it("should render the form with correct fields", () => {
    render(<Form />);

    expect(getByDataTestId("venueSlug")).toBeInTheDocument();
    expect(getByDataTestId("cartValue")).toBeInTheDocument();
    expect(getByDataTestId("userLatitude")).toBeInTheDocument();
    expect(getByDataTestId("userLongitude")).toBeInTheDocument();
    expect(getByDataTestId("getLocation")).toBeInTheDocument();
  });

  // Test 2: Price calculation should start if form is filled out with valid data and submit is pressed
  it("should trigger price calculation on form submission", async () => {
    render(<Form />);

    fireEvent.change(getByDataTestId("venueSlug"), {
      target: { value: "home-assignment-venue-helsinki" },
    });
    fireEvent.change(getByDataTestId("cartValue"), {
      target: { value: "50.00" },
    });

    fireEvent.click(getByDataTestId("getLocation"));

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalled();
    });
  });

  // Test 3: Price breakdown should be rendered when form is submitted
  it("should display the price breakdown when form is submitted", async () => {
    const mockCalculatePrice = vi.fn();
    (useFormLogic as Mock).mockReturnValue({
      ...useFormLogic(),
      submitted: true,
      calculatePrice: mockCalculatePrice,
      totalPrice: 100,
      cartValue: 50,
      deliveryFee: 5,
      deliveryDistance: 1000,
      smallOrderSurcharge: 2,
    });

    render(<Form />);

    await waitFor(() => {
      const priceBreakdownCartValue = document.querySelector(
        '[data-raw-value="5000"]'
      );
      const deliveryFeeElement = document.querySelector(
        '[data-raw-value="500"]'
      );
      const deliveryDistanceElement = document.querySelector(
        '[data-raw-value="1000"]'
      );
      const smallOrderSurchargeElement = document.querySelector(
        '[data-raw-value="200"]'
      );
      const totalPriceElement = document.querySelector(
        '[data-raw-value="10000"]'
      );

      expect(priceBreakdownCartValue).toHaveTextContent("50.00€");
      expect(deliveryFeeElement).toHaveTextContent("5.00€");
      expect(deliveryDistanceElement).toHaveTextContent("1.00 km");
      expect(smallOrderSurchargeElement).toHaveTextContent("2.00€");
      expect(totalPriceElement).toHaveTextContent("100.00€");
    });
  });

  // Test 4: Check that raw-data-values are formatted correctly
  it("should display raw values in price breakdown correctly", async () => {
    render(
      <PriceBreakdown
        cartValue={50}
        deliveryFee={5}
        deliveryDistance={1000}
        smallOrderSurcharge={2}
        totalPrice={100}
      />
    );

    await waitFor(() => {
      const cartValueSpan = screen.getByText("50.00€").closest("span");
      const deliveryFeeSpan = screen.getByText("5.00€").closest("span");
      const deliveryDistanceSpan = screen.getByText("1.00 km").closest("span");
      const smallOrderSurchargeSpan = screen.getByText("2.00€").closest("span");
      const totalPriceSpan = screen.getByText("100.00€").closest("span");

      expect(cartValueSpan).toHaveAttribute("data-raw-value", "5000");
      expect(deliveryFeeSpan).toHaveAttribute("data-raw-value", "500");
      expect(deliveryDistanceSpan).toHaveAttribute("data-raw-value", "1000");
      expect(smallOrderSurchargeSpan).toHaveAttribute("data-raw-value", "200");
      expect(totalPriceSpan).toHaveAttribute("data-raw-value", "10000");
    });
  });
});
