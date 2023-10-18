import React, { FC, Suspense, useEffect, useState } from "react";
import { Section } from "components/section";
import { Box,useNavigate } from "zmp-ui";
import { ProductItem } from "components/product/item";
import { ProductItemSkeleton } from "components/skeletons";
import { callFetchJob } from "config/api";
import { IJob } from "types/backend";

export const ProductListContent: FC = () => {

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

  return (
    <Section title="Danh sách cuộc họp">
      <Box className="grid grid-cols-2 gap-4">
        {displayJob?.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductListFallback: FC = () => {
  const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }
    
  return (
    <Section title="Danh sách cuộc họp">
      <Box className="grid grid-cols-2 gap-4">
        {displayJob?.map((_, i) => (
          <ProductItemSkeleton key={i} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductList: FC = () => {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent />
    </Suspense>
  );
};
