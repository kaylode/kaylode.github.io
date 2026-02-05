"use client";

import React, { useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// URL to world topology with ISO codes
const geoUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface VisitData {
	country: string;
	code: string; // ISO3 code
	visits: number;
}

interface TravelMapProps {
	visited: VisitData[];
}

const TravelMap: React.FC<TravelMapProps> = ({ visited }) => {
	const [tooltipContent, setTooltipContent] = useState("");
	const [tooltipFlag, setTooltipFlag] = useState("");
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const maxVisits = Math.max(...visited.map((v) => v.visits), 1);

	const colorScale = scaleLinear<string>()
		.domain([0, maxVisits])
		.range(["#1e293b", "#3b82f6"]); // Slate-800 to Blue-500

	const getVisitData = (geo: any) => {
		const iso3 = geo.properties.ISO_A3 || geo.properties.iso_a3 || geo.id;
		const name = geo.properties.name || geo.properties.NAME;
		return visited.find((v) => v.code === iso3 || v.country === name);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		const bounds = e.currentTarget.getBoundingClientRect();
		setMousePos({
			x: e.clientX - bounds.left,
			y: e.clientY - bounds.top
		});
	};

	return (
		<div
			className="relative w-full aspect-[16/9] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl cursor-default"
			onMouseMove={handleMouseMove}
		>
			<ComposableMap projectionConfig={{ scale: 180, center: [20, -9] }}>
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => {
							const visitData = getVisitData(geo);
							const isVisited = !!visitData;

							return (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									onMouseEnter={() => {
										const name = geo.properties.name || geo.properties.NAME;
										if (isVisited) {
											setTooltipContent(`${visitData.country}: ${visitData.visits} visits`);
											const iso2Map: Record<string, string> = {
												'VNM': 'vn', 'IRL': 'ie', 'GBR': 'gb', 'FRA': 'fr',
												'DEU': 'de', 'KOR': 'kr', 'SGP': 'sg', 'ITA': 'it'
											};
											const iso2 = iso2Map[visitData.code] || visitData.code.substring(0, 2).toLowerCase();
											setTooltipFlag(`https://flagcdn.com/w40/${iso2}.png`);
										} else {
											setTooltipContent(name);
											setTooltipFlag("");
										}
									}}
									onMouseLeave={() => {
										setTooltipContent("");
										setTooltipFlag("");
									}}
									style={{
										default: {
											fill: isVisited ? colorScale(visitData.visits) : "#0f172a",
											outline: "none",
											stroke: "#1e293b",
											strokeWidth: 0.2,
											transition: "all 250ms",
										},
										hover: {
											fill: isVisited ? "#3b82f6" : "#1e293b",
											outline: "none",
											stroke: "#3b82f6",
											strokeWidth: 0.5,
											cursor: "pointer",
										},
										pressed: {
											fill: "#1e40af",
											outline: "none",
										},
									}}
								/>
							);
						})
					}
				</Geographies>
			</ComposableMap>

			{tooltipContent && (
				<div
					className="absolute bg-slate-900/95 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg shadow-2xl flex items-center gap-2 animate-in fade-in duration-200 pointer-events-none z-50 whitespace-nowrap"
					style={{
						left: mousePos.x - 40,
						top: mousePos.y - 40,
						transform: 'translate(0, 0)'
					}}
				>
					{tooltipFlag && (
						<img
							src={tooltipFlag}
							alt="flag"
							className="w-5 h-auto rounded-[1px] border border-slate-700"
						/>
					)}
					<span className="text-xs font-bold text-slate-100 italic tracking-tight">
						{tooltipContent}
					</span>
				</div>
			)}

			<div className="absolute top-4 right-4 flex flex-col gap-1 items-end bg-slate-950/40 backdrop-blur-sm p-2 rounded-md">
				<span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Visit Intensity</span>
				<div className="h-1.5 w-20 bg-gradient-to-r from-slate-800 to-blue-500 rounded-full" />
			</div>
		</div>
	);
};

export default TravelMap;
