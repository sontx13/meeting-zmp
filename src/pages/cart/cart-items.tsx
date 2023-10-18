import { FinalPrice } from "components/display/final-price";
import { DisplaySelectedOptions } from "components/display/selected-options";
import { ListRenderer } from "components/list-renderer";
import { ProductPicker } from "components/product/picker";
import React, { FC, useState } from "react";
import { useRecoilValue } from "recoil";
import { cartState } from "state";
import { IJob } from "types/backend";
import { Box, Text } from "zmp-ui";

export const CartItems: FC = () => {
  const cart = useRecoilValue(cartState);
  const [editingItem, setEditingItem] = useState<IJob | undefined>();

  return (
    <Box className="py-3 px-4">
      {cart.length > 0 ? (
        <ProductPicker product={editingItem} >
          {({ open }) => (
           <></>
          )}
        </ProductPicker>
      ) : (
        <Text
          className="bg-background rounded-xl py-8 px-4 text-center text-gray"
          size="xxSmall"
        >
          Không có thông tin cuộc họp
        </Text>
      )}
    </Box>
  );
};
