import { ProductItem } from "components/product/item";
import { callFetchCompany, callFetchJobByCompany } from "config/api";
import React, { FC, Suspense, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  categoriesState,
  productsByCategoryState,
  selectedCategoryIdState,
} from "state";
import { ICompany, ICompanyJob, IJob } from 'types/backend';
import { Box, Header, Page, Tabs, Text } from "zmp-ui";

const CategoryPicker: FC = () => {
  /*sontx- get donvi*/
    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery]);

   const fetchCompany = async () => {
        setIsLoading(true)
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
        setIsLoading(false)
    }


  /*sontx- get donvi*/


  return (
    <Tabs
      scrollable
      className="category-tabs"
    >
      {displayCompany?.map((company) => (
        <Tabs.Tab key={company._id} label={company.name}>
          <Suspense>
            <CategoryProducts company={company} 
            />
          </Suspense>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

const CategoryProducts: FC<{ company: ICompany }> = ({ company }) => {
  //console.log(company)
  const [displayJobByCompany, setDisplayJobByCompany] = useState<IJob[] | null>(null);

  useEffect(() => {
        fetchJobByCompany(company);
    }, [company]);

   const fetchJobByCompany = async (company: ICompany) => {
       
        const res_job = await callFetchJobByCompany(company);
        console.log(res_job);
      
        if (res_job && res_job.data) {
            setDisplayJobByCompany(res_job.data.result);
        }
    }
  

  if (displayJobByCompany?.length === 0) {
    return (
      <Box className="flex-1 bg-background p-4 flex justify-center items-center">
        <Text size="xSmall" className="text-gray">
          Không có sản phẩm trong danh mục
        </Text>
      </Box>
    );
  }
  return (
    <Box className="bg-background grid grid-cols-2 gap-4 p-4">
      {displayJobByCompany?.map((job) => (
        // <ProductItem key={job._id} product={job} />
        <Text>
          {job.name}
        </Text>
      ))}
    </Box>
  );
};

const CategoryPage: FC = () => {
  return (
    <Page className="flex flex-col">
      <Header title="Danh mục" />
      <CategoryPicker />
    </Page>
  );
};

export default CategoryPage;
