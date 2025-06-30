export default function UploadProgressBar({ value }: { value: number }) {
  return (
    <div className="relative pt-1">
      <div className="flex h-2 mb-4 overflow-hidden text-xs bg-gray-200 rounded">
        <div
          style={{ width: `${value}%` }}
          className="flex flex-col justify-center text-center text-white bg-primaryColor shadow-none whitespace-nowrap transition-all duration-500 ease-in-out"
        />
      </div>
    </div>
  );
}
