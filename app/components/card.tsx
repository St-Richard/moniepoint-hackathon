export default function Card({ title, data }: { title: string, data: any }) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md">
        <div className="text-gray-800">
            {title}
        </div>
        <div className="text-4xl font-bold">
            {data}
        </div>
      </div>
    );
  }