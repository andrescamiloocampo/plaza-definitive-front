import { ReactElement } from "react";
import { Cart } from "@/app/components/organisms";

export default function ShoppingCartPage(): ReactElement {
    return(
        <div className="py-5">
            <Cart/>
        </div>
    );
}