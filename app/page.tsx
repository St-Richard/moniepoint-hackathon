
import Card from "./components/card";
import { processTransaction } from "./utils/data";

const CardData = await processTransaction();

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <main className="backdrop-blur-sm backdrop-brightness-95 p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-center pb-8">Sales Data</h1>

      {CardData && <div className="flex flex-col gap-8 items-center sm:items-start">
        <Card title="Highest sales volume in a day" data={CardData.maxSalesVolume} />
        <Card title="Highest sales value in a day" data={CardData.highestSalesValue}/>
        <Card title="Most sold product ID by volume" data={CardData.mostSoldProduct} />
        <Card title="Highest hour of the day by average transaction volume" data={CardData.formatedHour}/>
        <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Month
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Sales Staff ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(CardData.highestSalesStaff).map(([month, staff]) => (
              <tr key={month}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
      </main>
    </div>
  );
}
