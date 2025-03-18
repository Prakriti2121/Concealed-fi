import React from "react";

const Container = ({ children }: React.PropsWithChildren) => {
  return <div className="container mx-auto px-4 md:max-w-8xl">{children}</div>;
};

export default Container;
