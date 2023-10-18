import { FinalPrice } from "components/display/final-price";
import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import { IJob } from "types/backend";

export const ProductItem: FC<{ product: IJob }> = ({ product }) => {
  return (
    <ProductPicker product={product}>
      {({ open }) => (
        <div className="space-y-2" onClick={open}>
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
