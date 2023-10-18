import React, { FC } from "react";
import { Box, Text, useNavigate } from "zmp-ui";
import { ProductPicker } from "./picker";
import { IJob } from "types/backend";

export const ProductItem: FC<{ product: IJob }> = ({ product }) => {
   const navigate = useNavigate();

  const gotoCart = (categoryId: string) => {
    navigate("/cart");
  };

  return (
    <ProductPicker product={product}>
      {() => (
        <div className="space-y-2" onClick={() => gotoCart(product._id!=undefined ?product._id:"")}>
          <Box className="w-full aspect-square relative">
            <img
              loading="lazy"
              src={"http://localhost:8000/images/company/"+product.company?.logo}
              className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover object-center rounded-lg bg-skeleton"
            />
          </Box>
          <Text>{product.name}</Text>
          
        </div>
      )}
    </ProductPicker>
  );
};
