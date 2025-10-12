import React from "react";

export const RestaurantCardSkeleton = () => {
	return (
		<div className="bg-white rounded-xl shadow-md overflow-hidden w-[350px] animate-pulse">
			<div className="w-full h-44 bg-gray-200" />
			<div className="p-5">
				<div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
				<div className="h-4 bg-gray-200 rounded w-full mb-4" />
				<div className="flex items-center justify-between text-gray-300 text-sm">
					<div className="flex items-center gap-1">
						<div className="w-5 h-5 bg-gray-200 rounded" />
						<div className="h-4 bg-gray-200 rounded w-10" />
					</div>
					<div className="flex items-center gap-1">
						<div className="w-5 h-5 bg-gray-200 rounded" />
						<div className="h-4 bg-gray-200 rounded w-14" />
					</div>
					<div className="flex items-center gap-1">
						<div className="w-5 h-5 bg-gray-200 rounded" />
						<div className="h-4 bg-gray-200 rounded w-6" />
					</div>
				</div>
			</div>
		</div>
	);
}
