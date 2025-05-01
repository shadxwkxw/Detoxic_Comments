import React from "react";
import cl from "../styles/ToxicMeter.module.css";

const ToxicMeter = ({percentage}) => {
	const angle = (percentage / 100) * 180 - 90

	return (
		<div className={cl.container}>
			<svg width="300" height="160" viewBox="0 0 300 160">
				<defs>
				<linearGradient id="toxGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  					<stop offset="0%" stopColor="#4a90e2" />
  					<stop offset="30%" stopColor="#f5e960" />
  					<stop offset="100%" stopColor="#f85b73" />
				</linearGradient>

				</defs>

				<path
					d="M 30 130 A 120 120 0 0 1 270 130"
					fill="none"
					stroke="url(#toxGradient)"
					strokeWidth="20"
					strokeLinecap="round"
				/>

				<g transform={`rotate(${angle}, 150, 130)`}>
					<line
						x1="150"
						y1="130"
						x2="150"
						y2="60"
						stroke="white"
						strokeWidth="8"
						strokeLinecap="round"
						className={cl.needle}
					/>
				</g>
			</svg>

			<div className={cl.percentage}>{percentage}%</div>
			<div className={cl.label}>УРОВЕНЬ ТОКСИЧНОСТИ</div>
		</div>
	)
}

export default ToxicMeter