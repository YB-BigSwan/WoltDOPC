import { Separator } from "../ui/separator";

interface PriceBreakdownProps {
  cartValue: number;
  deliveryFee: number;
  deliveryDistance: number;
  smallOrderSurcharge: number;
  totalPrice: number;
}

const PriceBreakdown = ({
  cartValue,
  deliveryFee,
  deliveryDistance,
  smallOrderSurcharge,
  totalPrice,
}: PriceBreakdownProps) => (
  <div className=" flex flex-col w-full gap-2">
    <Separator />
    <h3 className="font-semibold">Price Breakdown</h3>
    <Separator />
    <div className="flex justify-between w-full">
      <p>Cart Value</p>
      <span data-raw-value={cartValue * 100}>{cartValue.toFixed(2)}€</span>
    </div>
    <div className="flex justify-between w-full">
      <p>Delivery Fee</p>
      <span data-raw-value={deliveryFee * 100}>{deliveryFee.toFixed(2)}€</span>
    </div>
    <div className="flex justify-between w-full">
      <p>Delivery Distance</p>
      <span data-raw-value={deliveryDistance}>
        {(deliveryDistance / 1000).toFixed(2)} km
      </span>
    </div>
    <div className="flex justify-between w-full">
      <p>Small Order Surcharge</p>
      <span data-raw-value={smallOrderSurcharge * 100}>
        {smallOrderSurcharge.toFixed(2)}€
      </span>
    </div>
    <Separator />
    <div className="flex justify-between w-full">
      <p>Total Price</p>
      <span data-raw-value={totalPrice * 100}>{totalPrice.toFixed(2)}€</span>
    </div>
  </div>
);

export default PriceBreakdown;
