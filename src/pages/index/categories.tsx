import React, { FC, useEffect, useState } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoriesState, selectedCategoryIdState, userState } from "state";
import { useNavigate } from "react-router";
import { ICompany } from "types/backend";
import { callFetchCompany } from "config/api";

export const Categories: FC = () => {
   /*sontx- get donvi*/
    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery]);

   const fetchCompany = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCompany(query);
        //console.log(res);
      
        if (res && res.data) {
            setDisplayCompany(res.data.result);
            setTotal(res.data.meta.total)
        }
    }


  /*sontx- get donvi*/

  const navigate = useNavigate();
  const setSelectedCategoryId = useSetRecoilState(selectedCategoryIdState);

  const gotoCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };

  return (
    <Box className="bg-white grid grid-cols-4 gap-4 p-4">
      {displayCompany?.map((category) => (
        <div
          key={category._id}
          onClick={() => gotoCategory(category._id!=undefined ?category._id:"")}
          className="flex flex-col space-y-2 items-center"
        >
          <img className="w-12 h-12" src={"http://localhost:8000/images/company/"+category.logo} />
          <Text size="xxSmall" className="text-gray">
            {category.name}
          </Text>
        </div>
      ))}
    </Box>
  );
};
