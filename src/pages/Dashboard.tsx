import { AdditionalMetrics } from "@/components/AdditionalMetrics";
import { CinemasChartCard } from "@/components/CinemasChartCard";
import { CustomersChartCard } from "@/components/CustomersChartCard";
import { EventsLineChartCard } from "@/components/EventsChartCard";
import { LatestReviewsCard } from "@/components/ReviewsChartCard";
import { ScrollArea } from "@/components/ui/scroll-area";

function Dashboard() {
  return (
    <div className="w-full relative">
      <h3 className="text-4xl text-indigo-500 dark:text-indigo-300 pb-4 px-2">
        Dashboard
      </h3>
      <ScrollArea className="h-[75vh] px-4">
        <div className="flex flex-col gap-y-4 py-2 ">
          <div className="grid grid-cols-6 gap-x-4">
            <div className="col-span-2">
              <CinemasChartCard />
            </div>
            <div className="col-span-4">
              <EventsLineChartCard />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-4">
            <div className="col-span-2">
              <CustomersChartCard />
            </div>
            <div className="col-span-2">
              <AdditionalMetrics />
            </div>
            <div className="col-span-2">
              <LatestReviewsCard />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default Dashboard;
