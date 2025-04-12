export const POICard = ({ poi }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">{poi.name}</h3>
          <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full mb-3">
            {poi.type}
          </span>
        </div>
        <div>
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            {poi.distance} km
          </span>
        </div>
      </div>
      {poi.description && (
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{poi.description}</p>
      )}
    </div>
  );
};
