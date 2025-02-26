import React, { useState } from "react";
import Tab from "./tab/Tab";
import { setQuery, updateFeed } from "../../../../../redux/user";
import { useHttpRequestService } from "../../../../../service/HttpRequestService";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../redux/hooks";
import { StyledTabBarContainer } from "./TabBarContainer";
import { useGetPosts } from "../../../../../hooks";

const TabBar = () => {
  const [activeFirstPage, setActiveFirstPage] = useState(true);
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();
  const [query, setQueryValue] = useState("");
  const { t } = useTranslation();
  const limit = 10;
  const skip = 0;
  const { data, error, isLoading } = useGetPosts(query, limit, skip);


  const handleClick = (value: boolean, query: string) => {
    setActiveFirstPage(value);
    setQueryValue(query);
    dispatch(setQuery(query));
    if (data) {
      dispatch(updateFeed(data));
    }
  };

  return (
    <>
      <StyledTabBarContainer>
        <Tab
          active={activeFirstPage}
          text={t("header.for-you")}
          onClick={() => handleClick(true, "")}
        />
        <Tab
          active={!activeFirstPage}
          text={t("header.following")}
          onClick={() => handleClick(false, "following")}
        />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;
