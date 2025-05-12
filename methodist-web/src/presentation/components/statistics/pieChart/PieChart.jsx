import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./PieChart.module.css";
import * as d3 from "d3";

const MARGIN_X = 50;
const MARGIN_Y = 50;
const LEGEND_WIDTH = 60; // Ширина области для легенды

const colors = [
    "#22B07D",
    "#FF7C3B",
    "#C184FF",
    "#1977FF"
];

export const PieChart = ({ data }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current?.parentElement) {
                const container = containerRef.current.parentElement;
                const computedStyle = window.getComputedStyle(container);
                const horizontalPadding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

                const availableWidth = container.clientWidth - horizontalPadding;
                const maxRadius = Math.min((availableWidth - LEGEND_WIDTH) / 2 - MARGIN_X, 200);
                const radius = Math.max(maxRadius, 50);

                setDimensions({
                    width: availableWidth,
                    height: radius * 2 + 2 * MARGIN_Y
                });
            }
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current?.parentElement) {
            resizeObserver.observe(containerRef.current.parentElement);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const radius = Math.min(
        Math.max((dimensions.width - LEGEND_WIDTH) / 2 - MARGIN_X, 50),
        dimensions.height / 2 - MARGIN_Y
    );

    const allZero = useMemo(() => {
        return data.every(item => item.value === 0);
    }, [data]);

    const filteredData = useMemo(() => {
        if (allZero) return data;
        return data.filter(item => item.value > 0);
    }, [data, allZero]);

    const pie = useMemo(() => {
        const pieGenerator = d3.pie().value((d) => d.value);
        return pieGenerator(allZero ? data.map(item => ({ ...item, value: 1 })) : filteredData);
    }, [filteredData, data, allZero]);

    const arcGenerator = d3.arc();

    const shapes = pie.map((grp, i) => {
        const sliceInfo = {
            innerRadius: radius * 0.6, // Внутренний радиус для кольцевой диаграммы
            outerRadius: radius,
            startAngle: grp.startAngle,
            endAngle: grp.endAngle,
        };
        const centroid = arcGenerator.centroid(sliceInfo);
        const slicePath = arcGenerator(sliceInfo);

        return (
            <g
                key={i}
                className={styles.slice}
                onMouseEnter={() => {
                    const paths = svgRef.current?.querySelectorAll(`.${styles.slice} path`);
                    paths?.forEach(path => {
                        path.style.opacity = "0.5";
                    });
                    const currentPath = svgRef.current?.querySelector(`.${styles.slice}:nth-child(${i+1}) path`);
                    if (currentPath) {
                        currentPath.style.opacity = "1";
                    }
                }}
                onMouseLeave={() => {
                    const paths = svgRef.current?.querySelectorAll(`.${styles.slice} path`);
                    paths?.forEach(path => {
                        path.style.opacity = "1";
                    });
                }}
            >
                <path
                    d={slicePath}
                    fill={allZero ? "#CCCCCC" : colors[i % colors.length]}
                />
                {!allZero && (
                    <text
                        x={centroid[0]}
                        y={centroid[1]}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={14}
                        fill="var(--color-title)"
                        fontWeight="bold"
                    >
                        {grp.value}
                    </text>
                )}
            </g>
        );
    });

    // Создаем элементы легенды
    const legendItems = data.map((item, i) => (
        <g key={i} transform={`translate(0, ${i * 25})`}>
            <rect
                x={0}
                y={0}
                width={20}
                height={20}
                fill={allZero ? "#CCCCCC" : colors[i % colors.length]}
            />
            <text
                x={30}
                y={15}
                fontSize={14}
                fill="var(--color-title)"
                fontFamily="var(--font-raleway), serif"
            >
                {item.name}
            </text>
        </g>
    ));

    return (
        <div className={styles.chartContainer} ref={containerRef}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                preserveAspectRatio="xMidYMid meet"
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible'
                }}
            >
                {/* Группа для легенды */}
                <g
                    transform={`translate(20, ${dimensions.height / 2 - (data.length * 25) / 2})`}
                    className={styles.legend}
                >
                    {legendItems}
                </g>

                {/* Группа для диаграммы */}
                <g
                    transform={`translate(${LEGEND_WIDTH + dimensions.width / 2}, ${dimensions.height / 2})`}
                    className={styles.container}
                >
                    {shapes}
                    {allZero && (
                        <text
                            x={0}
                            y={radius + 30}
                            textAnchor="middle"
                            fontSize={14}
                            fill="var(--color-title)"
                            fontFamily="var(--font-raleway), serif"
                        >
                            В этот период не было мероприятий
                        </text>
                    )}
                </g>
            </svg>
        </div>
    );
};