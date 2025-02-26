import React from "react";
import "./App.css";
import { Layout } from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <Layout />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
};

export default App;
