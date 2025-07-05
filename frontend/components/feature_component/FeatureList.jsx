import { use } from "react";
import Feature from "./Feature";

export default function FeatureList({ query }) {
  const featureData = use(query.promise);
  4;
  return (
    <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr] gap-3.5 bg-light-fg dark:bg-dark-fg rounded-lg p-5 md:p-10">
      {featureData.length === 0 ? (
        <p>No features available</p>
      ) : (
        featureData.map((feature) => (
          <Feature key={feature._id} data={feature} />
        ))
      )}
    </div>
  );
}
