import { useState, useEffect, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditCinema, useFetchCinemas } from "@/hooks/useQueries";
import Spinner from "@/components/Spinner";

const PriceSettings = () => {
  const { data: cinemas, isLoading } = useFetchCinemas();
  const { mutate: updateCinema } = useEditCinema();
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [executivePrice, setExecutivePrice] = useState<number>(0);
  const [premierPrice, setPremierPrice] = useState<number>(0);
  const [classicPrice, setClassicPrice] = useState<number>(0);

  useEffect(() => {
    if (cinemas && selectedCinemaId) {
      const selectedCinema = cinemas.find(
        (cinema) => cinema._id === selectedCinemaId
      );
      if (selectedCinema) {
        setExecutivePrice(selectedCinema.executivePrice);
        setPremierPrice(selectedCinema.premierPrice);
        setClassicPrice(selectedCinema.classicPrice);
      }
    }
  }, [selectedCinemaId, cinemas]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const selectedCinema = cinemas!.find(
      (cinema) => cinema._id === selectedCinemaId
    );
    if (!selectedCinema) return;

    const updatedCinema = {
      ...selectedCinema,
      executivePrice: Number(executivePrice),
      premierPrice: Number(premierPrice),
      classicPrice: Number(classicPrice),
    };

    updateCinema(updatedCinema);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-tuna-100 dark:bg-tuna-1000 p-7 rounded-xl flex flex-col space-y-8 py-10 w-1/2 text-tuna-1000 dark:text-tuna-100">
      <Label className="text-2xl mb-6">Update Cinema Ticket Prices</Label>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col space-y-4">
          <Label htmlFor="cinemaSelect">Select Cinema</Label>
          <select
            title="Select cinema"
            id="cinemaSelect"
            value={selectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
            className="p-2 w-full rounded-md bg-tuna-100 dark:bg-tuna-1000 border border-gray-300 dark:border-gray-700"
          >
            <option value="">Choose a Cinema</option>
            {cinemas?.map((cinema) => (
              <option
                key={cinema._id}
                value={cinema._id}
                className="dark:bg-tuna-1000 hover:dark:bg-tuna-900"
              >
                {cinema.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-4">
          <Label htmlFor="executivePrice">Executive Seating Price</Label>
          <Input
            id="executivePrice"
            type="number"
            placeholder="Enter new price"
            value={executivePrice}
            onChange={(e) => setExecutivePrice(Number(e.target.value))}
            disabled={!selectedCinemaId}
            className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0 "
          />
        </div>
        <div className="flex flex-col space-y-4">
          <Label htmlFor="premierPrice">Premier Seating Price</Label>
          <Input
            id="premierPrice"
            type="number"
            placeholder="Enter new price"
            value={premierPrice}
            onChange={(e) => setPremierPrice(Number(e.target.value))}
            disabled={!selectedCinemaId}
            className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <Label htmlFor="classicPrice">Classic Seating Price</Label>
          <Input
            id="classicPrice"
            type="number"
            placeholder="Enter new price"
            value={classicPrice}
            onChange={(e) => setClassicPrice(Number(e.target.value))}
            disabled={!selectedCinemaId}
            className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
          />
        </div>
        <Button
          type="submit"
          disabled={!selectedCinemaId}
          className="cursor-pointer"
        >
          Update Ticket Prices
        </Button>
      </form>
    </div>
  );
};

export default PriceSettings;
